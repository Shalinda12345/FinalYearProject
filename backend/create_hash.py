# backend/create_hash.py
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, database, schemas # Import schemas here


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def registerAdmin():
    db = database.SessionLocal()

    try:
        username_to_add = "admin1"
        password_to_add = "admin1"
        # CHANGE THIS to the password you want for your admin
        raw_password = "admin1"

        hashed = pwd_context.hash(raw_password)
        print(f"Your Hashed Password is:\n{hashed}")
        
        # ORM Query: Check if user exists
        admin_exists = db.query(models.AdminUsers).filter(models.AdminUsers.username == username_to_add).first()
        if admin_exists:
            print(f"❌ Error: Admin user '{username_to_add}' already exists.")
            return
        
        hashed_pwd = pwd_context.hash(password_to_add)
        print(f"Generated Hash: {hashed_pwd}")
        
        # ORM Add: Create new user instance
        new_admin_user = models.AdminUsers(
            username=username_to_add,
            hashed_password=hashed_pwd
        )
        
        db.add(new_admin_user)
        db.commit()
        db.refresh(new_admin_user) # Refreshes the instance with new data (like ID)

        print(f"SUCCESS: Admin '{username_to_add}' created successfully!")
        print(f"ID: {new_admin_user.id}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # 7. Always close the connection
        db.close()
    

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=database.engine)
    registerAdmin()