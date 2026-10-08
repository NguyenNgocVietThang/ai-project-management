# Redis Free và trạng thái bảo mật

Ngày: 2026-10-08. Bước 11 đã triển khai sau khi core jobs được kiểm tra. Các API auth hiện tại được giữ, không chuyển sang Supabase Auth.

## Hiện trạng và đường tấn công

| Store/luồng | Hành vi hiện tại khi Redis mất | Điều kiện cần ở chế độ database |
| --- | --- | --- |
| `token_revocation.py` | Lookup fail open, revoke trả False; dữ liệu Redis mất làm token logout/rotated có thể replay | Tombstone trong Postgres đến hết token TTL; đọc/ghi lỗi phải từ chối |
| `login_throttle.py` | Fail open; counter và khóa mất qua restart | Counter tăng nguyên tử, khóa theo email đã băm và TTL bền vững |
| `oauth_state_store.py` | Fail closed nhưng state/PKCE mất | Giữ browser binding và TTL 15 phút; consume nguyên tử đúng một lần |
| `oauth_exchange.py` | Mã exchange mất; caller từ chối | Cặp token chỉ nằm server-side; mã băm, TTL 120 giây, consume một lần |
| `ws_tickets.py` | Handshake fail closed; ticket mất | Ticket băm, TTL 60 giây, consume một lần; vẫn kiểm tra User/auth_version |
| `rate_limit.py` | Slowapi fallback bộ nhớ; counter reset khi restart | Async fixed-window counter ở Postgres; DB lỗi trả 503, không fallback |
| `api/ws/deps.py` | Watchdog DB lỗi chỉ retry, socket còn mở | Trong database mode, đóng 4401 khi không thể kiểm tra authorization |
| `ws_manager.py` | Pub/sub mất thì realtime suy giảm; dữ liệu nghiệp vụ vẫn ở DB | Redis vẫn làm bus; restart/reconnect và REST polling là phần nghiệm thu deploy |

`client_key` hiện chọn 64 ký tự đầu của Bearer header chưa xác thực, nên caller tự đổi header có thể đổi bucket. Chọn client IP ổn định cho throttle; không dùng credential do caller tự nhận làm key. Reverse proxy forwarding chỉ được tin theo cấu hình proxy đã xác minh.

Refresh hiện làm `is_revoked` rồi `revoke` riêng, nên hai request đồng thời có thể vượt qua cùng lookup. Store sẽ cung cấp `claim_revocation(jti, expires_at) -> bool`: chỉ lần claim đầu thành công. Parent chịu trách nhiệm dùng claim này trong `AuthService.refresh` của database mode trước khi cấp cặp token mới. Logout vẫn dùng `revoke` idempotent.

## Interface phối hợp

- Parent thêm `SECURITY_STATE_BACKEND: Literal['redis', 'database']`, mặc định `redis`, chế độ Free dùng `database`; parent đăng ký model trong `app/db/base.py`.
- Model `app.models.security_state.SecurityState`, bảng `security_states`: namespace (40), key_hash (64), unique(namespace, key_hash), payload JSON, counter integer, expires_at timestamptz có index; kế thừa id/created_at/updated_at của Base.
- Migration `20261008_security_state`, `down_revision = '20261008_durable_jobs'`; jobs migration thực tế kế thừa `20261008_drop_facebook_login`.
- Service mới sở hữu transaction/session ngắn riêng. Public core signatures hiện tại được giữ. Thêm `claim_revocation`; không đổi `auth_service.py`, `config.py`, `main.py` hoặc `db/base.py` từ agent này.
- DB mode không truy cập Redis cho authorization state. DB exceptions chuyển thành lỗi generic 503; không log key, token, PKCE, email hoặc payload. Các caller OAuth/WS hiện tại có thể map lỗi thành lỗi auth generic, nhưng phải từ chối.
- Single-use dùng `DELETE ... WHERE expires_at > now RETURNING payload`; claim dùng unique constraint và `INSERT ... ON CONFLICT ... RETURNING`. Counter dùng upsert tăng nguyên tử và reset khi window hết hạn, không read-then-write ở Python. [PostgreSQL INSERT](https://www.postgresql.org/docs/current/sql-insert.html) và [DELETE](https://www.postgresql.org/docs/current/sql-delete.html) mô tả các primitives này.
- Security table không có policy cho client. PostgreSQL migration bật RLS và revoke quyền PUBLIC, anon/authenticated nếu các role tồn tại. Backend cần owner/BYPASSRLS hoặc policy server-only được thiết lập rõ; không cấp client policy để chữa lỗi kết nối. [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).
- TTL được kiểm tra lúc đọc; cleanup expired rows theo lô nhỏ, không xóa tombstone còn hiệu lực. Không phụ thuộc cron để hết hạn về mặt logic.

## Chuyển mode và nghiệm thu

Không bật database mode trên hệ thống đang hoạt động rồi coi các tombstone Redis cũ là đã được chuyển. Với demo mới, triển khai trước khi cấp phiên. Với dữ liệu đang dùng, cần cửa sổ bảo trì, ngừng cấp token, tăng `User.auth_version` để vô hiệu mọi phiên cũ rồi đổi mode; pending OAuth/exchange/WS handshake bắt đầu lại. Rollback mode cũng phải vô hiệu phiên để tránh bỏ qua tombstone chỉ tồn tại trong Postgres. Không tăng auth_version tự động mỗi startup.

Tests cần xác minh: dữ liệu revocation còn sau restart store/Redis loss; claim concurrent một winner; OAuth đúng browser, consume concurrent một winner, hết TTL; exchange/ticket single use; khóa login giữ sau restart và reset sau đăng nhập; rate limit giữ khi store được tạo lại và không bypass bằng arbitrary Bearer header; DB lỗi không cấp token/handshake hoặc bỏ qua throttle; watchdog đóng khi DB outage.

SQLite dùng cho behavioral tests, Postgres thật cho upsert/consume/concurrency và migration upgrade/downgrade. PostgreSQL 16 binary đã được tìm thấy sau audit compute ban đầu; cluster local cô lập ở port 55439 đã được dùng, mỗi test có schema riêng. Điều này khắc phục phần chưa có DB local, chưa thay thế thử Redis Free/Supabase thật hoặc Linux cgroup/load test. Không cloud resource, paid request hoặc commit được tạo trong audit.

Kiểm tra đã thực hiện: refresh qua `AuthService` thật với tám request đồng thời trên Postgres chỉ cấp một cặp token, bảy request bị từ chối 401; access token hợp lệ trước logout bị từ chối sau logout dù getter Redis lỗi; counter nguyên tử giữ đủ các lượt tăng đồng thời; OAuth/WS/exchange chỉ consume một lần; DB outage chặn core state và endpoint bị throttle; migration lên/xuống trên SQLite/Postgres và RLS được bật. Tombstone TTL được làm tròn lên để không hết hạn trước JWT trong phần lẻ của một giây. Redis development tests hiện có vẫn được chạy trong lượt kiểm tra tập trung.
