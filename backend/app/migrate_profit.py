import pymysql

def upgrade_db():
    try:
        connection = pymysql.connect(
            host='localhost',
            port=3308,
            user='root',
            password='',
            database='auth_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection:
            with connection.cursor() as cursor:
                # Check products
                cursor.execute("SHOW COLUMNS FROM products LIKE 'cost_price'")
                if not cursor.fetchone():
                    print("Adding cost_price to products...")
                    cursor.execute("ALTER TABLE products ADD COLUMN cost_price INT NOT NULL DEFAULT 0")
                
                # Check order_items
                cursor.execute("SHOW COLUMNS FROM order_items LIKE 'cost_price'")
                if not cursor.fetchone():
                    print("Adding cost_price to order_items...")
                    cursor.execute("ALTER TABLE order_items ADD COLUMN cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0")
                connection.commit()
                print("Migration complete.")
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    upgrade_db()
