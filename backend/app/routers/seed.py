from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.entities import (
    User,
    GalleryItem,
    GalleryHotspot,
    Product,
    Store,
    Testimonial,
    BlockedDate,
)
from app.utils.security import get_password_hash

router = APIRouter(prefix="/api/seed", tags=["Seed Data"])


@router.post("")
def seed_database(db: Session = Depends(get_db)):
    """Seed initial admin and rich ceremonial data."""
    results = {}

    # 1. Admin User
    admin = db.query(User).filter(User.email == settings.ADMIN_INITIAL_EMAIL).first()
    if not admin:
        admin = User(
            email=settings.ADMIN_INITIAL_EMAIL,
            password_hash=get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
            role="admin",
            is_active=True,
        )
        db.add(admin)
        results["admin"] = "created"
    else:
        results["admin"] = "already_exists"

    # 2. Gallery Items & Hotspots (All 11 authentic home page decor works)
    gallery_data = [
        {
            "id": "gal-1",
            "title": "Artisanal Pistachio & Almond Floral Bouquet",
            "title_tamil": "பிஸ்தா & பாதாம் உலர் பழ மலர் கொத்து",
            "occasion": "wedding",
            "plate_type": "sweets_dryfruits",
            "color_theme": "turmeric_gold",
            "budget": "signature",
            "price": 3500.0,
            "price_range": "₹3,000 – ₹4,500",
            "image_url": "/images/decor/1.jpeg",
            "is_featured": True,
            "sort_order": 1,
            "description": "Intricately hand-sculpted dry fruit flower blossoms created from whole pistachios, almond petals with pearl centers, accompanied by fresh chrysanthemums on an embossed silver tray.",
        },
        {
            "id": "gal-2",
            "title": "Auspicious Valaikappu Baby Footprint Kalkandu Tray",
            "title_tamil": "வளைகாப்பு குழந்தை பாத கற்கண்டுத் தட்டு",
            "occasion": "baby_shower",
            "plate_type": "baby_theme",
            "color_theme": "lotus_pink",
            "budget": "signature",
            "price": 2800.0,
            "price_range": "₹2,500 – ₹3,500",
            "image_url": "/images/decor/2.jpeg",
            "is_featured": True,
            "sort_order": 2,
            "description": "Tender baby footprints arranged with fresh mandarin orange segments and ruby pomegranate seeds on a betel leaf, resting on a bed of sparkling rock sugar crystals framed by banana leaf cones and jasmine buds.",
        },
        {
            "id": "gal-3",
            "title": "Gilded Sevvazhai & Golden Lotus Thaalam",
            "title_tamil": "பொன் தாமரை & அலங்கார செவ்வாழைத் தட்டு",
            "occasion": "puberty",
            "plate_type": "fruits",
            "color_theme": "turmeric_gold",
            "budget": "signature",
            "price": 4200.0,
            "price_range": "₹3,800 – ₹5,000",
            "image_url": "/images/decor/3.jpeg",
            "is_featured": True,
            "sort_order": 3,
            "description": "Auspicious red bananas (செவ்வாழை) accented with studded golden bead lines and sapphire jewels, radiating around a shimmering golden lotus centerpiece on an antique filigree silver tray.",
        },
        {
            "id": "gal-4",
            "title": "Miniature Golden Krishna in Beaded Arch Swing",
            "title_tamil": "கற்கண்டுப் படுகையில் கண்ணன் மலர் தொட்டில்",
            "occasion": "baby_shower",
            "plate_type": "baby_theme",
            "color_theme": "kumkum_red",
            "budget": "signature",
            "price": 3200.0,
            "price_range": "₹2,800 – ₹4,000",
            "image_url": "/images/decor/4.jpeg",
            "is_featured": True,
            "sort_order": 4,
            "description": "Golden Balakrishna enshrined in an ornate ceremonial swing with red and blue glass beads and a brass bell, resting on an auspicious bed of sugar crystals (kalkandu).",
        },
        {
            "id": "gal-5",
            "title": "Banana Leaf & Bangle Grid Stage Artistry",
            "title_tamil": "வளைகாப்பு மேடை & வாழை இலை மாலை அலங்காரம்",
            "occasion": "baby_shower",
            "plate_type": "stage_backdrop",
            "color_theme": "turmeric_gold",
            "budget": "grand",
            "price": 15000.0,
            "price_range": "₹12,000 – ₹20,000",
            "image_url": "/images/decor/5.jpeg",
            "is_featured": True,
            "sort_order": 5,
            "description": "Grand celebratory stage backdrop featuring lush banana leaf tapestries, cascading marigold garlands, suspended lotus bells, and wooden grid displays of colorful ceremonial glass bangles.",
        },
        {
            "id": "gal-6",
            "title": "Seemantham Expectant Parents Platter",
            "title_tamil": "சீமந்தத் தம்பதியர் பழங்கள் & ரோஜாத் தட்டு",
            "occasion": "baby_shower",
            "plate_type": "fruits",
            "color_theme": "lotus_pink",
            "budget": "signature",
            "price": 3600.0,
            "price_range": "₹3,000 – ₹4,500",
            "image_url": "/images/decor/6.jpeg",
            "is_featured": True,
            "sort_order": 6,
            "description": "Artistic cutout of expectant parents in traditional festive attire, elevated above a bed of crowned gala apples, delicate pink roses, baby's breath, and silver filigree rim.",
        },
        {
            "id": "gal-7",
            "title": "Vetrilai Mandala & Auspicious Turmeric Lemon Plate",
            "title_tamil": "வெற்றிலை மண்டலம் & மங்கள எலுமிச்சைத் தட்டு",
            "occasion": "housewarming",
            "plate_type": "deity",
            "color_theme": "turmeric_gold",
            "budget": "essential",
            "price": 2200.0,
            "price_range": "₹1,800 – ₹2,800",
            "image_url": "/images/decor/7.jpeg",
            "is_featured": True,
            "sort_order": 7,
            "description": "Hand-arranged geometric betel leaf mandala with consecrated turmeric lemons, kumkum, and fresh yellow marigolds.",
        },
        {
            "id": "gal-8",
            "title": "Sacred Kalasam & Auspicious Ceremonial Thaalam",
            "title_tamil": "மங்கலக் கலசம் & ஆராத்தி தட்டு அலங்காரம்",
            "occasion": "puberty",
            "plate_type": "deity",
            "color_theme": "turmeric_gold",
            "budget": "signature",
            "price": 3800.0,
            "price_range": "₹3,200 – ₹4,800",
            "image_url": "/images/decor/8.jpeg",
            "is_featured": True,
            "sort_order": 8,
            "description": "Traditional sacred kalasam with fresh mango leaves, decorative coconut, and auspicious ganesha motif encircled by fresh red roses and jasmine garlands on an antique brass thaalam.",
        },
        {
            "id": "gal-9",
            "title": "Grand Brass Kuthuvilakku Rose Garland Decor",
            "title_tamil": "மங்கல குத்துவிளக்கு & ரோஜா மாலை அலங்காரம்",
            "occasion": "wedding",
            "plate_type": "flowers",
            "color_theme": "kumkum_red",
            "budget": "grand",
            "price": 4500.0,
            "price_range": "₹4,000 – ₹6,000",
            "image_url": "/images/decor/9.jpeg",
            "is_featured": True,
            "sort_order": 9,
            "description": "Traditional South Indian heirloom brass kuthuvilakku adorned with lush layered paneer rose garlands, fragrant marigolds, and betel leaf base decoration for wedding seer varisai.",
        },
        {
            "id": "gal-10",
            "title": "Traditional Valaikappu Mother Orange & Jasmine Ring",
            "title_tamil": "வளைகாப்பு தாய் & மங்கல ஆரஞ்சு மலர் வளையம்",
            "occasion": "baby_shower",
            "plate_type": "fruits",
            "color_theme": "turmeric_gold",
            "budget": "signature",
            "price": 3000.0,
            "price_range": "₹2,500 – ₹3,800",
            "image_url": "/images/decor/10.jpeg",
            "is_featured": True,
            "sort_order": 10,
            "description": "Auspicious ceremonial ring plate displaying expectant mother surrounded by golden Nagpur oranges, fresh fragrant madurai malli jasmine, and red rose buds.",
        },
        {
            "id": "gal-11",
            "title": "Auspicious Green Apple & Fruit Varisai Thaalam",
            "title_tamil": "மங்கல பச்சை ஆப்பிள் & பழ வரிசைத் தட்டு",
            "occasion": "housewarming",
            "plate_type": "fruits",
            "color_theme": "turmeric_gold",
            "budget": "essential",
            "price": 2600.0,
            "price_range": "₹2,200 – ₹3,500",
            "image_url": "/images/decor/11.jpeg",
            "is_featured": True,
            "sort_order": 11,
            "description": "Auspicious geometric fruit arrangement with crisp green Granny Smith apples, pomegranate accents, and folded banana leaf cones for Grihapravesam and festive poojas.",
        },
    ]

    for g_item in gallery_data:
        existing = db.query(GalleryItem).filter(GalleryItem.id == g_item["id"]).first()
        if not existing:
            new_item = GalleryItem(**g_item)
            db.add(new_item)
        else:
            for k, v in g_item.items():
                setattr(existing, k, v)
    db.commit()

    # Add default hotspots if missing on gal-3
    g3_item = db.query(GalleryItem).filter(GalleryItem.id == "gal-3").first()
    if g3_item and len(g3_item.hotspots) == 0:
        db.add(
            GalleryHotspot(
                gallery_item_id="gal-3",
                x_percent=48,
                y_percent=38,
                product_id="p2",
                title="Glitter Golden Lotus Centerpiece",
                product_name="Festive Shimmer Foam Lotus Crown",
                affiliate_url="https://amazon.in",
                price_note="₹240 on Amazon",
            )
        )
        db.commit()

    results["gallery"] = f"synced {len(gallery_data)} items"

    # 3. Products
    if db.query(Product).count() == 0:
        products = [
            Product(
                id="p1",
                name="16-Inch Solid Brass Beaded Thaalam Tray",
                category="trays",
                image_url="/images/decor/vetrilai_mandala_lemon.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹1,850 on Amazon",
                occasion_tags=["wedding", "puberty", "housewarming"],
                is_active=True,
            ),
            Product(
                id="p2",
                name="Kundan Geometric Brocade Dry Fruit Base Box",
                category="tools",
                image_url="/images/decor/royal_dry_fruit_square_mandala.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹650 on Amazon",
                occasion_tags=["puberty", "wedding"],
                is_active=True,
            ),
            Product(
                id="p3",
                name="Mandarin & Sugar Crystal Footprint Crafting Base",
                category="toppers",
                image_url="/images/decor/baby_footprint_mandarin_sugar.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹450 on Amazon",
                occasion_tags=["baby_shower"],
                is_active=True,
            ),
            Product(
                id="p4",
                name="Handmade Bridal Couple (Maappillai & Penn) Dolls",
                category="trays",
                image_url="/images/decor/maappillai_penn_dolls_seer.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹550 on Amazon",
                occasion_tags=["wedding"],
                is_active=True,
            ),
            Product(
                id="p5",
                name="Heavy 12-Inch Urli with Floating Diya Rings",
                category="trays",
                image_url="/images/decor/brass_kuthuvilakku_rose_garland.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹2,100 on Amazon",
                occasion_tags=["housewarming", "festivals"],
                is_active=True,
            ),
            Product(
                id="p6",
                name="Eco Banana-Leaf Silicone Liner Moulds (Pack of 6)",
                category="tools",
                image_url="/images/decor/vetrilai_mandala_lemon.jpg",
                affiliate_url="https://amazon.in",
                price_note="₹390 on Amazon",
                occasion_tags=["wedding", "baby_shower"],
                is_active=True,
            ),
        ]
        db.add_all(products)
        results["products"] = f"seeded {len(products)} products"

    # 4. Stores
    if db.query(Store).count() == 0:
        stores = [
            Store(
                id="s1",
                name="Sri Meenakshi Brass Emporium",
                area="Mylapore (Near Kapaleeshwarar Temple)",
                city="Chennai",
                map_url="https://maps.google.com/?q=Mylapore+Chennai",
                speciality="Pure temple-grade bronze & brass thaalams, kuthuvilakku, and decorative urlis.",
                discount_percent=12,
                discount_note="Mention BRB Decors at counter for 12% off on all brass seer trays.",
                is_active=True,
            ),
            Store(
                id="s2",
                name="Madurai Malli & Natural Flora Hub",
                area="Mattuthavani Flower Market",
                city="Madurai",
                map_url="https://maps.google.com/?q=Madurai+Flower+Market",
                speciality="Export-quality scented GI-tagged Madurai Malligai, paneer rose, and fresh marigold coils.",
                discount_percent=10,
                discount_note="Show your BRB Decors booking confirmation for 10% market privilege.",
                is_active=True,
            ),
            Store(
                id="s3",
                name="Kovai Traditional Crafts & Cutouts",
                area="RS Puram",
                city="Coimbatore",
                map_url="https://maps.google.com/?q=RS+Puram+Coimbatore",
                speciality="Handmade wooden deity toppers, laser-cut baby shower cradles, and thermocol seer backdrops.",
                discount_percent=15,
                discount_note="Say 'BRB Decor Friends' for 15% discount on custom cutout orders.",
                is_active=True,
            ),
        ]
        db.add_all(stores)
        results["stores"] = f"seeded {len(stores)} stores"

    # 5. Testimonials
    if db.query(Testimonial).count() == 0:
        testimonials = [
            Testimonial(
                id="test-1",
                name="Revathi & Sundaram",
                city="Chennai (Anna Nagar)",
                occasion="Daughter's Manjal Neerattu Vizha",
                text="The fruit mandala was the talk of our ceremony. Every guest stopped to take photos before blessing our daughter. The flowers were dew-fresh even at 8 PM.",
                text_tamil="எங்கள் மகள் மஞ்சள் நீராட்டு விழாவில் பழ மண்டலம் அனைவரின் கவனத்தையும் ஈர்த்தது. பூக்கள் இரவு 8 மணி வரை மிகப்புதியதாய் இருந்தது.",
                rating=5,
                is_featured=True,
            ),
            Testimonial(
                id="test-2",
                name="Dr. Karthik & Meenakshi",
                city="Madurai",
                occasion="Wedding Seer Varisai (11 Plates)",
                text="BRB Decors handled all 11 seer plates with absolute perfection. From the dry fruit peacock to the carved coconut kalasam, their team treated it like family.",
                text_tamil="11 சீர்வரிசை தட்டுகளையும் மிகுந்த நேர்த்தியுடன் செய்து தந்தார்கள். உலர் பழ மயில் வடிவம் அற்புதம்!",
                rating=5,
                is_featured=True,
            ),
            Testimonial(
                id="test-3",
                name="Abirami Vijay",
                city="Coimbatore",
                occasion="Valaikappu & Seemantham",
                text="The miniature floral cradle and bangle arrangements felt so pure and auspicious. The team reached our hall two hours before muhurtham and set up seamlessly.",
                text_tamil="வளையல் மற்றும் மலர்த் தொட்டில் அலங்காரம் மிகவும் மங்கலமாக இருந்தது. குறித்த நேரத்திற்கு முன்னே வந்து முடித்துக் கொடுத்தார்கள்.",
                rating=5,
                is_featured=True,
            ),
        ]
        db.add_all(testimonials)
        results["testimonials"] = f"seeded {len(testimonials)} testimonials"

    # 6. Auspicious Dates (Muhurtham)
    if db.query(BlockedDate).count() == 0:
        auspicious = [
            BlockedDate(
                date="2026-10-24",
                reason="Subha Muhurtham (Valarpirai Ekadasi)",
                is_auspicious=True,
                notes="Morning 6:15 AM - 7:30 AM Muhurtham",
            ),
            BlockedDate(
                date="2026-10-28",
                reason="Auspicious Muhurtham (Pournami)",
                is_auspicious=True,
                notes="Morning 9:00 AM - 10:30 AM",
            ),
            BlockedDate(
                date="2026-11-06",
                reason="Subha Muhurtham (Karthigai Somavaram)",
                is_auspicious=True,
                notes="Morning 7:30 AM - 9:00 AM",
            ),
            BlockedDate(
                date="2026-11-15",
                reason="Karthigai Deepam Festival (Bookings Reserved)",
                is_auspicious=False,
                notes="Fully booked for temple and home poojas",
            ),
        ]
        db.add_all(auspicious)
        results["blocked_dates"] = f"seeded {len(auspicious)} auspicious & blocked dates"

    db.commit()
    return {"status": "success", "results": results}
