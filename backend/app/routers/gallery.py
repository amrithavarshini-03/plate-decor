import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import GalleryItem, GalleryHotspot, User
from app.schemas.gallery import (
    GalleryItemCreate,
    GalleryItemUpdate,
    GalleryItemOut,
    HotspotCreate,
    HotspotOut,
)
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])


@router.get("", response_model=List[GalleryItemOut])
def list_gallery_items(
    occasion: Optional[str] = None,
    plate_type: Optional[str] = None,
    color_theme: Optional[str] = None,
    budget: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(GalleryItem)
    if occasion and occasion != "all":
        query = query.filter(GalleryItem.occasion == occasion)
    if plate_type and plate_type != "all":
        query = query.filter(GalleryItem.plate_type == plate_type)
    if color_theme and color_theme != "all":
        query = query.filter(GalleryItem.color_theme == color_theme)
    if budget and budget != "all":
        query = query.filter(GalleryItem.budget == budget)
    if featured is not None:
        query = query.filter(GalleryItem.is_featured == featured)

    return query.order_by(GalleryItem.sort_order.asc(), GalleryItem.created_at.desc()).all()


@router.get("/{item_id}", response_model=GalleryItemOut)
def get_gallery_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery plate arrangement not found")
    return item


@router.post("", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
def create_gallery_item(
    item_in: GalleryItemCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item_id = item_in.id or f"gal-{uuid.uuid4().hex[:6]}"
    item = GalleryItem(
        id=item_id,
        title=item_in.title,
        title_tamil=item_in.title_tamil,
        occasion=item_in.occasion,
        plate_type=item_in.plate_type,
        color_theme=item_in.color_theme,
        budget=item_in.budget,
        price=item_in.price,
        price_range=item_in.price_range or (f"₹{int(item_in.price):,}" if item_in.price else None),
        image_url=item_in.image_url,
        is_featured=item_in.is_featured,
        sort_order=item_in.sort_order,
        description=item_in.description,
    )
    db.add(item)
    db.flush()

    if item_in.hotspots:
        for hs in item_in.hotspots:
            db_hs = GalleryHotspot(
                gallery_item_id=item_id,
                x_percent=hs.x_percent,
                y_percent=hs.y_percent,
                product_id=hs.product_id,
                title=hs.title,
                product_name=hs.product_name,
                affiliate_url=hs.affiliate_url,
                price_note=hs.price_note,
            )
            db.add(db_hs)

    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=GalleryItemOut)
def update_gallery_item(
    item_id: str,
    item_in: GalleryItemUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    update_dict = item_in.dict(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(
    item_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return None


@router.post("/{item_id}/hotspots", response_model=HotspotOut, status_code=status.HTTP_201_CREATED)
def add_gallery_hotspot(
    item_id: str,
    hotspot_in: HotspotCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin interactive hotspot placement on image."""
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    hotspot = GalleryHotspot(
        gallery_item_id=item_id,
        x_percent=hotspot_in.x_percent,
        y_percent=hotspot_in.y_percent,
        product_id=hotspot_in.product_id,
        title=hotspot_in.title,
        product_name=hotspot_in.product_name,
        affiliate_url=hotspot_in.affiliate_url,
        price_note=hotspot_in.price_note,
    )
    db.add(hotspot)
    db.commit()
    db.refresh(hotspot)
    return hotspot


@router.delete("/hotspots/{hotspot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_hotspot(
    hotspot_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    hotspot = db.query(GalleryHotspot).filter(GalleryHotspot.id == hotspot_id).first()
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")
    db.delete(hotspot)
    db.commit()
    return None
