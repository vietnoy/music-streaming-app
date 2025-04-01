from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

default_args = {
    "owner": "khangdo",
    "start_date": datetime(2024, 4, 1),
    "depends_on_past": False,
}

with DAG(
    dag_id="fetch_song_workflow",
    default_args=default_args,
    schedule_interval='@daily',
    catchup=False,
    tags=["fetch", "song"],
) as dag:
    
    fetch_song = BashOperator(
        task_id="fetch_song_workflow",
        bash_command="source ~/venv/Scripts/activate && python data_enrich.py"
    )
    fetch_song