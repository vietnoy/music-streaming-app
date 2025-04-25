# Music Streaming App

This project is a **Music Streaming Application** using **Python**, **PostgreSQL**, **Docker**, and **MinIO**.

## 🚀 Features
- **FastAPI** for high-performance backend API
- **PostgreSQL** for database management
- **Docker Compose** for easy setup
- **React** for frontend

---

## 🛠 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vietnoy/music-streaming-app.git
cd music-streaming-app
```
### 2️⃣ Create a Python Virtual Environment
```bash
cd backend
```
```bash
python -m venv venv
source venv/bin/activate  # For Mac/Linux
venv\Scripts\activate  # For Windows
```
```bash
pip install -r requirements.txt
```
### 3️⃣ Run Docker Containers (PostgreSQL, Backend, Frontend)
Return to the main directory
```bash
docker compose up --build
```
This will start:

- PostgreSQL database on `localhost:5432`
- Backend API on `localhost:8000`
- Frontend (React) on `localhost:3000`
### 4️⃣ Set Up Environment Variables
Create new `.env` file:
```bash
touch .env
```
Then add:
```ini
# airflow config
AIRFLOW__CORE__SQL_ALCHEMY_CONN="sqlite:////opt/airflow/airflow.db"
AIRFLOW__EXECUTOR="SequentialExecutor"

# spotify credentials
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# pg credentials
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_PORT=your_port
POSTGRES_DATABASE=your_database
POSTGRES_TABLE=your_table

# s3 credentials
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_BUCKET=your_bucket
S3_PREFIX=your_s3_prefix
S3_ENDPOINT=your_endpoint
```
### 5️⃣ Run the Application
#### Run the backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
#### Run the frontend
```bash
cd frontend
npm install
npm start
```
