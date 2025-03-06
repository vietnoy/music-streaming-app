import pg8000, os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()

# load postgres configuration
pg_user = os.getenv("POSTGRES_USER")
pg_password = os.getenv("POSTGRES_PASSWORD")
pg_host = os.getenv("POSTGRES_HOST")
pg_port = os.getenv("POSTGRES_PORT")
pg_database = os.getenv("POSTGRES_DATABASE")
pg_table = os.getenv("POSTGRES_TABLE")

# create connection to postgres
def create_postgres_connection():
    engine = create_engine(f"postgresql+pg8000://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}")
    conn = engine.connect()
    return conn

if __name__ == "__main__":
    df = pd.read_csv('./data/dataset.csv')
    df = df.drop("Unnamed: 0", axis = 1)
    conn = create_postgres_connection()
    try:
        conn.begin()
        df.to_sql(pg_table, con=conn, if_exists="replace", index=False)
        print("Succesfully uploaded csv file to database")
        conn.commit()
    except SQLAlchemyError as e:
        print(f"Rolling back due to error: {e}")
    finally:
        conn.close()