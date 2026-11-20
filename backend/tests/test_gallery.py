def test_gallery_crud_and_hotspots(client, admin_headers):
    # Create new item with hotspot
    item_payload = {
        "title": "Auspicious Peacock Dry Fruit Thamboolam",
        "title_tamil": "மங்கல மயில் உலர் பழத் தட்டு",
        "occasion": "wedding",
        "plate_type": "sweets_dryfruits",
        "color_theme": "kumkum_red",
        "budget": "grand",
        "image_url": "/images/placeholders/wedding_seer_1.jpg",
        "is_featured": True,
        "sort_order": 1,
        "description": "Rich cashews and pistachios arranged into a royal peacock.",
        "hotspots": [
            {
                "x_percent": 50.0,
                "y_percent": 45.0,
                "title": "Peacock Base Frame",
                "product_name": "Craft Wire Base",
                "affiliate_url": "https://amazon.in",
                "price_note": "₹280",
            }
        ],
    }
    create_res = client.post("/api/gallery", json=item_payload, headers=admin_headers)
    assert create_res.status_code == 201
    created_data = create_res.json()
    item_id = created_data["id"]
    assert created_data["title"] == "Auspicious Peacock Dry Fruit Thamboolam"
    assert len(created_data["hotspots"]) == 1

    # Public list with filter
    list_res = client.get("/api/gallery?occasion=wedding")
    assert list_res.status_code == 200
    items = list_res.json()
    assert any(i["id"] == item_id for i in items)

    # Get single item
    get_res = client.get(f"/api/gallery/{item_id}")
    assert get_res.status_code == 200
    assert get_res.json()["hotspots"][0]["title"] == "Peacock Base Frame"
