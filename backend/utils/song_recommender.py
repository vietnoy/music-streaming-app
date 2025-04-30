from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import normalize
import numpy as np
from utils.recommender_loader import recommender
import hdbscan

def recommend_songs(liked_track_ids, top_n=5):
    liked_indices = [
        recommender.data_df[recommender.data_df['track_id'] == tid].index[0]
        for tid in liked_track_ids
    ]
    liked_track_features = recommender.track_features[liked_indices]

    clusterer = hdbscan.HDBSCAN(min_cluster_size=2)
    cluster_labels = clusterer.fit_predict(liked_track_features)

    cluster_centers = []
    for label in np.unique(cluster_labels):
        if label == -1:  
            continue
        cluster = liked_track_features[cluster_labels == label]
        center = cluster.mean(axis=0)
        cluster_centers.append(center)

    if len(cluster_centers) == 0:
        print("Không tìm thấy cụm nào!")
        user_vector = np.mean(liked_track_features, axis=0).reshape(1, -1)
        user_vector = normalize(user_vector)
        _, indices = recommender.faiss_index.search(user_vector, top_n)
    else:
        cluster_centers = normalize(np.array(cluster_centers))
        _, indices = recommender.faiss_index.search(cluster_centers, top_n)

    recommended_indices = indices.flatten()
    recommended_track_ids = [
        recommender.data_df.iloc[i]["track_id"] for i in recommended_indices
    ]
    return recommended_track_ids