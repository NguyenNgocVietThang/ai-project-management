# Triển khai bản thử nghiệm trên Oracle Cloud Always Free

Mục tiêu: chạy stack production cho 1–2 người dùng trên một VM Ampere A1, với HTTPS và một tên miền. Dùng `docker-compose.prod.yml`; `docker-compose.yml` chỉ dành cho phát triển vì có hot reload và mật khẩu mặc định.

## Điều kiện trước khi bắt đầu

- Tài khoản Oracle Cloud đã xác minh, có thể tạo VM trong **home region**.
- Tên miền hoặc tên miền con do bạn quản lý. Tạo bản ghi A trỏ tới IP public của VM. Google OAuth không cho phép callback dùng IP public hay HTTP; URL callback phải là `https://<tên-miền>/api/v1/oauth/google/callback`.
- Google OAuth Client ID/Secret và xKiro API key hiện có. Không đưa các giá trị này vào Git, log hoặc ảnh chụp màn hình.
- Giữ private SSH key trên máy quản trị, không đưa vào repository. Giới hạn quyền truy cập SSH theo IP của bạn nếu có thể.

Oracle Always Free hiện cho tổng cộng **2 OCPU và 12 GB RAM** của `VM.Standard.A1.Flex` trong home region. Kiểm tra nhãn **Always Free-eligible** và giá ước tính trên màn hình tạo VM trước khi xác nhận. Dung lượng boot volume cũng tính vào hạn mức block storage.

## 1. Tạo máy và mạng

1. Vào **Compute → Instances → Create instance**, chọn Ubuntu 24.04 ARM64 và `VM.Standard.A1.Flex`, 2 OCPU/12 GB RAM. Bật public IPv4 và thêm SSH public key.
2. Trong NSG hoặc Security List, chỉ mở TCP `80` và `443` từ Internet. Mở TCP `22` từ IP quản trị; nếu IP thay đổi, cập nhật rule khi cần. Không mở `3000`, `8000`, `5432`, `6379`, `9000` hoặc `9001` ra Internet.
3. Ghi IP public và tạo bản ghi DNS A cho tên miền. Kiểm tra DNS đã phân giải tới IP này trước khi chạy Caddy. Nếu truy cập không được, kiểm tra cả rule mạng OCI lẫn firewall trên Ubuntu.

## 2. Cài Docker và lấy mã nguồn

SSH vào VM bằng key đã tải khi tạo máy:

```bash
ssh -i /path/to/private-key ubuntu@<IP-public>
```

Cập nhật Ubuntu, cài Docker Engine và Compose plugin từ hướng dẫn chính thức cho Ubuntu, rồi kiểm tra `docker compose version` và `docker run --rm hello-world`. Thêm user `ubuntu` vào nhóm `docker` nếu muốn chạy không cần `sudo`, sau đó đăng xuất và SSH lại. Quyền trong nhóm `docker` tương đương quyền quản trị máy; chỉ cấp cho user quản trị.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
git clone https://github.com/NguyenNgocVietThang/ai-project-management.git
cd ai-project-management
```

Nếu repository là private, dùng phương thức Git được cấp quyền riêng cho VM. Không sao chép token vào câu lệnh lưu trong shell history.

## 3. Cấu hình bí mật và URL

Sao chép mẫu và sửa file `.env` ở **gốc repository** trên VM. File này được `.gitignore` loại trừ:

```bash
cp .env.production.example .env
chmod 600 .env
```

Đặt `APP_DOMAIN`, các URL HTTPS/WSS và `ALLOWED_HOSTS`/`CORS_ORIGINS` cùng một tên miền. Tạo giá trị ngẫu nhiên riêng cho `POSTGRES_PASSWORD`, `SECRET_KEY`, `MINIO_ROOT_USER` và `MINIO_ROOT_PASSWORD` (ví dụ `openssl rand -hex 32`). Điền xKiro key và Google OAuth ID/Secret thật. `GOOGLE_REDIRECT_URI` phải trùng chính xác với URI đã thêm vào **Authorized redirect URIs** của Google Cloud Console.

Frontend đóng gói `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_WS_URL` lúc build; sau khi đổi tên miền phải build lại image frontend. Caddy tự lấy và gia hạn chứng chỉ HTTPS khi DNS và cổng 80/443 đã hoạt động.

## 4. Build, migrate và khởi động

```bash
docker compose -f docker-compose.prod.yml config --quiet
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d postgres redis minio
docker compose -f docker-compose.prod.yml run --rm backend alembic upgrade head
docker compose -f docker-compose.prod.yml run --rm backend python -m app.db.seed
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Chỉ chạy lệnh `seed` **một lần** với cơ sở dữ liệu mới. Script tạo tài khoản `admin@example.com` và in mật khẩu ngẫu nhiên một lần; lưu mật khẩu đó an toàn và không chia sẻ log seed. Nếu muốn chọn email hoặc mật khẩu trước khi seed, truyền `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` riêng cho lệnh `run` thay vì lưu chúng lâu dài trong `.env`.

## 5. Kiểm tra sau triển khai

```bash
curl -fsS https://<tên-miền>/health
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=100 backend frontend caddy celery-worker celery-beat
```

Mở `https://<tên-miền>`, đăng nhập admin, tạo một dữ liệu thử và kiểm tra Google OAuth. Kiểm tra WebSocket và tác vụ Celery nếu những tính năng đó được sử dụng. Theo dõi `docker stats`, `free -h` và dung lượng đĩa trong vài ngày đầu.

Sao lưu Postgres và các volume quan trọng định kỳ. Trước mỗi lần cập nhật mã hoặc migration, ghi lại commit đang chạy và tạo backup database; có thể quay lại image của commit cũ nếu bản mới lỗi, nhưng migration dữ liệu cần phương án khôi phục riêng.

## Nguồn đối chiếu

- [Hạn mức Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- [Quy tắc Google OAuth redirect URI](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation)
- [Cài Docker Engine trên Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Caddy Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
