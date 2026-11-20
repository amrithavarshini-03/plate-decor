def test_create_booking_success(client):
    payload = {
        "customer_name": "Sowmya Raman",
        "phone": "+91 98401 23456",
        "email": "sowmya@example.com",
        "city": "Chennai",
        "venue": "Mylapore Rasika Hall",
        "function_date": "2026-11-20",
        "occasion": "puberty",
        "service_type": "full_service",
        "plate_count": 7,
        "plate_types": ["fruits", "flowers"],
        "stage_required": True,
        "theme_colors": ["turmeric_gold", "banana_green"],
        "notes": "Please include carved watermelon with lotus flowers",
        "budget_range": "₹12,000 - ₹18,000",
        "inspirations": [
            {
                "type": "link",
                "url": "https://instagram.com/p/sample1",
                "preview_title": "Instagram Seer Inspiration",
            }
        ],
    }
    response = client.post("/api/bookings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"].startswith("BRB-")
    assert data["customer_name"] == "Sowmya Raman"
    assert data["plate_count"] == 7
    assert data["status"] == "new"
    assert len(data["inspirations"]) == 1
    assert data["inspirations"][0]["url"] == "https://instagram.com/p/sample1"

    booking_id = data["id"]
    assert booking_id.startswith("BRB-")


def test_admin_update_booking_status_and_quote(client, admin_headers):
    # First create a booking
    payload = {
        "customer_name": "Vijay Shankar",
        "phone": "+91 99402 33445",
        "city": "Madurai",
        "function_date": "2026-12-10",
        "occasion": "wedding",
        "service_type": "full_service",
        "plate_count": 11,
        "plate_types": ["fruits", "flowers", "sweets_dryfruits"],
        "stage_required": False,
    }
    create_res = client.post("/api/bookings", json=payload)
    assert create_res.status_code == 201
    booking_id = create_res.json()["id"]

    # Quote update
    quote_res = client.patch(
        f"/api/bookings/{booking_id}/quote",
        json={"estimate_amount": 16500.0, "notes": "Including 11 heavy brass plates and delivery."},
        headers=admin_headers,
    )
    assert quote_res.status_code == 200
    assert quote_res.json()["status"] == "quoted"
    assert quote_res.json()["estimate_amount"] == 16500.0

    # Status update to confirmed
    status_res = client.patch(
        f"/api/bookings/{booking_id}/status",
        json={"status": "confirmed", "notes": "Customer confirmed over phone call."},
        headers=admin_headers,
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "confirmed"


def test_validation_error_on_invalid_booking(client):
    # Missing required customer_name and phone
    response = client.post("/api/bookings", json={"occasion": "wedding"})
    assert response.status_code == 422
