from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db, get_current_user

router = APIRouter()

cart_fallback = []

@router.post("/cart")
def add_to_cart(cart_item: schemas.CartItems, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        existing = db.query(models.CartItems).filter(
            models.CartItems.product_id == cart_item.product_id,
            models.CartItems.user_id == current_user.id,
        ).first()
        if existing:
            existing.quantity = (existing.quantity or 0) + 1
            db.commit()
            db.refresh(existing)
            return {"message": "Item quantity updated", "cart_item": {"product_id": existing.product_id, "quantity": existing.quantity, "id": existing.id}}

        new_item = models.CartItems(
            user_id=current_user.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return {"message": "Item added to cart", "cart_item": {"product_id": new_item.product_id, "quantity": new_item.quantity, "id": new_item.id}}
    except Exception:
        for item in cart_fallback:
            if item.get("product_id") == cart_item.product_id and item.get("user_id") == current_user.id:
                item["quantity"] = (item.get("quantity", 0)) + 1
                return {"message": "Item quantity updated in fallback cart", "cart_item": item}

        cart_fallback.append({"user_id": current_user.id, "product_id": cart_item.product_id, "quantity": cart_item.quantity})
        return {"message": "Item added to fallback cart", "cart_item": cart_fallback[-1]}

@router.get("/cart")
def get_cart(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        cart_items = db.query(models.CartItems).filter(models.CartItems.user_id == current_user.id).all()
        return [{"user": item.user_id, "product_id": item.product_id, "quantity": item.quantity, "id": item.id} for item in cart_items]
    except Exception:
        return [item for item in cart_fallback if item.get("user_id") == current_user.id]

@router.delete("/cart/remove/{product_id}")
def remove_from_cart(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        deleted = db.query(models.CartItems).filter(
            models.CartItems.product_id == product_id,
            models.CartItems.user_id == current_user.id
        ).delete()
        db.commit()
        return {"message": "Item removed from cart", "deleted": deleted}
    except Exception:
        global cart_fallback
        cart_fallback = [item for item in cart_fallback if not (item["product_id"] == product_id and item.get("user_id") == current_user.id)]
        return {"message": "Item removed from fallback cart"}

@router.put("/cart/{item_id}")
def update_cart_quantity(item_id: int, cart_item: schemas.CartItems, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        db_item = db.query(models.CartItems).filter(models.CartItems.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        if db_item.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Cannot modify another user's cart item")
        
        db_item.quantity = cart_item.quantity
        db.commit()
        db.refresh(db_item)
        return {"message": "Quantity updated", "cart_item": {"product_id": db_item.product_id, "quantity": db_item.quantity, "id": db_item.id}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
