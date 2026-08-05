# Business Requirements Document (BRD)
## AI Project Planning & Portfolio Management System

**Version:** 1.0
**Date:** 2026-06-25

---

## 1. Tổng quan dự án (Project Overview)

### 1.1 Mục đích (Purpose)
Xây dựng một hệ thống quản lý danh mục và kế hoạch dự án thông minh (AI Project Planning & Portfolio Management). Hệ thống có các tính năng cốt lõi tương đương Microsoft Project nhưng được tăng cường sức mạnh bởi Trí tuệ Nhân tạo (AI) để tự động hóa việc lên kế hoạch, phân bổ nguồn lực, phân tích rủi ro và đánh giá tác động của các thay đổi (Change Requests).

### 1.2 Mục tiêu kinh doanh (Business Objectives)
- **Tự động hóa lập kế hoạch:** Giảm 80% thời gian tạo cấu trúc WBS và lên lịch dự án nhờ AI (OpenAI/Gemini).
- **Tối ưu hóa nguồn lực:** Tự động phát hiện cảnh báo quá tải (Resource Leveling) và gợi ý nhân sự phù hợp cho công việc.
- **Kiểm soát rủi ro và thay đổi:** Chuẩn hóa quy trình Change Request (CR) nhiều bước, có AI phân tích tác động trước khi áp dụng.
- **Minh bạch thông tin:** Cung cấp Dashboard đa chiều (Gantt, Burndown, EVA) cho nhiều vai trò từ Thành viên đến Nhà đầu tư.

---

## 2. Phạm vi dự án (Project Scope)

### 2.1 Các tính năng trong phạm vi (In-Scope)
- Quản lý phân cấp: Portfolio → Project → Phase/Sprint/Epic → Task → Subtask.
- Tính toán đường găng (Critical Path Method - CPM) tự động khi có thay đổi.
- Tích hợp AI (SOP-AI-001 đến SOP-AI-005): Tạo dự án từ text, phân tích rủi ro, phân tích tác động, tối ưu lịch trình, gợi ý nhân sự.
- Hệ thống quản lý Change Request (CR) và Approval Workflow.
- Time Tracking (Ghi nhận giờ làm việc / Worklogs).
- Quản lý phiên bản dự án (Versioning) và Rollback.
- Dashboard báo cáo (Gantt Chart kéo thả, Burndown, Velocity, CPI/SPI).
- Xuất báo cáo tự động (DOCX, XLSX).
- Quản lý tài liệu (BRD, SRS) và nhận diện tài liệu bằng AI.
- Hệ thống phân quyền chi tiết (RBAC).

### 2.2 Ngoài phạm vi (Out-of-Scope Phase 1)
- Thanh toán và tích hợp cổng thanh toán.
- Quản lý mã nguồn (Git Integration).
- Tích hợp CI/CD Pipelines nội bộ.

---

## 3. Các bên liên quan và Vai trò (Stakeholders & Roles)

Hệ thống hỗ trợ 7 vai trò riêng biệt với các quyền hạn cụ thể (RBAC):

1. **Admin (Quản trị hệ thống):** Quản lý cấu hình AI, tài khoản, vai trò và phân quyền.
2. **Project Manager - PM (Quản lý dự án):** Tạo dự án, phân bổ tài nguyên, duyệt các bản tối ưu AI, chốt Change Request, quản lý phiên bản.
3. **Business Analyst - BA:** Cầu nối nghiệp vụ, xem xét và đánh giá Change Request trước khi đẩy lên PO.
4. **Product Owner - PO:** Duyệt yêu cầu thay đổi (CR) về mặt nghiệp vụ, theo dõi tiến độ tổng thể.
5. **Member (Thành viên đội dự án):** Nhận task, báo cáo tiến độ (start/stop tracking), cập nhật worklog.
6. **Customer (Khách hàng):** Khởi tạo yêu cầu thay đổi (CR), xem tiến độ dự án của mình.
7. **Investor (Nhà đầu tư):** Quyền chỉ xem (read-only) các báo cáo cấp độ Portfolio/Dashboard.

---

## 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001)
- PM nhập mô tả dự án bằng ngôn ngữ tự nhiên (Prompt).
- AI phân tích và trả về cấu trúc phân rã công việc (WBS: Phase, Epic, Task) cùng thời lượng ước tính và quan hệ phụ thuộc (Dependencies).
- Hệ thống tạo Gantt chart ban đầu. PM có thể tùy chỉnh lại trước khi chốt.

### 4.2 Quy trình phân bổ nhân sự (SOP-RM-001)
- Với mỗi Task, PM yêu cầu AI gợi ý nhân sự.
- AI đánh giá dựa trên: Kỹ năng (Skill match), chi phí (Cost/hr), lịch nghỉ phép (Leaves), và công việc đang đảm nhận.
- PM chọn nhân sự từ danh sách gợi ý. Hệ thống chạy `Resource Leveling` để cảnh báo nếu nhân sự bị quá tải (>8h/ngày).

### 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001)
- **Customer** tạo CR.
- **BA** và **PO** lần lượt duyệt về mặt nghiệp vụ.
- **AI** chạy `Impact Analysis` (SOP-AI-002) tính toán mức ảnh hưởng về chi phí, rủi ro và thời gian.
- **PM** đánh giá báo cáo AI. Nếu đồng ý, AI chạy tiếp `Schedule Optimization` (SOP-AI-003) để vẽ lại lịch trình.
- PM xác nhận bản lịch trình mới, hệ thống tự động lưu một bản `Project Version` cũ để phòng ngừa (Rollback) và áp dụng thay đổi.

### 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003)
- Members cập nhật thời gian làm việc hàng ngày.
- Mọi thay đổi về thời gian hoàn thành task hoặc dependencies sẽ kích hoạt thuật toán CPM (Topological Sort + Forward/Backward pass).
- Hệ thống tự tính toán lại ES, EF, LS, LF, Float time và vẽ lại Critical Path (đường găng) trên Gantt chart. Đảm bảo PM luôn biết task nào đang gây trễ dự án.
