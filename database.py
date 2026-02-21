from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQL_DATABASE_URL = "mysql+pymysql://root:test1234!@127.0.0.1:3306/AR_FOOD_DATABASE"
engine = create_engine(SQL_DATABASE_URL)


sessionlocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()
