# schemas.py
from typing import Optional
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