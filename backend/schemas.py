# schemas.py
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username:str
    password: str


class AdminCreate(BaseModel):
    username:str
    hashed_password: str


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: int
    image_url: str | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: int
    image_url: str | None = None

    class Config:
        from_attributes = True


class CartItems(BaseModel):
    user_id: int
    product_id: int
    quantity: int


class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price: float 

class OrderCreate(BaseModel):
    user_id: int
    items: List[OrderItem] 
    