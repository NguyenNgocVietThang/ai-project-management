# Roadmap: Document AI & Polish Module (Phase 5)

> **Phiên bản:** 1.0 | **Cập nhật:** 2026-08-16  
> **Trạng thái:** ⏳ Chưa bắt đầu (0%) | **Ngày hoàn thành:** --  
> **Mức độ ưu tiên:** High – Tự động hóa tài liệu, Cổng nhà đầu tư, Thông báo đa kênh & Tối ưu hóa hiệu năng  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth), Phase 2 (Project Core), Phase 3 (AI Features), Phase 4 (Workflow & Reporting) đã hoàn thành

---

## Tổng quan Module

Module **Document AI & Polish (Phase 5)** hoàn thiện hệ sinh thái quản lý dự án thông minh với năng lực bóc tách tài liệu đặc tả tự động bằng AI, cung cấp cổng thông tin điều hành chỉ đọc cho Nhà đầu tư (Investor Portal), hệ thống gửi email tự động cho 13 sự kiện nghiệp vụ và tối ưu hóa toàn diện hiệu năng backend/frontend.

### 5 Trụ cột chính:
1. **Document AI Parser (SOP-DOC-001):** Tải lên tài liệu nghiệp vụ (BRD, SRS, RFP, PDF, DOCX, TXT) lên MinIO, sử dụng AI để tự động bóc tách Requirements, User Stories, Acceptance Criteria và gợi ý cấu trúc phân rã WBS.
2. **Investor Dashboard Portal:** Cổng thông tin điều hành chỉ đọc (Read-Only) dành riêng cho vai trò **Investor**, tổng hợp chỉ số ROI, ngân sách, sức khỏe danh mục dự án và tiến độ tổng thể.
3. **Email & Multi-channel Notification System (SOP-NOTI-001):** Hệ thống gửi email tự động không đồng bộ qua Celery + FastAPI-Mail cho **13 sự kiện hệ thống**, kèm trang quản lý tùy chọn thông báo (Notification Preferences) cá nhân hóa.
4. **Profile & Avatar Management Polish:** Nâng cấp trang hồ sơ người dùng, hỗ trợ tải lên và cắt ảnh đại diện (Avatar Crop & Resize qua Pillow), nén WebP và lưu trữ an toàn trên MinIO.
5. **Performance Optimization & Mobile Responsive Polish:** Tối ưu hóa truy vấn cơ sở dữ liệu (indexing, eager loading), caching Redis cho các API thống kê nặng, lazy loading thư viện biểu đồ và tinh chỉnh giao diện chuẩn Responsive trên Mobile/Tablet.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| MinIO File Storage & Bucket `ai-project-files` | Đã có sẵn | Lưu trữ tài liệu BRD/SRS và Avatar |
| Database Models: `documents`, `notifications`, `email_logs`, `users` | Đã migrate | Sẵn sàng lưu trữ dữ liệu |
| FastAPI-Mail & SMTP Configuration | Đã cấu hình | `backend/app/utils/email.py` |
| Celery Task Queue & Redis Broker | Đã có sẵn | Chạy background jobs cho Document AI & Email dispatch |
| RBAC Role `Investor` | Đã cấu hình | Cần áp dụng RBAC Guard chặt chẽ cho chế độ Read-Only |

---

## Danh mục tính năng cần triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| BRD/SRS Document AI Parser | SOP-DOC-001 | Critical | ⏳ Chưa bắt đầu | `DocumentParserService` + Celery | `DocumentUploadZone`, `ExtractedReqEditor` |
| Investor Dashboard (Read-Only) | Portal | High | ⏳ Chưa bắt đầu | `InvestorService` + RBAC Guard | `InvestorOverviewPage`, `ROICard` |
| Email Notifications (13 Events) | SOP-NOTI-001 | High | ⏳ Chưa bắt đầu | `NotificationService` + `send_email_task` | `NotificationCenter`, `EmailPreferences` |
| Avatar Upload, Crop & Resize | Core | Medium | ⏳ Chưa bắt đầu | `ProfileService` + Pillow + MinIO | `AvatarCropModal`, `ProfileSettings` |
| Query Optimization & Redis Caching | Performance | High | ⏳ Chưa bắt đầu | Indexing + Redis Cache Helper | Next.js Dynamic Imports, Lazy Charts |
| Mobile & Tablet Responsive Polish | UI/UX | High | ⏳ Chưa bắt đầu | API throttling & optimized payloads | Mobile Navigation & Responsive Tables |

---

## Chi tiết kế hoạch triển khai theo Phase

---

## GIAI ĐOẠN 5.1 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Cho phép BA/PM tải lên các file tài liệu nghiệp vụ (BRD, SRS, RFP, PRD). Hệ thống trích xuất văn bản (PDF qua `PyPDF2`, DOCX qua `python-docx`), sau đó AI phân tích bóc tách các yêu cầu, đề xuất danh sách Phase/Task và cho phép người dùng review để khởi tạo dự án tự động.

### 1. Luồng xử lý (Workflow)
```
1. Upload File (PDF/DOCX/TXT) -> POST /api/v1/documents/upload -> Lưu MinIO -> Tạo record documents
2. Trigger Parse -> POST /api/v1/documents/{id}/parse -> Celery Task (parse_document_task)
3. Worker tải file từ MinIO -> Trích xuất text thô -> Chia chunk thông minh
4. AI Provider (GPT-4o/Gemini) trích xuất:
   - Functional & Non-Functional Requirements
   - User Stories (As a... I want... So that...)
   - Đề xuất cấu trúc WBS (Phases & Tasks)
5. Lưu kết quả JSON vào ai_outputs
6. Giao diện Frontend hiển thị Extracted Requirements Editor để BA/PM duyệt
7. 1-Click "Create Project from Document" -> Tự động sinh WBS vào Project chính thức
```

### 2. Backend Implementation

**[NEW] `backend/app/services/document_parser_service.py`**
```python
class DocumentParserService:
    async def extract_raw_text(self, file_path: str, content_type: str) -> str:
        """Xử lý bóc tách text từ PDF, DOCX hoặc văn bản thuần."""
        pass
    
    async def parse_requirements_with_ai(self, raw_text: str) -> dict:
        """Gửi prompt chuẩn hóa cấu trúc JSON tới AI Provider để trích xuất Requirements & WBS."""
        pass
```

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm `parse_document_task(document_id: str, user_id: str)`: Tải file từ MinIO, gọi `DocumentParserService`, cập nhật `documents.status = PARSED` và phát thông báo `DOCUMENT_PARSED`.

**[NEW] `backend/app/api/v1/endpoints/documents.py`**
- `POST /api/v1/documents/upload` — Upload tài liệu multipart/form-data.
- `POST /api/v1/documents/{document_id}/parse` — Kích hoạt tác vụ parse AI.
- `GET /api/v1/documents/{document_id}/extracted` — Lấy dữ liệu yêu cầu và WBS đã bóc tách.
- `POST /api/v1/documents/{document_id}/convert-to-project` — Tạo Project & WBS chính thức từ tài liệu đã duyệt.

### 3. Frontend Implementation

**[NEW] `frontend/src/features/documents/components/DocumentUploadZone.tsx`**
- Drag & Drop zone hỗ trợ các định dạng `.pdf`, `.docx`, `.txt`, `.md` (giới hạn file < 25MB).
- Thanh hiển thị tiến trình Upload và Parsing AI (Spinner / Progress bar).

**[NEW] `frontend/src/features/documents/components/ExtractedRequirementsEditor.tsx`**
- Giao diện 2 tab:
  - **Tab 1: Requirements & User Stories** (dạng bảng cho phép sửa tiêu đề, mô tả, độ ưu tiên).
  - **Tab 2: Suggested WBS Structure** (cây thư mục Phase -> Task).
- Nút "Approve & Generate Project" kích hoạt tạo dự án mới.

---

## GIAI ĐOẠN 5.2 – Investor Dashboard Portal (Executive Read-Only View)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Cung cấp giao diện dashboard cấp cao dành riêng cho vai trò **Investor** để theo dõi hiệu quả đầu tư, tỷ lệ hoàn vốn (ROI), tổng chi ngân sách danh mục và trạng thái các dự án mà không được phép sửa đổi dữ liệu.

### 1. Phân quyền RBAC & Luồng xử lý
- Mọi endpoint sửa đổi (POST, PUT, PATCH, DELETE) phải chặn người dùng có role `Investor` và trả về `403 Forbidden`.
- Role `Investor` chỉ có quyền truy cập vào các router `/api/v1/investor/*` và các endpoint xem chi tiết read-only.

### 2. Backend Implementation

**[NEW] `backend/app/services/investor_service.py`**
```python
class InvestorService:
    async def get_portfolio_summary(self, user: User, db: AsyncSession) -> InvestorPortfolioSummary:
        """Tổng hợp số lượng dự án, tổng vốn cam kết, tổng tiền đã chi, % hoàn thành trung bình."""
        pass
    
    async def calculate_roi(self, portfolio_id: UUID, db: AsyncSession) -> ROIDataResponse:
        """Tính toán ROI dự kiến dựa trên ngân sách, chi phí thực tế và giá trị hoàn thành: ROI = ((EV - AC) / AC) * 100%."""
        pass
```

**[NEW] `backend/app/api/v1/endpoints/investor.py`**
- `GET /api/v1/investor/portfolio-summary` — Tổng quan danh mục cho nhà đầu tư.
- `GET /api/v1/investor/roi` — Thống kê ROI và sức khỏe ngân sách.
- `GET /api/v1/investor/projects-health` — Ma trận phân loại dự án (On Track / At Risk / Delayed).
- `GET /api/v1/investor/export-summary` — Xuất báo cáo tóm tắt 1 trang cho hội đồng đầu tư.

### 3. Frontend Implementation

**[NEW] `frontend/src/app/(dashboard)/investor/page.tsx`**
- Trang Dashboard chuyên biệt cho Investor:
  - Card 1: Tổng vốn đầu tư (Total Capital & Allocated Budget).
  - Card 2: Chỉ số ROI tổng hợp & Dự báo tài chính.
  - Card 3: Ma trận sức khỏe dự án (Project Health Matrix).
  - Card 4: Danh sách các Milestone chiến lược sắp đến hạn.
  - Button "Export Executive Brief".

---

## GIAI ĐOẠN 5.3 – Email Notification System (13 Events) (SOP-NOTI-001)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Tự động gửi email thông báo định dạng HTML đẹp mắt khi phát sinh các sự kiện nghiệp vụ quan trọng, đồng thời cho phép người dùng cấu hình bật/tắt nhận email theo từng loại sự kiện.

### 1. Danh sách 13 sự kiện thông báo chuẩn:
1. `TASK_ASSIGNED` — Khi thành viên được phân công task mới.
2. `TASK_DUE` — Cảnh báo 24 giờ trước khi task đến hạn (Deadline reminder).
3. `TASK_OVERDUE` — Cảnh báo khi task bị quá hạn.
4. `PROJECT_MILESTONE` — Chúc mừng khi dự án chạm cột mốc quan trọng.
5. `CR_SUBMITTED` — Thông báo khi có Change Request mới cần xem xét.
6. `APPROVAL_REQUIRED` — Thông báo cho BA/PO/PM khi đến lượt mình duyệt CR.
7. `CR_APPROVED` — Thông báo cho người yêu cầu khi CR được thông qua.
8. `CR_REJECTED` — Thông báo kèm lý do khi CR bị từ chối.
9. `RISK_HIGH_DETECTED` — Cảnh báo khẩn cấp khi AI phát hiện rủi ro mức Critical.
10. `VERSION_ROLLBACK` — Thông báo cho toàn đội ngũ khi dự án bị rollback phiên bản.
11. `PROJECT_CREATED` — Thông báo khi dự án mới được khởi tạo trong Portfolio.
12. `MEMBER_INVITED` — Email mời tham gia vào dự án kèm vai trò.
13. `DOCUMENT_PARSED` — Thông báo khi AI hoàn tất bóc tách tài liệu BRD/SRS.

### 2. Backend Implementation

**[NEW] `backend/app/services/notification_service.py`**
- Quản lý template email Jinja2 động (`templates/email/`).
- Tích hợp kiểm tra bảng `notification_preferences` trước khi gửi.
- Ghi nhật ký mọi email gửi ra vào bảng `email_logs`.

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm Celery task: `send_email_task(recipient_email: str, event_type: str, context_data: dict)`.

**[NEW] `backend/app/api/v1/endpoints/notifications.py`**
- `GET /api/v1/users/notification-preferences` — Lấy cấu hình thông báo của user.
- `PUT /api/v1/users/notification-preferences` — Cập nhật cấu hình bật/tắt email/in-app cho từng event.
- `GET /api/v1/notifications` — Danh sách thông báo in-app (hỗ trợ đánh dấu đã đọc).

### 3. Frontend Implementation

**[NEW] `frontend/src/features/notifications/components/NotificationPreferencesForm.tsx`**
- Bảng ma trận các sự kiện kèm 2 cột checkbox: [x] Thông báo In-App | [x] Gửi Email.

**[NEW] `frontend/src/features/notifications/components/NotificationBellDropdown.tsx`**
- Icon chuông thông báo trên Header Navbar với số lượng unread badge và dropdown xem nhanh thông báo.

---

## GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Hoàn thiện trải nghiệm cá nhân hóa hồ sơ: cập nhật thông tin nghề nghiệp (`department`, `position`, `hourly_rate`, `skills`), tải lên avatar với công cụ cắt ảnh (Crop tool), nén WebP và lưu trữ trên MinIO.

### 1. Luồng xử lý (Workflow)
```
User chọn ảnh -> Frontend mở AvatarCropDialog (cắt tỷ lệ 1:1)
  -> Gửi file ảnh đã crop -> POST /api/v1/users/avatar
  -> Backend dùng Pillow chuẩn hóa 256x256 WebP
  -> Lưu lên MinIO bucket ai-project-files/avatars/{user_id}.webp
  -> Cập nhật avatar_url trong database và trả về URL mới
```

### 2. Backend Implementation

**[NEW] `backend/app/services/profile_service.py`**
```python
class ProfileService:
    async def upload_and_process_avatar(self, user_id: UUID, image_file: UploadFile) -> str:
        """Validate định dạng ảnh, sử dụng Pillow resize về 256x256, nén WebP và lưu lên MinIO."""
        pass
```

**[MODIFY] `backend/app/api/v1/endpoints/users.py`**
- `POST /api/v1/users/avatar` — Upload avatar.
- `DELETE /api/v1/users/avatar` — Xóa avatar và quay về default initials.

### 3. Frontend Implementation

**[NEW] `frontend/src/features/profile/components/AvatarCropDialog.tsx`**
- Modal cắt ảnh hình tròn/vuông trước khi upload (dùng thư viện `react-easy-crop` hoặc canvas crop).
- Tích hợp hiển thị Avatar toàn hệ thống (Task assignments, comment thread, timeline, header).

---

## GIAI ĐOẠN 5.5 – Performance Optimization, Mobile Responsiveness & Polish

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Tối ưu hóa hiệu năng toàn diện, đảm bảo thời gian tải trang chính < 3 giây, P95 API latency < 300ms và giao diện hoạt động mượt mà trên mọi thiết bị di động.

### 1. Chiến lược tối ưu hóa
- **Database Indexing:** Bổ sung composite indexes trên các bảng lớn: `tasks (project_id, status, is_critical)`, `assignments (task_id, user_id)`, `worklogs (task_id, logged_date)`, `audit_logs (project_id, created_at)`.
- **Eager Loading Optimization:** Sử dụng SQLAlchemy `selectinload()` và `joinedload()` để loại bỏ hoàn toàn vấn đề N+1 query trên các endpoint lấy danh sách WBS và Task details.
- **Redis Query Caching:** Lưu cache có TTL cho các endpoint tính toán nặng (Cache Gantt data: TTL 60s, Cache Portfolio Summary: TTL 300s).
- **Code Splitting & Lazy Loading:** Dynamic import cho các thư viện nặng (Recharts, Gantt Engine) với `next/dynamic`.
- **Responsive Layout:** Tối ưu thanh Navigation Bar, Sidebar dạng Drawer trên thiết bị di động, bảng dữ liệu hỗ trợ Horizontal Scroll.

### 2. Backend Implementation

**[NEW] `backend/app/core/cache.py`**
- Helper decorator `@cache_response(ttl_seconds=60, key_prefix="...")` tích hợp Redis client.

### 3. Frontend Implementation

**[MODIFY] `frontend/src/app/(dashboard)/layout.tsx`**
- Bổ sung Mobile Drawer navigation và responsive breakpoints (sm, md, lg, xl).

---

## Kế hoạch kiểm thử (Testing Strategy)

> **Trạng thái kiểm thử:** ⏳ Chưa thực hiện

1. **Unit Tests (`tests/unit/services/`):**
   - Test trích xuất text từ các mẫu file PDF và DOCX.
   - Test AI prompt extraction và xử lý trường hợp file hỏng/file rỗng.
   - Test độ chính xác của công thức tính ROI trong `InvestorService`.
2. **Integration Tests (`tests/integration/test_document_email_investor.py`):**
   - Test nghiêm ngặt phân quyền: Đảm bảo role Investor bị từ chối khi thực hiện bất kỳ lệnh tạo/sửa/xóa nào (HTTP 403 Forbidden).
   - Test gửi email qua Mock SMTP server cho cả 13 sự kiện hệ thống.
   - Test kiểm tra việc tôn trọng cấu hình tắt nhận email của người dùng trong `notification_preferences`.
3. **Performance & Load Tests:**
   - Benchmark thời gian render Gantt chart với dự án có 500+ tasks (< 3s).
   - Kiểm tra tỷ lệ cache hit của Redis đạt > 80% với các API đọc thường xuyên.
