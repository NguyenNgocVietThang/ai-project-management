FROM python:3.11-slim

WORKDIR /app

# Công cụ build cần thiết để biên dịch một số wheel; việc loại bỏ khỏi image cuối cùng
# đòi hỏi multi-stage build — tạm giữ ở đây nhưng dọn dẹp sạch danh sách apt cache.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Chạy với người dùng không có đặc quyền (unprivileged user): tiến trình container chạy dưới quyền root sẽ chia sẻ uid 0
# với máy chủ host, do đó bất kỳ hành vi thoát container hoặc bind-mount ghi được nào cũng bắt đầu từ root.
RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Không dùng --reload ở đây: reload theo dõi filesystem và chạy lại code khi thay đổi,
# là tiện ích cho môi trường dev nhưng tăng bề mặt tấn công trong môi trường production.
# docker-compose.yml (dev stack) sẽ ghi đè lệnh này để kích hoạt lại khi phát triển.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
