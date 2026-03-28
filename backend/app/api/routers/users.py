from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db

router = APIRouter()

@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()
        return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None
            } for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.query(models.CartItems).filter(models.CartItems.user_id == user_id).delete()
    db.query(models.Order).filter(models.Order.user_id == user_id).delete()
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.put("/users/{user_id}")
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing = db.query(models.User).filter(
        ((models.User.username == user_update.username) | (models.User.email == user_update.email)) &
        (models.User.id != user_id)
    ).first()
    
    if existing:
        if existing.username == user_update.username:
            raise HTTPException(status_code=400, detail="Username already in use")
        if existing.email == user_update.email:
            raise HTTPException(status_code=400, detail="Email already in use")

    db_user.username = user_update.username
    db_user.email = user_update.email
    db.commit()
    db.refresh(db_user)
    return {"message": "User updated successfully"}

