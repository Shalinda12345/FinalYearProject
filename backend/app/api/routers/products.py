from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api.deps import get_db

router = APIRouter()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).all()
    return [schemas.ProductResponse.model_validate(p) for p in products]

@router.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Products(
        name=product.name,
        description=product.description,
        price=product.price,
        cost_price=product.cost_price,
        image_url=product.image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created successfully", "product": new_product}

@router.put("/products/{product_id}")
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.cost_price = product.cost_price
    db_product.image_url = product.image_url
    db.commit()
    db.refresh(db_product)
    return {"message": "Product updated successfully", "product": schemas.ProductResponse.model_validate(db_product)}

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
