# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, database, schemas # Import schemas here

# 1. Create the database tables automatically if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# UPDATE THIS SECTION
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # OR use ["*"] to allow everything for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. Use Pydantic Schema (schemas.UserCreate) instead of dict
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # ORM Query: Check if user exists
    user_exists = db.query(models.User).filter(models.User.email == user.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = pwd_context.hash(user.password)
    
    # ORM Add: Create new user instance
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # Refreshes the instance with new data (like ID)
    
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # ORM Query
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful", "username": db_user.username}


@app.post("/admin/login")
def admin_login(admin: schemas.AdminLogin, db: Session = Depends(get_db)):
    # Look in the AdminUser table, NOT the User table
    db_admin = db.query(models.AdminUsers).filter(models.AdminUsers.username == admin.username).first()

    # Verify password
    if not db_admin or not pwd_context.verify(admin.password, db_admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Admin Credentials")
    
    return {"message": "Admin Login successful", "admin_user": db_admin.username}


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).all()
    return [schemas.ProductResponse.model_validate(p) for p in products]


@app.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Products(
        name=product.name,
        description=product.description,
        price=product.price,
        image_url=product.image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created successfully", "product": new_product}

# Fallback in-memory cart used when DB is unavailable (useful for local dev)
cart_fallback = []


@app.post("/cart")
def add_to_cart(cart_item: schemas.CartItems, db: Session = Depends(get_db)):
    try:
        # Check if the product already exists in the cart; if so, increment its quantity
        existing = db.query(models.CartItems).filter(models.CartItems.product_id == cart_item.product_id).first()
        if existing:
            # increment by 1 when adding the same item again
            existing.quantity = (existing.quantity or 0) + 1
            db.commit()
            db.refresh(existing)
            return {"message": "Item quantity updated", "cart_item": {"product_id": existing.product_id, "quantity": existing.quantity, "id": existing.id}}

        # Otherwise create a new cart item
        new_item = models.CartItems(
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        # Return the created DB row (as plain dict)
        return {"message": "Item added to cart", "cart_item": {"product_id": new_item.product_id, "quantity": new_item.quantity, "id": new_item.id}}
    except Exception:
        # If DB insert fails, fall back to an in-memory cart so frontend still works
        # If same product exists in fallback, increment its quantity by 1
        for item in cart_fallback:
            if item.get("product_id") == cart_item.product_id:
                item["quantity"] = (item.get("quantity", 0)) + 1
                return {"message": "Item quantity updated in fallback cart", "cart_item": item}

        cart_fallback.append({"product_id": cart_item.product_id, "quantity": cart_item.quantity})
        return {"message": "Item added to fallback cart", "cart_item": cart_fallback[-1]}

@app.get("/cart")
def get_cart(db: Session = Depends(get_db)):
    try:
        cart_items = db.query(models.CartItems).all()
        return [ {"product_id": item.product_id, "quantity": item.quantity, "id": item.id} for item in cart_items]
    except Exception:
        # Return fallback in-memory cart if DB is unavailable
        return cart_fallback

@app.delete("/cart/remove/{product_id}")
def remove_from_cart(product_id: int, db: Session = Depends(get_db)):
    try:
        db.query(models.CartItems).filter(models.CartItems.product_id == product_id).delete()
        db.commit()
        return {"message": "Item removed from cart"}
    except Exception:
        global cart_fallback
        cart_fallback = [item for item in cart_fallback if item["product_id"] != product_id]
        return {"message": "Item removed from fallback cart"}


@app.put("/cart/{item_id}")
def update_cart_quantity(item_id: int, cart_item: schemas.CartItems, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.CartItems).filter(models.CartItems.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        db_item.quantity = cart_item.quantity
        db.commit()
        db.refresh(db_item)
        return {"message": "Quantity updated", "cart_item": {"product_id": db_item.product_id, "quantity": db_item.quantity, "id": db_item.id}}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))