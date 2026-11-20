import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="customer", nullable=False)  # admin | customer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(64), primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(255), nullable=True)
    city = Column(String(100), default="Chennai", nullable=False)
    venue = Column(String(255), nullable=True)
    function_date = Column(String(50), nullable=False, index=True)
    occasion = Column(String(100), nullable=False)
    custom_occasion = Column(String(255), nullable=True)
    service_type = Column(String(50), default="full_service", nullable=False)  # full_service | diy
    plate_count = Column(Integer, default=5, nullable=False)
    plate_types = Column(JSON, default=list)  # list of strings e.g. ["fruits", "flowers"]
    stage_required = Column(Boolean, default=False)
    theme_colors = Column(JSON, default=list)  # list of strings
    notes = Column(Text, nullable=True)
    budget_range = Column(String(100), nullable=True)
    status = Column(String(50), default="new", index=True)  # new | quoted | confirmed | completed | cancelled
    estimate_amount = Column(Float, nullable=True)
    deposit_paid = Column(Boolean, default=False)
    deposit_amount = Column(Float, nullable=True)
    deposit_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    inspirations = relationship("BookingInspiration", back_populates="booking", cascade="all, delete-orphan")


class BookingInspiration(Base):
    __tablename__ = "booking_inspirations"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(64), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(20), default="image")  # image | link
    url = Column(String(1024), nullable=False)
    preview_title = Column(String(255), nullable=True)
    preview_image = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="inspirations")


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_tamil = Column(String(255), nullable=True)
    occasion = Column(String(100), nullable=False, index=True)
    plate_type = Column(String(100), nullable=False, index=True)
    color_theme = Column(String(100), nullable=False)
    budget = Column(String(50), default="signature")
    price = Column(Float, nullable=True)
    price_range = Column(String(100), nullable=True)
    image_url = Column(String(1024), nullable=False)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    hotspots = relationship("GalleryHotspot", back_populates="gallery_item", cascade="all, delete-orphan")


class GalleryHotspot(Base):
    __tablename__ = "gallery_hotspots"

    id = Column(Integer, primary_key=True, index=True)
    gallery_item_id = Column(String(64), ForeignKey("gallery_items.id", ondelete="CASCADE"), nullable=False)
    x_percent = Column(Float, nullable=False)  # 0 to 100
    y_percent = Column(Float, nullable=False)  # 0 to 100
    product_id = Column(String(64), nullable=True)
    title = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    affiliate_url = Column(String(1024), nullable=False)
    price_note = Column(String(100), nullable=True)

    gallery_item = relationship("GalleryItem", back_populates="hotspots")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)  # trays | tools | toppers | decor
    image_url = Column(String(1024), nullable=False)
    affiliate_url = Column(String(1024), nullable=False)
    price_note = Column(String(100), nullable=True)
    occasion_tags = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)


class Store(Base):
    __tablename__ = "stores"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    area = Column(String(100), nullable=False)
    city = Column(String(100), default="Chennai", nullable=False)
    map_url = Column(String(1024), nullable=False)
    speciality = Column(String(255), nullable=False)
    discount_percent = Column(Integer, default=10)
    discount_note = Column(String(255), default="Say BRB Decors at the counter for discount.")
    is_active = Column(Boolean, default=True)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    occasion = Column(String(255), nullable=False)
    text = Column(Text, nullable=False)
    text_tamil = Column(Text, nullable=True)
    photo_url = Column(String(1024), nullable=True)
    rating = Column(Integer, default=5)
    is_featured = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BlockedDate(Base):
    __tablename__ = "blocked_dates"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(50), unique=True, index=True, nullable=False)  # YYYY-MM-DD
    reason = Column(String(255), nullable=False)
    is_auspicious = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
