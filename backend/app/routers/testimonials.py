import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Testimonial, User
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialOut
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])


@router.get("", response_model=List[TestimonialOut])
def list_testimonials(
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(Testimonial)
    if featured_only:
        query = query.filter(Testimonial.is_featured == True)
    return query.order_by(Testimonial.created_at.desc()).all()


@router.post("", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    test_in: TestimonialCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    test_id = test_in.id or f"test-{uuid.uuid4().hex[:6]}"
    item = Testimonial(
        id=test_id,
        name=test_in.name,
        city=test_in.city,
        occasion=test_in.occasion,
        text=test_in.text,
        text_tamil=test_in.text_tamil,
        photo_url=test_in.photo_url,
        rating=test_in.rating,
        is_featured=test_in.is_featured,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(
    testimonial_id: str,
    test_in: TestimonialUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    update_dict = test_in.dict(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(item)
    db.commit()
    return None
