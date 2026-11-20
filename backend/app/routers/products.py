import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Product, User
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Affiliate Products"])


@router.get("", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = None,
    occasion: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    if category and category != "all":
        query = query.filter(Product.category == category)
    items = query.all()
    if occasion and occasion != "all":
        items = [p for p in items if occasion in (p.occasion_tags or [])]
    return items


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    prod_id = prod_in.id or f"p-{uuid.uuid4().hex[:6]}"
    product = Product(
        id=prod_id,
        name=prod_in.name,
        category=prod_in.category,
        image_url=prod_in.image_url,
        affiliate_url=prod_in.affiliate_url,
        price_note=prod_in.price_note,
        occasion_tags=prod_in.occasion_tags or [],
        is_active=prod_in.is_active,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    prod_in: ProductUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_dict = prod_in.dict(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
