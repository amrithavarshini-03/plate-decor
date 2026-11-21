"""
BRB Decors - Admin Credential Setup Utility
Usage:
    python scripts/set_admin.py --username admin --password "MySecretPass@123" --email "admin@brbdecors.com"

Or run interactively:
    python scripts/set_admin.py
"""

import sys
import os
import argparse

# Add backend directory to path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models.entities import User
from app.utils.security import get_password_hash


def main():
    parser = argparse.ArgumentParser(description="Set or update the BRB Decors Admin credentials")
    parser.add_argument("--username", "-u", type=str, help="Admin username")
    parser.add_argument("--password", "-p", type=str, help="Admin password")
    parser.add_argument("--email", "-e", type=str, help="Admin email address")
    args = parser.parse_args()

    username = args.username
    password = args.password
    email = args.email

    if not username:
        username = input("Enter Admin Username [default: admin]: ").strip() or "admin"
    if not email:
        email = input("Enter Admin Email [default: admin@brbdecors.com]: ").strip() or "admin@brbdecors.com"
    if not password:
        password = input("Enter New Admin Password: ").strip()
        if not password:
            print("Error: Password cannot be empty.")
            sys.exit(1)

    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            # Check by email or username
            admin = db.query(User).filter((User.email == email) | (User.username == username)).first()

        hashed = get_password_hash(password)
        if admin:
            admin.username = username
            admin.email = email
            admin.password_hash = hashed
            admin.role = "admin"
            admin.is_active = True
            db.commit()
            print(f"\n✅ Admin credentials updated successfully!")
        else:
            admin = User(
                username=username,
                email=email,
                password_hash=hashed,
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
            print(f"\n✅ Admin account created successfully!")

        print("--------------------------------------------------")
        print(f"Username : {username}")
        print(f"Email    : {email}")
        print(f"Password : (Updated)")
        print("You can now login at: http://localhost:3000/admin")
        print("--------------------------------------------------\n")
    finally:
        db.close()


if __name__ == "__main__":
    main()

