# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-17)

## Corpus Check
- 434 files · ~157,515 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3465 nodes · 9591 edges · 179 communities (138 shown, 12 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 776 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `868b7922`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- Button
- db/base.py
- login
- getApiErrorMessage
- models/user.py
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- AITaskType
- portfolios/[id]/page.tsx
- User
- wbs.py
- useTasks.ts
- RiskWidget.tsx
- endpoints/ai.py
- NotificationService
- formatDate
- test_auth_password_recovery.py
- test_login_lockout.py
- project_repository.py
- test_route_exposure.py
- ai_tasks.py
- compilerOptions
- milestones.py
- ValueError
- create_refresh_token
- FastAPI
- task_service.py
- react
- as_user
- package.json
- dashboard_service.py
- TaskServiceDep
- list_portfolios
- Role
- NotFoundException
- project_service.py
- BadRequestException
- AuditService
- timedelta
- get_redis
- ProjectService
- AdminUserService
- list_projects
- test_schedule_optimizer.py
- api.ts
- Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- ChangeRequestDetail.tsx
- Project
- ConnectionManager
- scheduling_service.py
- DashboardService
- System Architecture Design
- TaskStatus
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- audit/page.tsx
- logging_config.py
- ResourceServiceDep
- useNotifications.ts
- test_reported_metrics_are_real.py
- Chi tiết các Giai đoạn đã hoàn thành
- endpoints/auth.py
- Software Requirements Specification (SRS)
- ForbiddenException
- test_dashboard_activity_scope.py
- test_resource_warnings.py
- BurndownChart.tsx
- AGENTS.md
- chat_service.py
- Chi tiết kế hoạch triển khai
- 3. Yêu cầu chức năng (Functional Requirements)
- test_dashboard_metrics.py
- Chi tiết các Giai đoạn
- approvals.py
- ChangeRequestService
- test_portfolio_project_core.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Chi tiết các Giai đoạn
- ProjectRepository
- list_notifications
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- capture_client_ip
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- PortfolioRepository
- scripts
- useAIGenerator.ts
- update_subtask
- middleware.ts
- schemas/gantt.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- get_chat_history
- test_notification_triggers.py
- playwright
- .eslintrc.json
- Findings
- next-env.d.ts
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- is_admin
- 11. Cài đặt và Chạy hệ thống
- get_dashboard_summary
- generate_impact_analysis
- 3. Technology Stack
- risk_analyzer.py
- tailwind.config.ts
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- create_dependency
- SchedulePanel.tsx
- rate_limit_exceeded_handler
- report_tasks.py
- get_critical_path
- CLAUDE.md
- validate_password_policy
- test_phase2_task_wbs.py
- vitest
- test_ai_service.py
- test_ws_hardening.py
- StorageService
- forgot-password/page.tsx
- get_dashboard_service
- get_task_service
- resource_leveling
- Any
- date
- AsyncSession
- ChangeRequest
- Depends
- asyncio

## God Nodes (most connected - your core abstractions)
1. `User` - 214 edges
2. `ForbiddenException` - 77 edges
3. `WBSService` - 70 edges
4. `Base` - 68 edges
5. `TaskService` - 68 edges
6. `NotFoundException` - 64 edges
7. `Task` - 62 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `_build_prompt()` --calls--> `wrap_user_input()`  [INFERRED]
  backend/app/services/ai/schedule_optimizer.py → backend/app/services/ai/parsing.py
- `run_schedule_optimization()` --calls--> `compute_cpm_for_project()`  [INFERRED]
  backend/app/services/ai/schedule_optimizer.py → backend/app/utils/cpm.py
- `run_schedule_optimization()` --calls--> `offsets_to_dates()`  [INFERRED]
  backend/app/services/ai/schedule_optimizer.py → backend/app/utils/cpm.py

## Import Cycles
- None detected.

## Communities (179 total, 12 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (69): LoginPageProps, metadata, Alert(), AlertProps, VARIANT_CLASSES, Button, Input, InputProps (+61 more)

### Community 2 - "db/base.py"
Cohesion: 0.07
Nodes (37): AIOutput, Approval, ApprovalStatus, str, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest (+29 more)

### Community 3 - "login"
Cohesion: 0.12
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (56): VerificationState, VerifyEmailContent(), verify(), ProfilePageContent(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout() (+48 more)

### Community 5 - "models/user.py"
Cohesion: 0.13
Nodes (29): Assignment, Leave, LeaveStatus, LeaveType, str, _candidate_payload(), _candidate_stats(), _clamp_fit_score() (+21 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.14
Nodes (17): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+9 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (43): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+35 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.19
Nodes (15): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+7 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.11
Nodes (34): ProjectMembersPage(), ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, useAIJob(), useGenerateProject(), InviteMemberDialog(), ProjectMembersTable() (+26 more)

### Community 10 - "oauth.py"
Cohesion: 0.12
Nodes (30): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+22 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 13 - "AITaskType"
Cohesion: 0.07
Nodes (42): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+34 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (27): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, PortfolioList() (+19 more)

### Community 15 - "User"
Cohesion: 0.07
Nodes (25): EpicStatus, str, MilestoneStatus, str, str, SprintStatus, User, AsyncSession (+17 more)

### Community 16 - "wbs.py"
Cohesion: 0.07
Nodes (59): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+51 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (34): taskKeys, useInvalidate(), wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate (+26 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "endpoints/ai.py"
Cohesion: 0.05
Nodes (67): AdminUserServiceDep, AIServiceDep, AuditServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends (+59 more)

### Community 20 - "NotificationService"
Cohesion: 0.13
Nodes (22): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, NotificationType, str, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse (+14 more)

### Community 21 - "formatDate"
Cohesion: 0.07
Nodes (43): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), TaskTable(), ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard(), STATUS_BADGE (+35 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.23
Nodes (18): ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+10 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (24): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+16 more)

### Community 24 - "project_repository.py"
Cohesion: 0.15
Nodes (7): Portfolio, BaseRepository, Any, AsyncSession, datetime, datetime, ModelType

### Community 25 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.09
Nodes (32): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, generate_project_task(), _generate_with_own_session(), impact_analysis_task() (+24 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 29 - "ValueError"
Cohesion: 0.06
Nodes (41): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, str, RiskLevel, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate. (+33 more)

### Community 30 - "create_refresh_token"
Cohesion: 0.10
Nodes (38): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+30 more)

### Community 31 - "FastAPI"
Cohesion: 0.08
Nodes (38): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, # NOTE: các route này dùng path converter tường minh "{user_id:int}" (không phải, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles() (+30 more)

### Community 32 - "task_service.py"
Cohesion: 0.12
Nodes (28): DependencyType, str, str, SubtaskStatus, str, TaskPriority, PaginatedResponse, AssignmentResponse (+20 more)

### Community 33 - "react"
Cohesion: 0.09
Nodes (29): AdminLayout(), TABS, MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, ButtonProps, VARIANT_CLASSES (+21 more)

### Community 34 - "as_user"
Cohesion: 0.10
Nodes (34): AsyncClient, as_user(), client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture (+26 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (30): description, name, overrides, postcss, private, version, autoprefixer, axios (+22 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.15
Nodes (24): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth (+16 more)

### Community 37 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 39 - "Role"
Cohesion: 0.07
Nodes (51): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+43 more)

### Community 40 - "NotFoundException"
Cohesion: 0.10
Nodes (16): AIJobResponse, AIResultResponse, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, NotFoundException, TooManyRequestsException, UnprocessableException, AIRequestType (+8 more)

### Community 41 - "project_service.py"
Cohesion: 0.19
Nodes (19): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate (+11 more)

### Community 42 - "BadRequestException"
Cohesion: 0.08
Nodes (23): BadRequestException, ServiceUnavailableException, UnauthorizedException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, AuthService, AsyncSession, datetime (+15 more)

### Community 43 - "AuditService"
Cohesion: 0.24
Nodes (9): AuditService, AsyncSession, datetime, PaginatedResponse, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio, test_list_maps_rows_with_actor() (+1 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "get_redis"
Cohesion: 0.10
Nodes (30): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), close_redis(), get_redis() (+22 more)

### Community 46 - "ProjectService"
Cohesion: 0.16
Nodes (9): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, date, Depends, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec… (+1 more)

### Community 47 - "AdminUserService"
Cohesion: 0.24
Nodes (26): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, PaginatedResponse, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user() (+18 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.15
Nodes (29): Any, _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), SOP-AI-003: Đề xuất tối ưu lịch trình bằng AI (fast-track / crash / cân bằng…, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+21 more)

### Community 50 - "api.ts"
Cohesion: 0.09
Nodes (33): AuthLayout(), OAuthCallbackContent(), DashboardLayout(), Props, ChatPanel(), handleSend(), Props, chatKeys (+25 more)

### Community 51 - "Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Checkpoint: 4 trụ cột backend/frontend cô lập xong, Checkpoint: Tích hợp hoàn chỉnh, Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 52 - "Task"
Cohesion: 0.13
Nodes (15): Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc…, Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model, nên…, Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00. (+7 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.16
Nodes (29): verify_password(), ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate (+21 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ChangeRequestDetail.tsx"
Cohesion: 0.16
Nodes (19): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useImpactAnalysisJob(), useRunImpactAnalysis() (+11 more)

### Community 57 - "Project"
Cohesion: 0.13
Nodes (26): AIRequest, Project, Worklog, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., project_work() (+18 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "scheduling_service.py"
Cohesion: 0.13
Nodes (19): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession, Depends, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy… (+11 more)

### Community 60 - "DashboardService"
Cohesion: 0.15
Nodes (12): ActiveProjectSummary, DashboardService, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*., Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., BurndownPoint (+4 more)

### Community 61 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 62 - "TaskStatus"
Cohesion: 0.18
Nodes (13): Notification, TaskStatus, AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates() (+5 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (17): metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status(), ThemeContext (+9 more)

### Community 65 - "audit/page.tsx"
Cohesion: 0.22
Nodes (11): AdminAuditPage(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs() (+3 more)

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.16
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "useNotifications.ts"
Cohesion: 0.09
Nodes (25): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+17 more)

### Community 69 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (19): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+11 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "endpoints/auth.py"
Cohesion: 0.27
Nodes (14): Làm mới access token. Trình duyệt không gửi gì cả — refresh token tới từ cookie…, refresh_token(), AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel (+6 more)

### Community 72 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "ForbiddenException"
Cohesion: 0.08
Nodes (30): Assignment, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException, ForbiddenException (+22 more)

### Community 74 - "test_dashboard_activity_scope.py"
Cohesion: 0.22
Nodes (10): _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_recent_activity_filters_by_visible_projects() (+2 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 78 - "chat_service.py"
Cohesion: 0.14
Nodes (27): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án. (+19 more)

### Community 79 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 80 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 82 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "ChangeRequestService"
Cohesion: 0.12
Nodes (31): asyncio, AsyncSession, create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get (+23 more)

### Community 85 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 86 - "documents.py"
Cohesion: 0.14
Nodes (14): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, post, put (+6 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.14
Nodes (14): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, post, put (+6 more)

### Community 88 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 89 - "project_versions.py"
Cohesion: 0.14
Nodes (14): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, post, put (+6 more)

### Community 90 - "reports.py"
Cohesion: 0.14
Nodes (14): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, post, put (+6 more)

### Community 91 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 92 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 93 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.13
Nodes (4): ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`.

### Community 95 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 96 - "Business Requirements Document (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Business Objectives), 1. Tổng quan dự án (Project Overview), 2.1 Các tính năng trong phạm vi (In-Scope), 2.2 Ngoài phạm vi (Out-of-Scope), 2. Phạm vi dự án (Project Scope), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), AI Project Planning & Portfolio Management System (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 98 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "capture_client_ip"
Cohesion: 0.18
Nodes (13): set_request_id(), Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), attach_request_id(), capture_client_ip(), Request (+5 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song), Task 1: Change Request CRUD tối giản, Task 2: AI Impact Analysis (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Risk Analysis (SOP-AI-005) — song song, sau Task 1 (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.43
Nodes (5): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 106 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 111 - "test_notification_triggers.py"
Cohesion: 0.33
Nodes (12): TaskStatusUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged(), test_notify_project_team_excludes_given_users() (+4 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 125 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "is_admin"
Cohesion: 0.25
Nodes (3): User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, is_admin()

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 149 - "generate_impact_analysis"
Cohesion: 0.33
Nodes (7): _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, xKiro là provider AI duy nhất được hỗ trợ (gộp nhiều model miễn phí sau 1 API…, Gọi AI để phân tích tác động của một change request. Trả về dict thô, CHƯA được…, _truncate()

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "risk_analyzer.py"
Cohesion: 0.12
Nodes (33): str, RiskLevel, RiskReport, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score() (+25 more)

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-16)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 157 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 158 - "SchedulePanel.tsx"
Cohesion: 0.16
Nodes (16): ACTION_LABEL, SchedulePanel(), SchedulePanelProps, SchedulePanelTask, STATUS_LABEL, IN_PROGRESS, scheduleOptimizationJobKeys, useOptimizeSchedule() (+8 more)

### Community 159 - "rate_limit_exceeded_handler"
Cohesion: 0.28
Nodes (9): client_key(), Request, Response, rate_limit_exceeded_handler(), Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, _retry_after_seconds() (+1 more)

### Community 160 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 161 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 163 - "validate_password_policy"
Cohesion: 0.40
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 164 - "test_phase2_task_wbs.py"
Cohesion: 0.08
Nodes (51): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+43 more)

### Community 165 - "vitest"
Cohesion: 0.40
Nodes (4): mocks, @testing-library/react, @testing-library/user-event, vitest

### Community 166 - "test_ai_service.py"
Cohesion: 0.41
Nodes (12): AIRequestStatus, str, ai_request(), db(), asyncio, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (41): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+33 more)

### Community 168 - "StorageService"
Cohesion: 0.15
Nodes (8): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, get_user_service(), AsyncSession, Depends, Minio, StorageServiceDep

### Community 169 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 170 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 171 - "get_task_service"
Cohesion: 0.50
Nodes (3): get_task_service(), AsyncSession, Depends

### Community 172 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

## Knowledge Gaps
- **376 isolated node(s):** `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-09-16)`, `Hạ tầng Real-time & WebSocket Architecture`, `Backend (Python)` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1168 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `models/user.py`, `portfolio_service.py`, `is_admin`, `endpoints/ai.py`, `project_repository.py`, `ai_tasks.py`, `create_refresh_token`, `FastAPI`, `task_service.py`, `as_user`, `dashboard_service.py`, `list_portfolios`, `Role`, `test_ws_hardening.py`, `project_service.py`, `NotFoundException`, `BadRequestException`, `timedelta`, `ProjectService`, `AdminUserService`, `list_projects`, `Project`, `scheduling_service.py`, `DashboardService`, `ForbiddenException`, `chat_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `portfolio_service.py`, `User`, `is_admin`, `endpoints/ai.py`, `NotificationService`, `test_route_exposure.py`, `create_refresh_token`, `FastAPI`, `task_service.py`, `dashboard_service.py`, `test_ai_service.py`, `test_ws_hardening.py`, `NotFoundException`, `Role`, `BadRequestException`, `project_service.py`, `ProjectService`, `AdminUserService`, `DashboardService`, `chat_service.py`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `AuthService` connect `BadRequestException` to `endpoints/auth.py`, `NotFoundException`, `ForbiddenException`, `timedelta`, `User`, `test_user_profile_settings.py`, `test_auth_password_recovery.py`, `test_login_lockout.py`, `create_refresh_token`, `FastAPI`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 49 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 49 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-09-16)` to the rest of the system?**
  _376 weakly-connected nodes found - possible documentation gaps or missing edges._