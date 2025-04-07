import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from logging import Logger

load_dotenv()

# PostgreSQL connection string using pg8000
pg_user = os.getenv("POSTGRES_USER")
pg_password = os.getenv("POSTGRES_PASSWORD")
pg_host = os.getenv("POSTGRES_HOST")
pg_port = os.getenv("POSTGRES_PORT")
pg_database = os.getenv("POSTGRES_DATABASE")

engine = create_engine(f"postgresql+psycopg2://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}?sslmode=require")

def upload_to_postgres(df: pd.DataFrame, table_name: str, logger: Logger):
    """
    Upload a dataframe to a PostgreSQL table using SQLAlchemy with psycopg2.
    """
    conn = engine.connect()
    trans = conn.begin()

    try:
        df.to_sql(table_name, con=conn, if_exists='append', index=False)
        logger.info(f"[UPLOAD] to {table_name} ({len(df)} rows)")
        trans.commit()
    except SQLAlchemyError as e:
        logger.error(f"[ERROR] Upload failed: {e}")
        trans.rollback()
    finally:
        conn.close()
        engine.dispose()