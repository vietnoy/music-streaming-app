FROM python:3.10

WORKDIR /app

# Install build tools for bcrypt
RUN apt-get update && apt-get install -y build-essential libffi-dev python3-dev cargo

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]