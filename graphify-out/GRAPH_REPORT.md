# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-18)

## Corpus Check
- 434 files · ~157,704 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 28 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 2)

## Summary
- 3495 nodes · 10426 edges · 161 communities (135 shown, 26 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 925 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `209a78f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- react
- db/base.py
- post
- getApiErrorMessage
- test_resource_recommender.py
- portfolio_service.py
- users/page.tsx
- unittest_mock
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- risk_analyzer.py
- portfolios/[id]/page.tsx
- User
- wbs.py
- tasks/page.tsx
- RiskWidget.tsx
- users.py
- NotificationService
- formatDate
- test_auth_password_recovery.py
- test_login_lockout.py
- ws/chat.py
- test_route_exposure.py
- ai_tasks.py
- compilerOptions
- AuthService
- run_impact_analysis
- auth_service.py
- typing
- TaskService
- lucide-react
- test_authz_matrix.py
- package.json
- DashboardService
- schemas/task.py
- fixture
- roles.py
- AIService
- project_service.py
- BadRequestException
- types
- test_auth_email_verification.py
- get_redis
- ProjectService
- AdminUserService
- list_projects
- test_schedule_optimizer.py
- api.ts
- endpoints/ai.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- ChangeRequestDetail.tsx
- Project
- ConnectionManager
- AIResponseError
- RoleService
- System Architecture Design
- sweep_task_dates
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- ProjectCreate
- env.py
- ResourceServiceDep
- useNotifications.ts
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- PaginatedResponse
- Software Requirements Specification (SRS)
- ForbiddenException
- AuditLog
- test_resource_warnings.py
- TeamBarChart.tsx
- AGENTS.md
- ChatService
- config.py
- 3. Yêu cầu chức năng (Functional Requirements)
- UserRepository
- AuditService
- approvals.py
- test_change_request_service.py
- test_portfolio_project_core.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- test_token_revocation.py
- ProjectRepository
- list_notifications
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- pytest
- next.config.js
- FastAPI
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- test_project_scoping.py
- scripts
- useAIGenerator.ts
- update_subtask
- middleware.ts
- test_phase2_task_wbs.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- get_chat_history
- NotificationType
- playwright
- alembic
- date_utils.py
- AdminUserCreate
- sanitize.py
- BurndownChart.tsx
- vitest.config.mts
- get_current_active_superuser
- ApprovalStatus
- DocumentType
- EmailStatus
- .__init__
- .eslintrc.json
- publish
- next-env.d.ts
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- NotFoundException
- 11. Cài đặt và Chạy hệ thống
- 3. Technology Stack
- run_risk_analysis
- tailwind.config.ts
- 12. Cấu hình & Biến môi trường
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- _persist_plan
- useScheduleOptimization.ts
- rate_limit.py
- report_tasks.py
- get_critical_path
- CLAUDE.md
- validate_password_policy
- utils/cpm.py
- test_ws_hardening.py
- user_service.py

## God Nodes (most connected - your core abstractions)
1. `User` - 221 edges
2. `ForbiddenException` - 84 edges
3. `WBSService` - 73 edges
4. `TaskService` - 71 edges
5. `NotFoundException` - 68 edges
6. `Base` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `get_project_context()` - 59 edges

## Surprising Connections (you probably didn't know these)
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py
- `GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py
- `GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)` --references--> `WBSService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/wbs_service.py

## Import Cycles
- None detected.

## Communities (161 total, 26 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "react"
Cohesion: 0.05
Nodes (66): GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), metadata, LoginPageProps, metadata, metadata, Alert(), AlertProps, VARIANT_CLASSES (+58 more)

### Community 2 - "db/base.py"
Cohesion: 0.11
Nodes (27): Approval, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment, DependencyType, str, Document, EmailLog (+19 more)

### Community 3 - "post"
Cohesion: 0.10
Nodes (45): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+37 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.09
Nodes (43): AdminAuditPage(), AdminRolesPage(), DashboardPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectLayout(), ProjectMembersPage(), ProjectOverviewPage() (+35 more)

### Community 5 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (19): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+11 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.07
Nodes (34): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+26 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (44): AdminUsersPage(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys, useAdminRoles(), usePermissionCatalog(), DeactivateUserDialog() (+36 more)

### Community 8 - "unittest_mock"
Cohesion: 0.16
Nodes (18): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+10 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.14
Nodes (28): ProjectsPage(), InviteMemberDialog(), ProjectFields(), InitialProjectMember, ProjectWizard(), useAssignableRoles(), useUserSearch(), projectKeys (+20 more)

### Community 10 - "oauth.py"
Cohesion: 0.09
Nodes (39): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+31 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.29
Nodes (7): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications

### Community 12 - "my_assignments"
Cohesion: 0.20
Nodes (11): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+3 more)

### Community 13 - "risk_analyzer.py"
Cohesion: 0.05
Nodes (55): ABC, Assignment, ChangeRequest, Dependency, Leave, LeaveStatus, LeaveType, str (+47 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+16 more)

### Community 15 - "User"
Cohesion: 0.10
Nodes (18): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, User, EpicCreate (+10 more)

### Community 16 - "wbs.py"
Cohesion: 0.05
Nodes (71): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+63 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.06
Nodes (57): STATUSES, TasksPage(), ViewMode, DeletePhaseDialog(), Editor, EntityEditor(), statusOptions(), ConfirmDialog() (+49 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "users.py"
Cohesion: 0.09
Nodes (44): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+36 more)

### Community 20 - "NotificationService"
Cohesion: 0.16
Nodes (16): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse, get_notification_service(), NotificationService (+8 more)

### Community 21 - "formatDate"
Cohesion: 0.05
Nodes (52): Danh mục tính năng đã triển khai, ProjectOverviewCharts, KanbanColumn(), SprintView(), TaskCard(), TaskTable(), MiniProgressBar(), MiniProgressBarProps (+44 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.20
Nodes (20): hash_password(), verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize (+12 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "ws/chat.py"
Cohesion: 0.13
Nodes (21): asyncio, chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized() (+13 more)

### Community 25 - "test_route_exposure.py"
Cohesion: 0.15
Nodes (15): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+7 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.05
Nodes (69): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReportResponse, BaseModel, AITaskType (+61 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.14
Nodes (10): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về… (+2 more)

### Community 29 - "run_impact_analysis"
Cohesion: 0.24
Nodes (20): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+12 more)

### Community 30 - "auth_service.py"
Cohesion: 0.10
Nodes (33): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+25 more)

### Community 31 - "typing"
Cohesion: 0.05
Nodes (44): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session. (+36 more)

### Community 32 - "TaskService"
Cohesion: 0.13
Nodes (14): str, SubtaskStatus, TaskPriority, TaskDetailResponse, TaskResponse, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, AsyncSession, date (+6 more)

### Community 33 - "lucide-react"
Cohesion: 0.12
Nodes (19): AdminLayout(), TABS, DashboardLayout(), FullPageSpinner(), Brand(), LanguageToggle(), LINKS, MainNav() (+11 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "DashboardService"
Cohesion: 0.05
Nodes (60): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+52 more)

### Community 37 - "schemas/task.py"
Cohesion: 0.08
Nodes (42): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+34 more)

### Community 38 - "fixture"
Cohesion: 0.14
Nodes (18): AsyncClient, as_user(), factory(), client(), override_db(), _disable_rate_limiting(), event_loop(), make_user() (+10 more)

### Community 39 - "roles.py"
Cohesion: 0.15
Nodes (25): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+17 more)

### Community 40 - "AIService"
Cohesion: 0.23
Nodes (14): AIJobResponse, AIService, AsyncSession, Tao AIRequest + xep hang Celery task — dung chung cho ca 4 loai phan tich AI o…, ai_request(), db(), asyncio, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng… (+6 more)

### Community 41 - "project_service.py"
Cohesion: 0.32
Nodes (14): add_project_member(), AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberRoleUpdate (+6 more)

### Community 42 - "BadRequestException"
Cohesion: 0.11
Nodes (13): BadRequestException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, Any (+5 more)

### Community 43 - "types"
Cohesion: 0.53
Nodes (5): build_db(), asyncio, test_list_maps_rows_with_actor(), test_list_returns_empty_page(), types

### Community 44 - "test_auth_email_verification.py"
Cohesion: 0.22
Nodes (16): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+8 more)

### Community 45 - "get_redis"
Cohesion: 0.15
Nodes (18): get_redis(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, revoke(), _ttl_seconds(), _pending_key() (+10 more)

### Community 46 - "ProjectService"
Cohesion: 0.20
Nodes (6): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, Depends, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…

### Community 47 - "AdminUserService"
Cohesion: 0.32
Nodes (23): AdminUserUpdate, AdminUserService, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành…, Ngay cả một Admin đầy đủ cũng không được viết lại tập role của chính mình — đó… (+15 more)

### Community 48 - "list_projects"
Cohesion: 0.19
Nodes (19): change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser, CurrentVerifiedUser (+11 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.17
Nodes (23): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+15 more)

### Community 50 - "api.ts"
Cohesion: 0.05
Nodes (64): Danh mục tính năng đã triển khai, GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), AuthLayout(), OAuthCallbackContent(), OAuthCallbackPage(), VerificationState, VerifyEmailContent(), verify() (+56 more)

### Community 51 - "endpoints/ai.py"
Cohesion: 0.09
Nodes (35): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+27 more)

### Community 52 - "Task"
Cohesion: 0.12
Nodes (19): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.20
Nodes (21): ChangePasswordRequest, OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó. (+13 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ChangeRequestDetail.tsx"
Cohesion: 0.15
Nodes (19): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useCreateChangeRequest(), useImpactAnalysisJob() (+11 more)

### Community 57 - "Project"
Cohesion: 0.09
Nodes (33): Project, Worklog, datetime, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service() (+25 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "AIResponseError"
Cohesion: 0.16
Nodes (17): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Model trả về thứ mà ta sẽ không hành động theo., Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và…, Parse một response của model mà lẽ ra phải là một JSON object duy nhất. Chấp…, parametrize (+9 more)

### Community 60 - "RoleService"
Cohesion: 0.30
Nodes (13): AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name() (+5 more)

### Community 61 - "System Architecture Design"
Cohesion: 0.14
Nodes (14): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+6 more)

### Community 62 - "sweep_task_dates"
Cohesion: 0.20
Nodes (10): AsyncSession, task, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), asyncio (+2 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (21): 10. API Specification & WebSocket Endpoints, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án, 6. Database Schema (8 Domains & 34 Tables) (+13 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (16): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+8 more)

### Community 65 - "ProjectCreate"
Cohesion: 0.17
Nodes (8): create_project(), Depends, ProjectCreate, ProjectUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, test_portfolio_and_project_schema_validation()

### Community 66 - "env.py"
Cohesion: 0.10
Nodes (19): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+11 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.18
Nodes (16): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+8 more)

### Community 68 - "useNotifications.ts"
Cohesion: 0.06
Nodes (42): Admin / RBAC Feature (100% Complete), Findings, Frontend Architecture & Quality, Real-Time Project Chat & WebSocket Notification (100% Complete), 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001) (+34 more)

### Community 69 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (12): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+4 more)

### Community 71 - "PaginatedResponse"
Cohesion: 0.16
Nodes (12): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+4 more)

### Community 72 - "Software Requirements Specification (SRS)"
Cohesion: 0.15
Nodes (13): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+5 more)

### Community 73 - "ForbiddenException"
Cohesion: 0.11
Nodes (17): get_current_verified_user(), Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, require_roles(), role_checker(), ForbiddenException, get_task_context(), json_value() (+9 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 78 - "ChatService"
Cohesion: 0.19
Nodes (18): ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án., ChatService, AsyncSession (+10 more)

### Community 79 - "config.py"
Cohesion: 0.22
Nodes (11): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+3 more)

### Community 80 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "UserRepository"
Cohesion: 0.15
Nodes (3): AsyncSession, UserRepository, AsyncSession

### Community 82 - "AuditService"
Cohesion: 0.12
Nodes (17): AuditService, get_audit_service(), AsyncSession, datetime, Depends, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001), 5 Trụ cột chính: (+9 more)

### Community 83 - "approvals.py"
Cohesion: 0.17
Nodes (12): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (32): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), CRStatus (+24 more)

### Community 85 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 86 - "documents.py"
Cohesion: 0.18
Nodes (11): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.18
Nodes (11): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 88 - "leaves.py"
Cohesion: 0.17
Nodes (12): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 89 - "project_versions.py"
Cohesion: 0.18
Nodes (11): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (12): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 91 - "skills.py"
Cohesion: 0.17
Nodes (12): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 92 - "system.py"
Cohesion: 0.18
Nodes (11): create_system(), delete_system(), get_system(), list_system(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 93 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.13
Nodes (7): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, date

### Community 95 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 96 - "Business Requirements Document (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Business Objectives), 1. Tổng quan dự án (Project Overview), 2.1 Các tính năng trong phạm vi (In-Scope), 2.2 Ngoài phạm vi (Out-of-Scope), 2. Phạm vi dự án (Project Scope), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), AI Project Planning & Portfolio Management System (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (11): asyncio, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified() (+3 more)

### Community 98 - "pytest"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "FastAPI"
Cohesion: 0.08
Nodes (29): CurrentUser, date, get, ResourceServiceDep, resource_leveling(), set_request_id(), close_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ… (+21 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (9): BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song), Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Risk Analysis (SOP-AI-005) — song song, sau Task 1 (+1 more)

### Community 102 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 103 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (10): asyncio, fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown() (+2 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "useAIGenerator.ts"
Cohesion: 0.09
Nodes (22): Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, AIGeneratorModal(), mocks, aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject(), ResourceRecommendationPanel() (+14 more)

### Community 106 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "test_phase2_task_wbs.py"
Cohesion: 0.24
Nodes (9): GanttResponse, GanttTask, BaseModel, asyncio, test_cascade_phase_delete_records_snapshot_and_recalculates(), test_invalid_task_status_transition_is_rejected(), test_status_graph_supports_normal_block_and_reopen_flows(), test_stop_timer_calculates_hours_and_updates_task_total() (+1 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "get_chat_history"
Cohesion: 0.19
Nodes (13): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+5 more)

### Community 111 - "NotificationType"
Cohesion: 0.27
Nodes (15): NotificationType, str, TaskStatusUpdate, TaskUpdate, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ… (+7 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 116 - "sanitize.py"
Cohesion: 0.40
Nodes (4): Làm sạch nội dung do người dùng nhập trước khi lưu. Tin nhắn chat trước đây…, Chuẩn hoá một tin nhắn chat do người dùng gửi. Cố tình KHÔNG escape HTML: nội…, sanitize_message(), re

### Community 117 - "BurndownChart.tsx"
Cohesion: 0.60
Nodes (4): BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 125 - "publish"
Cohesion: 0.15
Nodes (13): publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Task nền chạy dài (được khởi động trong lifespan của FastAPI): subscribe mọi…, redis_listener(), ChatReadState (+5 more)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "NotFoundException"
Cohesion: 0.16
Nodes (6): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, ConflictException, NotFoundException, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, is_admin()

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "run_risk_analysis"
Cohesion: 0.19
Nodes (23): str, RiskLevel, _as_list(), _clamp_score(), _level_from_score(), _normalize_level(), Any, Model đôi khi trả một chuỗi thay vì list (vd mitigation_suggestions là một đoạn… (+15 more)

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 157 - "_persist_plan"
Cohesion: 0.25
Nodes (10): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, TaskServiceDep (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "rate_limit.py"
Cohesion: 0.16
Nodes (15): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+7 more)

### Community 160 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 161 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 163 - "validate_password_policy"
Cohesion: 0.50
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 164 - "utils/cpm.py"
Cohesion: 0.10
Nodes (43): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+35 more)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.11
Nodes (23): issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis (+15 more)

### Community 168 - "user_service.py"
Cohesion: 0.09
Nodes (19): update_documents(), update_gantt(), update_project_versions(), update_system(), get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, _put() (+11 more)

## Knowledge Gaps
- **329 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+324 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1102 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatDate` to `TaskService`, `react`, `DashboardService`, `useNotifications.ts`, `portfolio_service.py`, `ForbiddenException`, `projects/page.tsx`, `ChatService`, `NotificationType`, `ProjectService`, `User`, `api.ts`, `portfolios/[id]/page.tsx`, `NotificationService`, `tasks/page.tsx`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `risk_analyzer.py`, `NotFoundException`, `users.py`, `ws/chat.py`, `ai_tasks.py`, `AuthService`, `auth_service.py`, `typing`, `TaskService`, `DashboardService`, `fixture`, `roles.py`, `AIService`, `project_service.py`, `BadRequestException`, `user_service.py`, `test_auth_email_verification.py`, `ProjectService`, `AdminUserService`, `endpoints/ai.py`, `Project`, `RoleService`, `ProjectCreate`, `env.py`, `PaginatedResponse`, `ForbiddenException`, `ChatService`, `UserRepository`, `test_change_request_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `get_current_active_superuser`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `api.ts` to `react`, `Chi tiết các Giai đoạn đã hoàn thành`, `users/page.tsx`, `BadRequestException`, `RoleService`, `AuditService`, `test_auth_password_recovery.py`, `AuthService`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 41 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _329 weakly-connected nodes found - possible documentation gaps or missing edges._