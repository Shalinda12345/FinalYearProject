from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.post("/orders")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    calculated_total = sum(item.price * item.quantity for item in order.items)

    new_order = models.Order(
        user_id=current_user.id,
        total_amount=calculated_total
    )
    
    for item in order.items:
        new_item = models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        new_order.items.append(new_item)

    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        db.query(models.CartItems).filter(models.CartItems.user_id == current_user.id).delete()
        db.commit()

        return {"status": "success", "order_id": new_order.id, "total": calculated_total}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders")
async def get_orders(user_id: int | None = None, db: Session = Depends(get_db)):
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
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": float(item.price)
                } for item in order.items
            ]
        } for order in orders
    ]
