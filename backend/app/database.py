from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# WAMP default: user='root', password='', host='localhost', port=3306
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3308/auth_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()