FROM python:3.10-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Cloud Run cung cấp biến môi trường PORT, bạn đặt mặc định 8080
ENV PORT=8080

# Cài đặt các thư viện hệ thống cần thiết (nên gom chung để giảm layer)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libffi-dev \
        python3-dev \
        cargo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy file requirements để tận dụng cache khi build
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code vào container
COPY . .

# Chạy ứng dụng với uvicorn, host 0.0.0.0 và port lấy từ biến môi trường
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
