def test_availability_calendar_and_blocking(client, admin_headers):
    # Public get calendar
    cal_res = client.get("/api/availability?month=2026-11")
    assert cal_res.status_code == 200
    cal_data = cal_res.json()
    assert cal_data["month"] == "2026-11"
    assert len(cal_data["days"]) == 30

    # Admin block a date
    block_res = client.post(
        "/api/availability/block",
        json={
            "date": "2026-11-18",
            "reason": "Temple Seer Varisai Workshop",
            "is_auspicious": True,
            "notes": "Closed for studio masterclass",
        },
        headers=admin_headers,
    )
    assert block_res.status_code == 201

    # Verify reflected in public calendar
    cal_res_after = client.get("/api/availability?month=2026-11")
    target_day = next((d for d in cal_res_after.json()["days"] if d["date"] == "2026-11-18"), None)
    assert target_day is not None
    assert target_day["is_auspicious"] is True
