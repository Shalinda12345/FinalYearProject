# main.py
from ast import List
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
    
    return {"message": "Login successful", "id": db_user.id, "username": db_user.username, "email": db_user.email}


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
        # Check if the product already exists in the cart for the same user; if so, increment its quantity
        existing = db.query(models.CartItems).filter(
            models.CartItems.product_id == cart_item.product_id,
            models.CartItems.user_id == cart_item.user_id,
        ).first()
        if existing:
            # increment by 1 when adding the same item again
            existing.quantity = (existing.quantity or 0) + 1
            db.commit()
            db.refresh(existing)
            return {"message": "Item quantity updated", "cart_item": {"product_id": existing.product_id, "quantity": existing.quantity, "id": existing.id}}

        # Otherwise create a new cart item
        new_item = models.CartItems(
            user_id=cart_item.user_id,
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
        # Make fallback store user-scoped items
        for item in cart_fallback:
            if item.get("product_id") == cart_item.product_id and item.get("user_id") == cart_item.user_id:
                item["quantity"] = (item.get("quantity", 0)) + 1
                return {"message": "Item quantity updated in fallback cart", "cart_item": item}

        cart_fallback.append({"user_id": cart_item.user_id, "product_id": cart_item.product_id, "quantity": cart_item.quantity})
        return {"message": "Item added to fallback cart", "cart_item": cart_fallback[-1]}

@app.get("/cart")
def get_cart(user_id: int | None = None, db: Session = Depends(get_db)):
    """Return cart items. If `user_id` is provided, return only that user's items.
    If DB is unavailable, return fallback items (optionally filtered by user_id)."""
    try:
        if user_id is not None:
            cart_items = db.query(models.CartItems).filter(models.CartItems.user_id == user_id).all()
        else:
            cart_items = db.query(models.CartItems).all()

        return [{"user": item.user_id, "product_id": item.product_id, "quantity": item.quantity, "id": item.id} for item in cart_items]
    except Exception:
        if user_id is None:
            return cart_fallback
        return [item for item in cart_fallback if item.get("user_id") == user_id]

@app.delete("/cart/remove/{product_id}")
def remove_from_cart(product_id: int, user_id: int | None = None, db: Session = Depends(get_db)):
    """Remove a product from a user's cart. If `user_id` provided, only remove for that user."""
    try:
        query = db.query(models.CartItems).filter(models.CartItems.product_id == product_id)
        if user_id is not None:
            query = query.filter(models.CartItems.user_id == user_id)

        deleted = query.delete()
        db.commit()
        return {"message": "Item removed from cart", "deleted": deleted}
    except Exception:
        global cart_fallback
        if user_id is None:
            cart_fallback = [item for item in cart_fallback if item["product_id"] != product_id]
        else:
            cart_fallback = [item for item in cart_fallback if not (item["product_id"] == product_id and item.get("user_id") == user_id)]
        return {"message": "Item removed from fallback cart"}


@app.put("/cart/{item_id}")
def update_cart_quantity(item_id: int, cart_item: schemas.CartItems, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.CartItems).filter(models.CartItems.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        # Ensure the operation is performed by the owner of the cart item
        if db_item.user_id != cart_item.user_id:
            raise HTTPException(status_code=403, detail="Cannot modify another user's cart item")
        
        db_item.quantity = cart_item.quantity
        db.commit()
        db.refresh(db_item)
        return {"message": "Quantity updated", "cart_item": {"product_id": db_item.product_id, "quantity": db_item.quantity, "id": db_item.id}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


@app.post("/orders")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    calculated_total = sum(item.price * item.quantity for item in order.items)

    # 2. Create the Order Header
    new_order = models.Order(
        user_id=order.user_id,
        total_amount=calculated_total
    )
    
    # 3. Add items to the order object (SQLAlchemy handles the keys automatically)
    for item in order.items:
        new_item = models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        new_order.items.append(new_item)

    # 4. Save everything in ONE transaction
    try:
        db.add(new_order)
        db.commit()      # This pushes the Order AND all OrderItems to DB
        db.refresh(new_order)
        return {"status": "success", "order_id": new_order.id, "total": calculated_total}
    except Exception as e:
        db.rollback()    # If anything fails, undo everything
        raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/orders")
# def get_orders(db: Session = Depends(get_db)):
#     orders = db.query(models.Order).all()
#     return [schemas.OrderItem.model_validate(o) for o in orders]



# main.py (Add this to your existing file)
from datetime import datetime


    
# @app.get("/api/activities")
# async def get_activities():
#     # Simulate fetching a different dataset
#     return [
#         {"id": 1, "action": "New client 'Acme Corp' added", "timestamp": "2023-10-24 10:30"},
#         {"id": 2, "action": "Project 'Beta' marked complete", "timestamp": "2023-10-23 14:15"},
#         {"id": 3, "action": "Invoice #402 paid", "timestamp": "2023-10-22 09:00"},
#     ]


@app.get("/orders")
async def get_orders(user_id: int | None = None, db: Session = Depends(get_db)):
    # orders = db.query(models.Order).all()
    try:
        if user_id is not None:
            orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
        else:
            orders = db.query(models.Order).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": float(order.total_amount),
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": float(item.price)
                } for item in order.items
            ]
        } for order in orders
    ]
