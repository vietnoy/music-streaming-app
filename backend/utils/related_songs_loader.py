import os, pickle, faiss
import pandas as pd
from io import BytesIO
from google.cloud import storage
import tempfile

class RelatedSong:
    def __init__(self):
        self.data_df = None
        self.faiss_index = None
        self.track_features = None

    def load(self):
        self.data_df = self.load_data()
        self.faiss_index = self.load_faiss_index()
        self.track_features = self.load_track_features()

    def load_data(self):
        path = os.path.join(os.path.dirname(__file__), "..", "..", "airflow", "data", "dataset.csv")
        return pd.read_csv(os.path.abspath(path))

    def load_faiss_index(self):
        client = storage.Client().from_service_account_json(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
        bucket = client.bucket(os.getenv("BUCKET_NAME"))
        blob = bucket.blob("music_index.index")
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(blob.download_as_bytes())
            return faiss.read_index(temp_file.name)

    def load_track_features(self):
        client = storage.Client().from_service_account_json(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
        bucket = client.bucket(os.getenv("BUCKET_NAME"))
        blob = bucket.blob("full_features.pkl")
        return pickle.load(BytesIO(blob.download_as_bytes()))


relatedSong = RelatedSong() 