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

    # 2. Gallery Items & Hotspots
    if db.query(GalleryItem).count() == 0:
        g1 = GalleryItem(
            id="gal-1",
            title="Gilded Sevvazhai & Golden Lotus Thaalam",
            title_tamil="பொன் தாமரை & அலங்கார செவ்வாழைத் தட்டு",
            occasion="puberty",
            plate_type="fruits",
            color_theme="turmeric_gold",
            budget="signature",
            image_url="/images/decor/sevvazhai_golden_lotus.jpg",
            is_featured=True,
            sort_order=1,
            description="Ceremonial red bananas (செவ்வாழை) accented with golden pearl chains and sapphire stones, radiating around an embossed golden lotus centerpiece on an antique silver tray.",
        )
        db.add(g1)
        db.flush()

        db.add(
            GalleryHotspot(
                gallery_item_id="gal-1",
                x_percent=48,
                y_percent=38,
                product_id="p2",
                title="Glitter Golden Lotus Centerpiece",
                product_name="Festive Shimmer Foam Lotus Crown",
                affiliate_url="https://amazon.in",
                price_note="₹240 on Amazon",
            )
        )
        db.add(
            GalleryHotspot(
                gallery_item_id="gal-1",
                x_percent=70,
                y_percent=80,
                product_id="p1",
                title="Embossed Silver Pooja Thaalam",
                product_name="14-Inch Traditional German Silver Serving Plate",
                affiliate_url="https://amazon.in",
                price_note="₹1,250 on Amazon",
            )
        )

        g2 = GalleryItem(
            id="gal-2",
            title="Pistachio Flora & Almond Pinecone Bouquet",
            title_tamil="உலர் பழ மலர்க் கொத்து & பிஸ்தா அரும்புத் தட்டு",
            occasion="wedding",
            plate_type="sweets_dryfruits",
            color_theme="turmeric_gold",
            budget="grand",
            image_url="/images/decor/pistachio_almond_floral_bouquet.jpg",
            is_featured=True,
            sort_order=2,
            description="Handcrafted dry fruit botanical sculpture featuring blooming pistachio-shell dahlias, almond pinecone blossoms with pearl centers, and fresh dracaena greens.",
        )
        db.add(g2)
        db.flush()

        g3 = GalleryItem(
            id="gal-3",
            title="Mandarin Baby Footprints on Sugar Crystals",
            title_tamil="குழந்தை பாத கற்கண்டு & வெற்றிலை மங்கலத் தட்டு",
            occasion="baby_shower",
            plate_type="baby_theme",
            color_theme="lotus_pink",
            budget="signature",
            image_url="/images/decor/baby_footprint_mandarin_sugar.jpg",
            is_featured=True,
            sort_order=3,
            description="Adorable miniature baby footprints sculpted from juicy mandarin orange segments with ruby pomegranate aril toes, resting on a sacred betel leaf over pure rock sugar crystals.",
        )
        db.add(g3)
        db.flush()

        g4 = GalleryItem(
            id="gal-4",
            title="Pathinaru Selvangal Sacred Kolam Coconuts",
            title_tamil="பதினாறு பேறுகள் மங்கள தேங்காய்த் தட்டு",
            occasion="wedding",
            plate_type="deity",
            color_theme="kumkum_red",
            budget="grand",
            image_url="/images/decor/pathinaru_selvangal_coconuts.jpg",
            is_featured=True,
            sort_order=4,
            description="Auspicious ceremonial turmeric coconuts hand-painted with sacred kolams and capped with crimson netted cones, honoring the 16 Traditional Tamil Blessings.",
        )
        db.add(g4)

        g5 = GalleryItem(
            id="gal-5",
            title="Modular Marigold & Bangle Stage Backdrop",
            title_tamil="செவ்வந்தி மாலை & கண்ணாடி வளையல் மேடை அலங்காரம்",
            occasion="baby_shower",
            plate_type="stage_backdrop",
            color_theme="turmeric_gold",
            budget="grand",
            image_url="/images/decor/valaikappu_full_stage_backdrop.jpg",
            is_featured=True,
            sort_order=5,
            description="Grand Valaikappu & Seemantham ceremony stage featuring modular timber grid frames filled with dense marigold blocks, stacks of colorful glass bangles, and suspended carved lotus bells.",
        )
        db.add(g5)

        results["gallery"] = "seeded 5 items"

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
