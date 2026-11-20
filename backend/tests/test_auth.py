def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@brbdecors.com", "password": "AdminDecors@2026"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_email"] == "admin@brbdecors.com"
    assert data["user_role"] == "admin"


def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@brbdecors.com", "password": "WrongPassword123"},
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_get_me_endpoint(client, admin_headers):
    response = client.get("/api/auth/me", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@brbdecors.com"
    assert data["role"] == "admin"


def test_customer_register_and_login_by_username(client):
    # 1. Register customer
    reg_res = client.post(
        "/api/auth/register",
        json={
            "username": "kavitha_chennai",
            "email": "kavitha@example.com",
            "password": "Password123!",
            "full_name": "Kavitha Sundaram",
        },
    )
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["user_username"] == "kavitha_chennai"
    assert reg_data["user_role"] == "customer"
    assert "access_token" in reg_data

    # 2. Login using username instead of email
    login_res = client.post(
        "/api/auth/login",
        json={"username": "kavitha_chennai", "password": "Password123!"},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["user_username"] == "kavitha_chennai"
    assert login_data["user_role"] == "customer"

