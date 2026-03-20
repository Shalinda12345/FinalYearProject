from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db

router = APIRouter()

@router.post("/contact")
def create_contact(inquiry: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_inquiry = models.ContactInquiry(
        name=inquiry.name,
        email=inquiry.email,
        message=inquiry.message
    )
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return {"message": "Inquiry received successfully!"}
