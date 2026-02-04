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