from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db, get_current_user
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()

def send_order_email(order_id: int, user_email: str, total_amount: float):
    # TODO: Replace with real SMTP credentials when deploying
    sender_email = "heshankoralagamage2002@gmail.com"
    sender_password = "icdw hhch rjpm jfrr"
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = user_email
    msg['Cc'] = sender_email
    msg['Subject'] = f"Order Confirmation - #{order_id}"
    
    body = f"Thank you for your order!\n\nYour order #{order_id} for LKR {total_amount:,.2f} has been successfully placed and is pending review."
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Example using Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg, from_addr=sender_email, to_addrs=[user_email, sender_email])
        server.quit()
        print(f"Order Notification: Email sent successfully to {user_email} (CC to Admin) for order #{order_id}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/orders")
def create_order(
    order: schemas.OrderCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    calculated_total = sum(item.price * item.quantity for item in order.items)

    new_order = models.Order(
        user_id=current_user.id,
        total_amount=calculated_total,
        delivery_date=order.delivery_date
    )
    
    for item in order.items:
        product_db = db.query(models.Products).filter(models.Products.id == item.product_id).first()
        item_cost = float(product_db.cost_price) if product_db else 0.0
        
        new_item = models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            cost_price=item_cost
        )
        new_order.items.append(new_item)

    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        db.query(models.CartItems).filter(models.CartItems.user_id == current_user.id).delete()
        db.commit()

        # Dispatch automated confirmation email synchronously
        if current_user.email:
            send_order_email(new_order.id, current_user.email, float(calculated_total))

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
            "delivery_date": order.delivery_date,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "cost_price": float(item.cost_price)
                } for item in order.items
            ]
        } for order in orders
    ]
