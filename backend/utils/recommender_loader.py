import os, pickle, faiss
import pandas as pd
from io import BytesIO
from google.cloud import storage, bigquery
import tempfile

class Recommender:
    def __init__(self):
        self.data_df = None
        self.faiss_index = None
        self.track_features = None

        self.gcs_client = storage.Client.from_service_account_json(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
        self.bq_client = bigquery.Client.from_service_account_json(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

        self.bucket = self.gcs_client.bucket(os.getenv("BUCKET_NAME"))

    def load(self):
        self.data_df = self.load_data()
        self.faiss_index = self.load_faiss_index()
        self.track_features = self.load_track_features()

    def load_data(self):
        path = os.path.join(os.path.dirname(__file__), "..", "..", "airflow", "data", "dataset.csv")
        return pd.read_csv(os.path.abspath(path))

    def load_faiss_index(self):
        blob = self.bucket.blob("music_index.index")
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(blob.download_as_bytes())
            return faiss.read_index(temp_file.name)

    def load_track_features(self):
        blob = self.bucket.blob("full_features.pkl")
        return pickle.load(BytesIO(blob.download_as_bytes()))

    def get_recommendations(self, user_id):
        query = """
            SELECT track_id
            FROM `silicon-stock-452315-h4.music_recommend.recommend`
            WHERE user_id = @user_id
            ORDER BY recommended_at DESC
            LIMIT 15
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id)
            ]
        )
        query_job = self.bq_client.query(query, job_config=job_config)
        results = query_job.result()
        return [row.track_id for row in results]

    def get_emo_recommendations(self, user_id, emo):
        emo = emo.lower()
        query = """
            SELECT track_id
            FROM `silicon-stock-452315-h4.music_recommend.emotion-recommend`
            WHERE user_id = @user_id 
            AND emotion = @emo 
            AND TIMESTAMP_TRUNC(recommended_at, MINUTE) = (
                SELECT TIMESTAMP_TRUNC(MAX(recommended_at), MINUTE)
                FROM `silicon-stock-452315-h4.music_recommend.emotion-recommend`
                WHERE user_id = @user_id AND emotion = @emo
            );

        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
                bigquery.ScalarQueryParameter("emo", "STRING", emo),
            ]
        )
        query_job = self.bq_client.query(query, job_config=job_config)
        results = query_job.result()
        return [row.track_id for row in results]
    
recommender = Recommender()
