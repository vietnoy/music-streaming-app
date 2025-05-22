import os, pickle, faiss
import pandas as pd
from io import BytesIO
from google.cloud import storage
import tempfile

class Recommender:
    def __init__(self):
        self.data_df = None
        self.faiss_index = None
        self.track_features = None

    def get_client(self):
        return storage.Client()
    def load(self):
        self.data_df = self.load_data()
        self.faiss_index = self.load_faiss_index()
        self.track_features = self.load_track_features()

    def load_data(self):
        client = self.get_client()
        bucket = client.bucket("music-12345")
        blob = bucket.blob("dataset1.csv")
        return pd.read_csv(BytesIO(blob.download_as_bytes()))

    def load_faiss_index(self):
        client = self.get_client()
        bucket = client.bucket("music-12345")
        blob = bucket.blob("music_index.index")
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(blob.download_as_bytes())
            temp_file_path = temp_file.name
        index = faiss.read_index(temp_file_path)
        os.remove(temp_file_path)
        return index

    def load_track_features(self):
        client = self.get_client()
        bucket = client.bucket("music-12345")
        blob = bucket.blob("full_features.pkl")
        return pickle.load(BytesIO(blob.download_as_bytes()))

recommender = Recommender()
print("Loading models...")
recommender.load()
print("Done.")
