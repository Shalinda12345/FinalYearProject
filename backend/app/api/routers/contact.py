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

@router.get("/contact/inquiries")
def get_contact_inquiries(db: Session = Depends(get_db)):
    inquiries = db.query(models.ContactInquiry).order_by(models.ContactInquiry.created_at.desc()).all()
    return [
        {
            "id": inq.id,
            "name": inq.name,
            "email": inq.email,
            "message": inq.message,
            "created_at": inq.created_at.isoformat() if inq.created_at else None
        }
        for inq in inquiries
    ]
