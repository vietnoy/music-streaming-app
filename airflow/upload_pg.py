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

def upload_csv_to_postgres(file_path: str, table_name: str, logger: Logger, if_exists: str = "append"):
    """
    Upload a CSV file to a PostgreSQL table using SQLAlchemy with pg8000.
    """
    conn = engine.connect()
    if not os.path.exists(file_path):
        logger.warning(f"[SKIP] {file_path} not found.")
        return
    trans = conn.begin()

    try:
        df = pd.read_csv(file_path)

        df.to_sql(table_name, con=conn, if_exists='append', index=False)
        logger.info(f"[UPLOAD] {file_path} to {table_name} ({len(df)} rows)")
        trans.commit()
    except SQLAlchemyError as e:
        logger.error(f"[ERROR] Upload failed for {file_path}: {e}")
        trans.rollback()
    finally:
        conn.close()
        engine.dispose()