from get_liked_track import get_all_user_ids, get_liked_track_ids
from loader import recommender
from recommender import recommend_songs
import pandas as pd 
from google.cloud import bigquery
from datetime import datetime, timezone 


def main():
    client = bigquery.Client()
    table_id = "silicon-stock-452315-h4.music_recommend.recommend"

    user_ids = get_all_user_ids()
    rows = []
    for user_id in user_ids:
        liked_songs = get_liked_track_ids(user_id)
        if len(liked_songs) < 2:
            print("Không đủ bài hát!")
            continue
        else:
            recommended_songs = recommend_songs(liked_songs)
        
        for track_id in recommended_songs:
            rows.append({
                "user_id": user_id,
                "track_id": track_id,
                "recommended_at": datetime.now(timezone.utc).isoformat()
            })

    # Ghi lên BigQuery
    errors = client.insert_rows_json(table_id, rows)

    if errors == []:
        print("Insert thành công!")
    else:
        print("Có lỗi:", errors)

if __name__ == "__main__":
    main()
