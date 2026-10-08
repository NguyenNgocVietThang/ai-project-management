# Kế hoạch: Render Free + Supabase Free

Ngày: 2026-10-08. Phạm vi: kế hoạch, chưa thay đổi mã ứng dụng hoặc tài khoản cloud.

## Mục tiêu

Chạy bản demo dùng ít người trên Render Free và Supabase Free; giữ email giao dịch, AI, tính lại lịch và nhắc việc. Không yêu cầu Celery worker/Beat trả phí. Không cam kết hoạt động liên tục hoặc lịch đúng phút khi dịch vụ ngủ/DB bị pause.

## Hiện trạng đã xác minh

- FastAPI + Next.js; frontend có next-intl và headers động, chưa thể mặc định export static.
- AIService đưa các tác vụ AI vào Celery; auth và lời mời dự án cũng đưa email vào Celery.
- Tính đường găng trên ngưỡng 300 task chuyển sang Celery.
- Beat nhắc công việc lúc 08:00 và quét rủi ro lúc 08:30 theo APP_TIMEZONE (mặc định Asia/Ho_Chi_Minh).
- Redis còn dùng cho WebSocket, OAuth, giới hạn đăng nhập và thu hồi token; không được bỏ Redis chỉ vì bỏ Celery.
- Các worker xuất DOCX/XLSX và parse_document còn TODO; không coi chúng là tính năng đã hoàn thiện.

## Kiến trúc đề xuất

1. Supabase Postgres lưu dữ liệu ứng dụng và bảng jobs/outbox bền vững.
2. Backend Render xử lý nghiệp vụ Python; một bộ chạy jobs có giới hạn concurrency được khởi động trong vòng đời ứng dụng, không là dịch vụ worker riêng. Khi Render ngủ, jobs chờ trong DB; khi thức, bộ chạy nhận tiếp.
3. API trả job ID và trạng thái; frontend theo dõi khi màn hình liên quan mở, polling giảm dần và dừng khi xong. Không dùng BackgroundTasks/asyncio.create_task làm nơi lưu duy nhất của tác vụ.
4. Supabase Cron gọi endpoint nội bộ có xác thực để enqueue các đợt 08:00/08:30. pg_net ghi nhận kết quả; có timeout/cold-start retry giới hạn và chạy bù theo ngày khi backend thức. Không ping liên tục để giữ Render luôn chạy.
5. Render Key Value Free giữ vai trò Redis hiện tại. Jobs quan trọng không lưu duy nhất ở Redis; kiểm tra rõ ảnh hưởng mất Redis với bảo mật trước triển khai.
6. Supabase Storage bucket riêng tư thay MinIO; thử S3 compatibility với SDK hiện tại trước, dùng adapter Storage API nếu không tương thích. URL ký ngắn hạn; giữ kiểm tra quyền truy cập theo dự án.
7. Email chuyển SMTP sang HTTPS API. Chọn nhà cung cấp theo quota, địa chỉ người gửi và khả năng xác minh tên miền thực tế. Không hứa miễn phí email cho mọi người nhận nếu chưa có sender hợp lệ.
8. Giữ hệ thống auth hiện tại; không chuyển sang Supabase Auth trong đợt này.

## Độ tin cậy tác vụ

jobs có type, payload tối thiểu, trạng thái, thời điểm chạy, attempts, lease expiry, khóa chống trùng và lỗi đã làm sạch. Claim nguyên tử bằng khóa DB; lease để khôi phục sau restart. Chỉ nhận số lượng nhỏ mỗi đợt; giới hạn thời gian/kích thước dự án và quota AI.

AI không giữ transaction DB trong lúc gọi nhà cung cấp. Ghi kết quả theo request ID, commit nguyên tử; đánh dấu trường hợp timeout không rõ kết quả để tránh retry vô hạn làm tăng tiền AI. Email dùng khóa chống trùng nếu provider hỗ trợ; không cam kết exactly-once qua hệ thống ngoài. Outbox phải được tạo trong cùng transaction nghiệp vụ và chỉ xử lý sau commit.

## Thứ tự triển khai

Chi tiết và tiêu chí kiểm tra ở todo.md. Mỗi bước phải nhỏ, kiểm tra tập trung; không xóa luồng Celery trước khi luồng thay thế đã qua kiểm thử.

1. Đo khả năng triển khai frontend/backend và tài nguyên Free; chọn cấu hình compute.
2. Thêm schema jobs/outbox và migration.
3. Thêm claim/lease/retry và runner giới hạn.
4. Chuyển một luồng AI tạo dự án end-to-end.
5. Chuyển các AI còn lại.
6. Chuyển tính lại đường găng.
7. Thêm adapter email HTTPS và chuyển email giao dịch.
8. Thêm endpoint lịch và Supabase Cron, chạy bù/chống trùng.
9. Thêm trạng thái jobs cho UI và xử lý lỗi/kết nối lại.
10. Chuyển lưu file sang Supabase Storage.
11. Kiểm tra Redis, auth và WebSocket khi dịch vụ restart.
12. Cấu hình deploy, hướng dẫn vận hành và kiểm thử end-to-end Free.

## Điểm kiểm tra và giới hạn

- Sau bước 1: frontend cần Node thì hai web service dùng chung 750 giờ/tháng; không giả định hai dịch vụ chạy 24/7 trong quota. Chỉ dùng static site nếu audit chứng minh khả thi. Gộp dịch vụ chỉ xem xét sau đo RAM/build và routing, không mặc định gộp trên 512 MB.
- Sau bước 4: tắt/restart backend giữa tác vụ, job phải khôi phục hoặc có lỗi rõ ràng, không tạo hai dự án.
- Sau bước 8: email thực nhận, nhắc việc và lịch rủi ro không trùng; thử cold start/mất kết nối.
- Sau bước 12: đăng ký/xác minh, đăng nhập/logout, reset mật khẩu, lời mời, AI, upload/download, đường găng và thông báo hoạt động; không còn đường gọi Celery bắt buộc trong chế độ free.
- Supabase Free có thể pause; lịch không chạy khi DB pause. Có hướng dẫn resume và backup; chạy bù có giới hạn theo ngày, không phát hàng loạt nhắc cũ.
- Lịch rủi ro mặc định giữ hằng ngày, theo lô nhỏ và hạn mức; khi hết quota hiển thị hoãn/lỗi và cho chạy thủ công, không âm thầm bỏ tính năng.
- Logs không chứa token, link reset, mật khẩu hoặc nội dung tài liệu nhạy cảm. Cấu hình server-only cho DB, S3, AI và cron secret.

## Cần xác định khi thực hiện

- Có sender/tên miền đã xác minh cho email không; khóa xKiro còn quota không.
- Quy mô demo và mức chậm chấp nhận được; frontend có thể static export không.
- Supabase S3 compatibility, Postgres pooling/SSL và quyền extension thực tế trong project.
- Redis Free restart có yêu cầu chuyển dữ liệu thu hồi token/OAuth/throttle quan trọng sang Postgres không.

## Nguồn chính thức đã kiểm tra

- https://render.com/docs/free — compute miễn phí, ngủ/cold start, giờ dùng chung và chặn SMTP.
- https://supabase.com/docs/guides/cron — chạy SQL hoặc gọi HTTP theo lịch.
- https://supabase.com/docs/guides/functions/schedule-functions — pg_cron/pg_net và quản lý secret bằng Vault.
- https://supabase.com/docs/guides/functions/limits — Edge Functions Free giới hạn 150 giây; không chuyển toàn bộ Python/Celery sang Edge Functions.

