import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Store, User
from app.schemas.store import StoreCreate, StoreUpdate, StoreOut
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/stores", tags=["Local Trusted Stores"])


@router.get("", response_model=List[StoreOut])
def list_stores(
    city: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    query = db.query(Store)
    if active_only:
        query = query.filter(Store.is_active == True)
    if city and city != "all":
        query = query.filter(Store.city.ilike(f"%{city}%"))
    return query.all()


@router.get("/{store_id}", response_model=StoreOut)
def get_store(store_id: str, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.post("", response_model=StoreOut, status_code=status.HTTP_201_CREATED)
def create_store(
    store_in: StoreCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    store_id = store_in.id or f"s-{uuid.uuid4().hex[:6]}"
    store = Store(
        id=store_id,
        name=store_in.name,
        area=store_in.area,
        city=store_in.city,
        map_url=store_in.map_url,
        speciality=store_in.speciality,
        discount_percent=store_in.discount_percent,
        discount_note=store_in.discount_note,
        is_active=store_in.is_active,
    )
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@router.put("/{store_id}", response_model=StoreOut)
def update_store(
    store_id: str,
    store_in: StoreUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    update_dict = store_in.dict(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(store, field, val)

    db.commit()
    db.refresh(store)
    return store


@router.delete("/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_store(
    store_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    db.delete(store)
    db.commit()
    return None
