FROM python:3.12.3 

# Set thư mục làm việc
WORKDIR /app

# Copy file yêu cầu lib và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code vào container
COPY . .

# Chạy file chính
CMD ["python", "main.py"]
