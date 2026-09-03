# Business Requirements Document (BRD)
## AI Project Planning & Portfolio Management System

**Version:** 2.2
**Date:** 2026-08-22

---

## 1. Tổng quan dự án (Project Overview)

### 1.1 Mục đích (Purpose)
Xây dựng một hệ thống quản lý danh mục và kế hoạch dự án thông minh (AI Project Planning & Portfolio Management). Hệ thống có các tính năng cốt lõi tương đương Microsoft Project nhưng được tăng cường sức mạnh bởi Trí tuệ Nhân tạo (AI) để tự động hóa việc lên kế hoạch, phân bổ nguồn lực, phân tích rủi ro và đánh giá tác động của các thay đổi (Change Requests), đồng thời hỗ trợ cộng tác thời gian thực (Real-time Project Chat & WebSocket Notifications).

### 1.2 Mục tiêu kinh doanh (Business Objectives)
- **Tự động hóa lập kế hoạch:** Giảm 80% thời gian tạo cấu trúc WBS và lên lịch dự án nhờ AI (OpenAI/Gemini).
- **Tối ưu hóa nguồn lực:** Tự động phát hiện cảnh báo quá tải (Resource Leveling) và gợi ý nhân sự phù hợp cho công việc.
- **Kiểm soát rủi ro và thay đổi:** Chuẩn hóa quy trình Change Request (CR) nhiều bước, có AI phân tích tác động trước khi áp dụng.
- **Cộng tác & Giao tiếp tức thời:** Kênh Chat nhóm trực tiếp theo từng dự án và hệ thống thông báo đẩy thời gian thực giảm độ trễ trao đổi thông tin.
- **Tự động hóa giám sát tiến độ:** Quét định kỳ hàng ngày phát hiện sớm các công việc bắt đầu trong ngày hoặc sắp đến hạn để thông báo tự động tới toàn nhóm dự án.
- **Minh bạch thông tin & Quản trị:** Cung cấp Dashboard đa chiều (Gantt, Burndown, EVA), hệ thống phân quyền 34 permissions và Audit Trail toàn diện.

---

## 2. Phạm vi dự án (Project Scope)

### 2.1 Các tính năng trong phạm vi (In-Scope)
- **Quản lý phân cấp dự án:** Portfolio → Project → Phase / Sprint / Epic / Milestone → Task → Subtask.
- **Thuật toán đường găng (CPM):** Tự động tính toán Early Start/Finish, Late Start/Finish, Total Float và xác định Critical Path.
- **Cộng tác thời gian thực (Real-Time Collaboration):** Kênh Project Chat kết nối WebSocket, hỗ trợ phân trang lịch sử tin nhắn và đếm số tin chưa đọc.
- **Thông báo đa kênh & Quét định kỳ:** Đẩy thông báo thời gian thực qua WebSocket, fan-out thông báo khi Task thay đổi và Celery Beat quét lịch tự động hàng ngày lúc 08:00 AM.
- **Quản trị hệ thống & RBAC:** Quản lý Người dùng, Vai trò, gán 34 quyền hạn và xem Audit Timeline truy vết mọi thay đổi.
- **Tích hợp AI (SOP-AI-001 đến SOP-AI-005):** Tạo dự án từ prompt, phân tích rủi ro, phân tích tác động, tối ưu lịch trình, gợi ý nhân sự.
- **Quản lý Change Request (CR) & Phê duyệt đa cấp:** Luồng duyệt tuần tự BA → PO → PM kèm AI Impact Analysis.
- **Time Tracking & Timesheet:** Ghi nhận giờ làm việc thực tế (`worklogs`) và kiểm tra quá tải tài nguyên.
- **Quản lý phiên bản (Versioning & Rollback):** Snapshot baseline và khôi phục dữ liệu dự án.
- **Dashboard & Báo cáo:** Gantt Chart tương tác, Burndown, Burnup, Velocity, CPI/SPI/EVA và xuất báo cáo DOCX/XLSX.
- **Quản lý tài liệu:** Tải lên tài liệu BRD/SRS lên MinIO và bóc tách tài liệu bằng AI.

### 2.2 Ngoài phạm vi (Out-of-Scope)
- Thanh toán và tích hợp cổng thanh toán trực tuyến.
- Quản lý kho mã nguồn (Git Server Hosting).
- Tích hợp CI/CD Pipeline runner nội bộ.

---

## 3. Các bên liên quan và Vai trò (Stakeholders & Roles)

Hệ thống hỗ trợ 7 vai trò riêng biệt với các quyền hạn cụ thể (RBAC):

1. **Admin (Quản trị hệ thống):** Quản lý tài khoản người dùng, phân quyền vai trò (34 permissions), theo dõi Audit Timeline, cấu hình AI provider.
2. **Project Manager - PM (Quản lý dự án):** Tạo/quản lý Portfolio & Project, phân công nhân sự, quản lý thành viên, duyệt Change Request cuối, apply kế hoạch, rollback version, xuất báo cáo.
3. **Business Analyst - BA:** Xem xét và đánh giá Change Request trước khi chuyển tiếp cho PO, xem báo cáo tác động AI Impact Report.
4. **Product Owner - PO:** Duyệt yêu cầu thay đổi (CR) về mặt nghiệp vụ, theo dõi tiến độ tổng thể và các cột mốc dự án.
5. **Member (Thành viên đội dự án):** Nhận task, Start/Stop công việc, cập nhật worklog timesheet, trao đổi trong kênh Real-time Project Chat.
6. **Customer (Khách hàng):** Khởi tạo yêu cầu thay đổi (CR), theo dõi tiến độ dự án của mình.
7. **Investor (Nhà đầu tư):** Quyền chỉ xem (read-only) các báo cáo cấp độ Portfolio / Project Dashboard.

---

## 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001)
- PM nhập mô tả dự án bằng ngôn ngữ tự nhiên (Prompt).
- AI phân tích và trả về cấu trúc WBS (Phases, Sprints, Epics, Tasks, Dependencies) cùng thời lượng ước tính.
- Hệ thống chạy CPM và khởi tạo biểu đồ Gantt ban đầu để PM tùy chỉnh trước khi kích hoạt.

### 4.2 Quy trình phân bổ nhân sự (SOP-RM-001)
- PM phân công nhân sự hoặc yêu cầu AI gợi ý nhân sự theo kỹ năng (`user_skills`), chi phí (`hourly_rate`), và lịch nghỉ phép (`leaves`).
- Hệ thống chạy `Resource Leveling` để phát hiện và cảnh báo nếu nhân sự bị quá tải (>8h/ngày).

### 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001)
- **Customer / PM** tạo CR.
- **BA** và **PO** lần lượt xem xét và phê duyệt về mặt nghiệp vụ.
- **AI** chạy `Impact Analysis` (SOP-AI-002) tính toán mức ảnh hưởng về chi phí, rủi ro, tiến độ.
- **PM** đánh giá báo cáo AI. Nếu đồng ý, AI chạy tiếp `Schedule Optimization` (SOP-AI-003) để vẽ lại lịch trình tối ưu.
- PM xác nhận bản lịch trình mới → Hệ thống tự động snapshot một bản `Project Version` cũ và apply thay đổi vào dự án chính thức.

### 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003)
- Thành viên cập nhật thời gian làm việc hàng ngày qua Timesheet.
- Mọi thay đổi về thời gian hoặc quan hệ phụ thuộc sẽ kích hoạt tính toán lại đường găng CPM (Topological Sort + Forward/Backward pass).
- Hệ thống tự động cập nhật ES, EF, LS, LF, Float và vẽ lại đường găng đỏ trên Gantt Chart.

### 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001)
- Thành viên dự án trao đổi trực tiếp trong phòng Chat dự án theo thời gian thực qua WebSocket.
- Khi có thay đổi công việc, hệ thống tự động gửi thông báo fan-out tới toàn bộ nhóm dự án qua WebSocket và Email.
- Celery Beat quét định kỳ hàng ngày lúc 08:00 AM gửi thông báo nhắc nhở các công việc bắt đầu trong ngày và sắp đến hạn.

---

*Cập nhật lần cuối: 2026-08-22 — Version 2.2*
