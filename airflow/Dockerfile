FROM apache/airflow:2.7.2-python3.11

WORKDIR /opt/airflow

USER root
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    apt-get clean
USER airflow

COPY dags/ /opt/airflow/dags/
COPY data_enrich.py upload_pg.py /opt/airflow/
COPY requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt
