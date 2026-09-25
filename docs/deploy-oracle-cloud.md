# Kế hoạch deploy môi trường thử nghiệm lên Oracle Cloud Always Free

Mục tiêu: chạy toàn bộ stack hiện có (`docker-compose.yml`) trên 1 VM Always Free của Oracle Cloud, phục vụ môi trường thử nghiệm 1-2 người dùng, không tốn chi phí, không lo tranh chấp RAM với máy cá nhân.

## Bối cảnh và lý do chọn phương án này

- Máy dev local từng bị `ERR_CONNECTION_RESET` do RAM cạn kiệt khi Docker phải chạy song song với nhiều ứng dụng khác trên Windows.
- Các nền tảng PaaS free phổ biến (Render, Fly.io, Railway) không còn phù hợp: Render free tier không hỗ trợ background worker (Celery), Fly.io đã bỏ free tier, Railway chỉ còn trial ngắn hạn.
- Oracle Cloud Always Free cung cấp 1 VM ARM (2 OCPU, 12GB RAM) miễn phí vĩnh viễn, đủ để chạy nguyên `docker-compose.yml` hiện tại mà không cần tách service ra nhiều nền tảng.

## Điều kiện tiên quyết

- Tài khoản Oracle Cloud đã xác minh (cần thẻ tín dụng để đăng ký, không bị trừ phí nếu ở trong hạn mức Always Free).
- Domain hoặc chỉ dùng IP public của VM (tùy nhu cầu, không bắt buộc domain cho môi trường thử nghiệm).
- Google OAuth Client ID/Secret thật đã có sẵn (đã cấu hình ở bước trước).

## Giai đoạn 1: Tạo VM trên Oracle Cloud

1. Đăng nhập Oracle Cloud Console, vào **Compute → Instances → Create Instance**.
2. Chọn shape **VM.Standard.A1.Flex** (Ampere ARM, nằm trong Always Free) với cấu hình tối đa được phép: 2 OCPU, 12GB RAM.
3. Chọn image **Ubuntu 24.04 (ARM64)**.
4. Tạo hoặc chọn SSH key pair, tải về private key để SSH vào VM sau này.
5. Trong phần **Networking**, mở các port cần thiết ở Security List / Network Security Group:
   - `22` (SSH)
   - `3000` (frontend)
   - `8000` (backend API)
   - `9000-9001` (MinIO, nếu cần truy cập console từ ngoài)
6. Ghi lại địa chỉ IP public của VM sau khi tạo xong.

## Giai đoạn 2: Cài đặt môi trường trên VM

1. SSH vào VM:
   ```bash
   ssh -i <đường-dẫn-private-key> ubuntu@<IP-public-VM>
   ```
2. Cập nhật hệ thống:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. Cài Docker Engine + Docker Compose plugin (bản chính thức hỗ trợ ARM64):
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER
   ```
   Đăng xuất và SSH lại để nhóm quyền `docker` có hiệu lực.
4. Kiểm tra Docker chạy được trên ARM:
   ```bash
   docker run --rm hello-world
   ```

## Giai đoạn 3: Đưa mã nguồn lên VM

1. Cài Git nếu chưa có: `sudo apt install -y git`.
2. Clone repository:
   ```bash
   git clone <URL-repo-của-bạn>
   cd "AI Project Planning & Portfolio Management system"
   ```
3. Tạo file `backend/.env` từ `backend/.env.example`, điền giá trị thật:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (giá trị thật đã có).
   - `GOOGLE_REDIRECT_URI` đổi từ `http://localhost:8000/...` sang `http://<IP-public-VM>:8000/api/v1/oauth/google/callback`.
   - `FRONTEND_URL` đổi sang `http://<IP-public-VM>:3000`.
   - `SECRET_KEY` đặt giá trị ngẫu nhiên mạnh (tối thiểu 32 ký tự), không dùng placeholder mặc định.
   - `SEED_ADMIN_PASSWORD` đặt sẵn mật khẩu admin mong muốn để tránh phải đọc log seed.
4. Cập nhật **Authorized redirect URIs** trong Google Cloud Console thêm URL production mới (`http://<IP-public-VM>:8000/api/v1/oauth/google/callback`).

## Giai đoạn 4: Build và chạy stack

1. Build image cho kiến trúc ARM64 (lần đầu sẽ lâu hơn do build lại toàn bộ):
   ```bash
   docker compose build
   ```
2. Khởi động toàn bộ stack:
   ```bash
   docker compose up -d
   ```
3. Kiểm tra tất cả container đang healthy:
   ```bash
   docker compose ps
   ```
4. Seed dữ liệu ban đầu (roles, permissions, admin user):
   ```bash
   docker compose exec backend python -m app.db.seed
   ```
5. Truy cập thử từ trình duyệt: `http://<IP-public-VM>:3000`.

## Giai đoạn 5: Kiểm tra vận hành

- Kiểm tra log không có lỗi bất thường:
  ```bash
  docker compose logs -f backend
  docker compose logs -f frontend
  ```
- Test luồng đăng nhập bằng tài khoản admin vừa seed.
- Test đăng nhập Google OAuth với redirect URI mới.
- Theo dõi tài nguyên VM trong vài ngày đầu:
  ```bash
  docker stats
  free -h
  ```

## Việc cân nhắc thêm (không bắt buộc cho môi trường thử nghiệm)

- Cấu hình HTTPS bằng Caddy hoặc Nginx + Let's Encrypt nếu cần truy cập qua domain và kết nối an toàn hơn.
- Cấu hình firewall `ufw` trên VM thay vì mở port tự do.
- Lên lịch backup volume `postgres_data` định kỳ (ví dụ `pg_dump` + cron) vì đây là môi trường thử nghiệm, không có sẵn cơ chế backup tự động.
- Giới hạn tài nguyên (`mem_limit`, `cpus`) cho từng service trong `docker-compose.yml` nếu muốn tránh 1 service ngốn hết RAM của VM 12GB.

## Rủi ro và giới hạn đã biết

- Oracle vừa cắt giảm hạn mức Always Free ARM từ 24GB xuống 12GB RAM (giữa năm 2026) — cấu hình có thể tiếp tục thay đổi trong tương lai, cần theo dõi thông báo chính thức của Oracle.
- Quy trình duyệt tài khoản Oracle Cloud đôi khi chậm hoặc bị từ chối không rõ lý do — nên có phương án dự phòng (ví dụ VPS trả phí thấp) nếu không tạo được tài khoản.
- VM Always Free có thể bị Oracle thu hồi nếu không sử dụng trong thời gian dài — cần đăng nhập/sử dụng định kỳ.
