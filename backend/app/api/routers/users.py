from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
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
