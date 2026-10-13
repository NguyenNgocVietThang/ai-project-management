# Tài liệu yêu cầu nghiệp vụ (BRD)
## Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI

**Version:** 2.4
**Date:** 2026-10-13

---

## 1. Tổng quan dự án (Tổng quan dự án)

### 1.1 Mục đích (Purpose)
Xây dựng một hệ thống quản lý danh mục và kế hoạch dự án thông minh (AI Project Planning & Portfolio Management). Hệ thống có các tính năng cốt lõi tương đương Microsoft Project nhưng được tăng cường sức mạnh bởi Trí tuệ Nhân tạo (AI) để làm rõ yêu cầu, tự động hóa việc lên kế hoạch, phân bổ nguồn lực, phân tích rủi ro, đánh giá tác động của các thay đổi (Change Requests) và sinh tài liệu dự án (SRS/BRD), đồng thời hỗ trợ cộng tác thời gian thực (Real-time Project Chat & WebSocket Notifications).

### 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh)
- **Làm rõ yêu cầu trước khi lập kế hoạch:** AI hỏi làm rõ từng câu một dựa trên hồ sơ yêu cầu 7 mục trước khi tạo dự án, không tự bịa các mục người dùng bỏ qua.
- **Tự động hóa lập kế hoạch:** Giảm 80% thời gian tạo cấu trúc WBS và lên lịch dự án nhờ AI (xKiro).
- **Tối ưu hóa nguồn lực:** Tự động phát hiện cảnh báo quá tải (Resource Leveling) và gợi ý nhân sự phù hợp cho công việc.
- **Kiểm soát rủi ro và thay đổi:** Chuẩn hóa quy trình Change Request (CR) duyệt tuần tự BA -> PO -> PM, có AI phân tích tác động, tự động lưu phiên bản khi duyệt cuối và cho phép khôi phục (rollback).
- **Cộng tác & Giao tiếp tức thời:** Kênh Chat nhóm trực tiếp theo từng dự án và hệ thống thông báo đẩy thời gian thực giảm độ trễ trao đổi thông tin.
- **Tự động hóa giám sát tiến độ:** Quét định kỳ hàng ngày phát hiện sớm các công việc bắt đầu trong ngày hoặc sắp đến hạn để thông báo tự động tới toàn nhóm dự án.
- **Tài liệu và báo cáo tự động:** Sinh SRS/BRD dạng DOCX có sơ đồ quy trình BPMN, xuất báo cáo XLSX (Task, Đường găng, CR và duyệt, EVA, Burndown).
- **Minh bạch thông tin & Quản trị:** Cung cấp Gantt chỉ đọc, Burndown, EVA, hệ thống phân quyền 34 permissions và Audit Trail toàn diện.

---

## 2. Phạm vi dự án (Phạm vi dự án)

### 2.1 Các tính năng trong phạm vi (Trong phạm vi)
- **Quản lý phân cấp dự án:** Portfolio → Project → Phase / Sprint / Epic / Milestone → Task → Subtask.
- **Thuật toán đường găng (CPM):** Tự động tính toán Early Start/Finish, Late Start/Finish, Total Float và xác định Critical Path. Có giới hạn số task và quan hệ phụ thuộc mỗi lần tính (`CPM_MAX_TASKS`, `CPM_MAX_DEPENDENCIES`); vượt giới hạn trả lỗi 422 `resource_limit_exceeded`.
- **Cộng tác thời gian thực (Real-Time Collaboration):** Kênh Project Chat kết nối WebSocket, hỗ trợ phân trang lịch sử tin nhắn và đếm số tin chưa đọc.
- **Thông báo đa kênh & Quét định kỳ:** Đẩy thông báo thời gian thực qua WebSocket, fan-out thông báo khi Task thay đổi; job lịch hằng ngày do cron (Supabase Cron hoặc cron cục bộ) kích hoạt qua `POST /api/v1/internal/jobs/schedules`, sinh job nhắc việc lúc 08:00 và job quét rủi ro lúc 08:30 (giờ Asia/Ho_Chi_Minh). Tác vụ nền chạy bằng durable jobs lưu trong PostgreSQL (bảng `jobs`), thay cho Celery/Celery Beat.
- **Quản trị hệ thống & RBAC:** Quản lý Người dùng, Vai trò, gán 34 quyền hạn và xem Audit Timeline truy vết mọi thay đổi.
- **Tích hợp AI:** Hỏi làm rõ yêu cầu trước khi tạo dự án, tạo dự án từ hồ sơ yêu cầu đã chốt (vẫn giữ tương thích tạo từ prompt thô), phân tích rủi ro, phân tích tác động, tối ưu lịch trình, gợi ý nhân sự, sinh nội dung SRS/BRD và sinh mô hình quy trình BPMN. Quota mặc định 20 job AI mỗi ngày (`AI_DAILY_JOB_LIMIT`).
- **Quản lý Change Request (CR) & Phê duyệt đa cấp:** Luồng duyệt tuần tự BA -> PO -> PM kèm Phân tích tác động bằng AI, dòng thời gian duyệt trên trang chi tiết CR.
- **Time Tracking & Timesheet:** Ghi nhận giờ làm việc thực tế (`worklogs`) và kiểm tra quá tải tài nguyên.
- **Quản lý phiên bản (Versioning & Rollback):** Snapshot tự động khi CR được duyệt cuối, baseline thủ công, so sánh khác biệt giữa hai phiên bản và khôi phục dữ liệu dự án.
- **Gantt chỉ đọc:** Biểu đồ Gantt SVG vẽ từ kết quả CPM, đánh dấu đường găng bằng nhãn chữ (không chỉ dựa vào màu), zoom ngày/tuần/tháng, ảo hóa hàng cho dự án lớn (khoảng 2000 task).
- **Tài liệu và báo cáo:** Sinh SRS/BRD dạng DOCX theo mẫu cố định (tiếng Việt mặc định, hỗ trợ tiếng Anh), chèn ảnh sơ đồ BPMN; xuất XLSX gồm các sheet Task, Đường găng, CR và duyệt, EVA và Burndown (EVA tính theo giờ công). Tệp lưu trong bucket riêng tư (Supabase Storage trên cloud, MinIO khi chạy cục bộ) và chỉ tải qua proxy có kiểm tra quyền.
- **Mô hình quy trình (BPMN):** AI sinh mô hình quy trình (lane, task, gateway, event, flow) có kiểm tra hợp lệ; trang xem quy trình dạng swimlane.

### 2.2 Ngoài phạm vi (Ngoài phạm vi)
- Thanh toán và tích hợp cổng thanh toán trực tuyến.
- Quản lý kho mã nguồn (Git Server Hosting).
- Tích hợp CI/CD Pipeline runner nội bộ.
- Kéo thả chỉnh sửa trực tiếp trên Gantt (Gantt hiện chỉ đọc).
- Tải lên và bóc tách tài liệu gốc (BRD/SRS có sẵn) bằng AI: dời sang Phase 5.
- Dashboard dành riêng cho Investor: chưa làm.
- Gửi email thật trên bản demo cloud: đang tắt (hệ thống hỗ trợ SMTP hoặc Resend khi được cấu hình).

---

## 3. Các bên liên quan và Vai trò (Stakeholders & Roles)

Hệ thống hỗ trợ 7 vai trò riêng biệt với các quyền hạn cụ thể (RBAC):

1. **Admin (Quản trị hệ thống):** Quản lý tài khoản người dùng, phân quyền vai trò (34 permissions), theo dõi Audit Timeline, cấu hình AI provider. Với Change Request, admin hệ thống chỉ được xem chuỗi duyệt, không quyết định thay các bước BA/PO/PM. Được tạo baseline thủ công cùng PM.
2. **Project Manager - PM (Quản lý dự án):** Tạo/quản lý Portfolio & Project, phân công nhân sự, quản lý thành viên, duyệt bước cuối của Change Request, tạo baseline, khôi phục phiên bản, sinh tài liệu SRS/BRD và xuất báo cáo.
3. **Business Analyst - BA:** Duyệt bước đầu của Change Request, xem báo cáo AI Impact Report.
4. **Product Owner - PO:** Duyệt bước thứ hai của Change Request về mặt nghiệp vụ, theo dõi tiến độ tổng thể và các cột mốc dự án.
5. **Member (Thành viên đội dự án):** Nhận task, Start/Stop công việc, cập nhật worklog timesheet, trao đổi trong kênh Real-time Project Chat.
6. **Customer (Khách hàng):** Khởi tạo yêu cầu thay đổi (CR), theo dõi tiến độ dự án của mình.
7. **Investor (Nhà đầu tư):** Quyền chỉ xem (read-only) các báo cáo cấp độ Portfolio / Project.

Quy tắc duyệt CR: mỗi bước chỉ do thành viên dự án có đúng vai trò của bước đó quyết định. Người tạo CR vẫn được duyệt bước tương ứng với vai trò dự án của mình.

---

## 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### 4.0 Luồng nghiệp vụ tổng thể
Ý tưởng -> AI hỏi làm rõ yêu cầu -> tạo dự án (WBS) -> tính CPM và xem Gantt -> phát sinh Change Request -> duyệt BA -> PO -> PM -> lưu phiên bản (có thể rollback) -> xuất tài liệu SRS/BRD DOCX và báo cáo XLSX.

### 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001)
- PM nhập ý tưởng dự án bằng ngôn ngữ tự nhiên.
- AI dựng hồ sơ yêu cầu gồm 7 mục: mục tiêu, bên liên quan, trong phạm vi, ngoài phạm vi, tính năng chính, ràng buộc, tiêu chí thành công. Mỗi mục có trạng thái: rõ (clear), còn thiếu (missing), giả định (assumed), bỏ qua (skipped).
- AI hỏi đúng một câu mỗi lượt và có thể đề xuất giả định, tối đa 12 lượt. AI không ghi đè mục người dùng đã xác nhận. Người dùng có thể chọn "Bỏ qua, tạo luôn" để kết thúc sớm.
- Khi hồ sơ đã chốt, AI sinh cấu trúc WBS (Phases, Sprints, Epics, Tasks, Dependencies) cùng thời lượng ước tính, chỉ dùng các mục rõ hoặc giả định; mục bị bỏ qua không được tự bịa nội dung.
- Hệ thống chạy CPM và hiển thị Gantt để PM rà soát.

### 4.2 Quy trình phân bổ nhân sự (SOP-RM-001)
- PM phân công nhân sự hoặc yêu cầu AI gợi ý nhân sự theo kỹ năng (`user_skills`), chi phí (`hourly_rate`), và lịch nghỉ phép (`leaves`).
- Hệ thống chạy `Resource Leveling` để phát hiện và cảnh báo nếu nhân sự bị quá tải (>8h/ngày).

### 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001)
- **Customer / PM** tạo CR ở trạng thái DRAFT và gửi duyệt (SUBMITTED).
- Khi gửi duyệt, hệ thống tạo 3 bước duyệt tuần tự BA -> PO -> PM. Nếu dự án thiếu thành viên cho một trong các vai trò này, hệ thống từ chối với lỗi 422 `missing_roles`.
- **AI** chạy `Phân tích tác động` (SOP-AI-002) tính toán mức ảnh hưởng về chi phí, rủi ro, tiến độ trên trang Change Request; PM có thể dùng tiếp `Schedule Optimization` (SOP-AI-003) để đề xuất lịch trình tối ưu.
- Thành viên đúng vai trò quyết định bước hiện hành; hệ thống khóa bản ghi để chống quyết định đồng thời. Từ chối phải nêu lý do, khi đó các bước sau chuyển sang CANCELLED. Mọi quyết định được ghi audit log và gửi thông báo trong ứng dụng.
- Khi PM duyệt bước cuối, hệ thống tự động tạo snapshot phiên bản dự án gắn với CR đó.

### 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004)
- Snapshot gồm phase, sprint, epic, milestone, task và dependency; không gồm worklog, comment, subtask, assignment. Tối đa 50 phiên bản mỗi dự án.
- PM hoặc admin có thể tạo baseline thủ công. Có thể so sánh hai phiên bản hoặc một phiên bản với hiện trạng; kết quả chỉ liệt kê phần thay đổi.
- Rollback thực hiện trong một transaction: task có dữ liệu phụ thuộc được lưu trữ (archived) thay vì xóa; worklog không bao giờ bị xóa; task đã bị xóa được tạo lại với ID mới kèm bảng ánh xạ ID. Trước khi khôi phục, hệ thống tạo phiên bản "trước khi khôi phục" để có thể đảo ngược, sau đó tính lại CPM.

### 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003)
- Thành viên cập nhật thời gian làm việc hàng ngày qua Timesheet.
- Mọi thay đổi về thời gian hoặc quan hệ phụ thuộc sẽ kích hoạt tính toán lại đường găng CPM (Topological Sort + Forward/Backward pass).
- Hệ thống cập nhật ES, EF, LS, LF, Float; Gantt chỉ đọc vẽ lại đường găng có nhãn chữ.

### 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001)
- PM yêu cầu sinh SRS hoặc BRD. AI viết nội dung theo nhóm mục trên mẫu cố định; mục "Giả định và vấn đề mở" được lấy từ hồ sơ yêu cầu. Sơ đồ quy trình BPMN được vẽ thành ảnh phía server và chèn vào tài liệu; nếu vẽ lỗi, hệ thống dùng bảng các bước thay thế.
- Nếu hồ sơ yêu cầu còn mục thiếu, hệ thống trả trạng thái cần làm rõ (`needs_clarification`) và mở lại vòng hỏi thay vì tự bịa nội dung.
- PM xuất báo cáo XLSX từ trang tổng quan dự án.

### 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005)
- Thành viên dự án trao đổi trực tiếp trong phòng Chat dự án theo thời gian thực qua WebSocket.
- Khi có thay đổi công việc, hệ thống tự động gửi thông báo fan-out tới toàn bộ nhóm dự án qua WebSocket và Email (email thật hiện đang tắt trên bản demo cloud).
- Job lịch hằng ngày lúc 08:00 (giờ Asia/Ho_Chi_Minh), do cron kích hoạt, gửi thông báo nhắc nhở các công việc bắt đầu trong ngày và sắp đến hạn.
- Job lịch hằng ngày lúc 08:30 (SOP-AI-005) quét rủi ro, tự động đánh giá sức khỏe và nguy cơ của mọi dự án đang hoạt động.

---

## 5. Trạng thái và phần chờ nghiệm thu

- Phase 4 (Workflow & Reporting) đã hoàn thành phần mã nguồn và kiểm thử tự động.
- Chờ nghiệm thu từ người dùng: duyệt quy tắc rollback V0, duyệt các checkpoint, chạy thử với provider AI thật, chạy kịch bản demo trên Render sau cold start.

---

*Cập nhật lần cuối: 2026-10-13 — Version 2.4*
