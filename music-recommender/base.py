from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# load postgres config connection
pg_user = "musicdb"
pg_password = "Gh7#Lx9!rTc8ZpQ2"
pg_host = "54.254.2.140"
pg_port = "5432"
pg_database = "postgres"

database_url = f"postgresql+psycopg2://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}"

engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()