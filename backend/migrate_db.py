import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "brb_decors.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check and add username and full_name to users
cursor.execute("PRAGMA table_info(users)")
cols = [c[1] for c in cursor.fetchall()]
if "username" not in cols:
    cursor.execute("ALTER TABLE users ADD COLUMN username VARCHAR(100)")
    print("Added username column to users")
if "full_name" not in cols:
    cursor.execute("ALTER TABLE users ADD COLUMN full_name VARCHAR(255)")
    print("Added full_name column to users")

# Ensure existing admin has username 'admin'
cursor.execute("UPDATE users SET username='admin', full_name='BRB Administrator' WHERE (username IS NULL OR username='') AND role='admin'")

# Check and add price and price_range to gallery_items
cursor.execute("PRAGMA table_info(gallery_items)")
gcols = [c[1] for c in cursor.fetchall()]
if "price" not in gcols:
    cursor.execute("ALTER TABLE gallery_items ADD COLUMN price FLOAT")
    print("Added price column to gallery_items")
if "price_range" not in gcols:
    cursor.execute("ALTER TABLE gallery_items ADD COLUMN price_range VARCHAR(100)")
    print("Added price_range column to gallery_items")

cursor.execute("UPDATE gallery_items SET price=3500.0, price_range='₹3,000 – ₹4,500' WHERE price IS NULL")

conn.commit()
conn.close()
print("Database schema updated successfully!")

