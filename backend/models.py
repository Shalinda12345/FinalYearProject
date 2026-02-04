from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))


class AdminUsers(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    # Admins login with username, not email (common practice for superusers)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text('Current_TIMESTAMP'))