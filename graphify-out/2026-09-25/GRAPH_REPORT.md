# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-24)

## Corpus Check
- 433 files · ~235,944 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3528 nodes · 10276 edges · 168 communities (143 shown, 10 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24a8ef0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vitest
- Button.tsx
- db/base.py
- refresh_token
- getApiErrorMessage
- list_roles
- PortfolioService
- users/page.tsx
- email_tasks.py
- projects/page.tsx
- ws/chat.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- ai_tasks.py
- portfolios/[id]/page.tsx
- WBSService
- milestones.py
- useTasks.ts
- cn
- require_permissions
- endpoints/notifications.py
- formatDate
- RoleService
- test_login_lockout.py
- ChangeRequestDetail.tsx
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- security.py
- run_impact_analysis
- wbs_service.py
- AuthService
- User
- react
- as_user
- package.json
- TaskServiceDep
- task_service.py
- Task
- AdminUserService
- AIService
- typing
- OAuthService
- risk_analyzer.py
- timedelta
- main.py
- schemas/project.py
- test_route_exposure.py
- projects.py
- get_redis
- api.ts
- PortfolioRepository
- test_schema_and_query_shape.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- oauth.py
- WBSServiceDep
- rate_limit.py
- test_auth_cookies.py
- BadRequestException
- Thiết kế kiến trúc hệ thống
- TaskStatus
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- epics.py
- .update
- worklogs.py
- Chi tiết các Giai đoạn
- test_reported_metrics_are_real.py
- Chi tiết các Giai đoạn đã hoàn thành
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- Role
- AuditLog
- test_resource_warnings.py
- BurndownChart.tsx
- AGENTS.md
- ChatService
- issue
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- UserRepository
- endpoints/auth.py
- approvals.py
- test_change_request_service.py
- env.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- storage_service.py
- ProjectRepository
- WBSServiceDep
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_oauth_account_takeover.py
- create_change_request
- next.config.js
- users.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- authenticate_ws
- middleware.ts
- redis_client.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- token_revocation.py
- DashboardService
- playwright
- alembic
- test_rate_limit.py
- login/page.tsx
- conftest.py
- get_critical_path
- vitest.config.mts
- resource_leveling
- create_dependency
- Chi tiết các Giai đoạn
- get_current_user
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- BaseAIProvider
- chat_ws
- next-env.d.ts
- Kết quả rà soát
- update_subtask
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- AIRequest
- 11. Cài đặt và Chạy hệ thống
- MilestoneUpdate
- get_me
- 1. Tổng quan dự án
- get_resource_service
- get_wbs_service
- ChatReadState
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- ApprovalStatus
- useScheduleOptimization.ts
- DocumentType
- EmailStatus
- LeaveType
- AsyncSession
- test_auth_password_recovery.py
- utils/cpm.py
- 3. Ngăn xếp công nghệ
- test_ws_hardening.py
- UserService

## God Nodes (most connected - your core abstractions)
1. `User` - 220 edges
2. `ForbiddenException` - 82 edges
3. `WBSService` - 70 edges
4. `NotFoundException` - 68 edges
5. `Base` - 68 edges
6. `TaskService` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py

## Import Cycles
- None detected.

## Communities (168 total, 10 thin omitted)

### Community 0 - "vitest"
Cohesion: 0.14
Nodes (6): mocks, FakeSocket, ref_testing_library_jest_dom_vitest, @testing-library/react, @testing-library/user-event, vitest

### Community 1 - "Button.tsx"
Cohesion: 0.09
Nodes (49): Alert(), AlertProps, VARIANT_CLASSES, Button, ButtonProps, VARIANT_CLASSES, Input, InputProps (+41 more)

### Community 2 - "db/base.py"
Cohesion: 0.15
Nodes (15): Approval, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment, Document, EmailLog, ImpactReport, Notification (+7 more)

### Community 3 - "refresh_token"
Cohesion: 0.14
Nodes (30): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), login(), logout(), Depends, limit (+22 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (62): VerifyEmailContent(), verify(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectSettingsPage(), KanbanColumn() (+54 more)

### Community 5 - "list_roles"
Cohesion: 0.16
Nodes (16): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+8 more)

### Community 6 - "PortfolioService"
Cohesion: 0.17
Nodes (11): PortfolioStatus, str, PortfolioBase, PortfolioCreate, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate, BaseModel (+3 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (57): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys (+49 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.09
Nodes (26): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+18 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.12
Nodes (33): ProjectMembersPage(), ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, useAIJob(), useGenerateProject(), InviteMemberDialog(), InitialProjectMember (+25 more)

### Community 10 - "ws/chat.py"
Cohesion: 0.07
Nodes (27): Gom tất cả các WebSocket router (chat, notifications, ...) được mount tại gốc…, code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt… (+19 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.09
Nodes (31): ImpactReportResponse, BaseModel, BaseModel, RiskReportResponse, generate_project_task(), _generate_with_own_session(), impact_analysis_task(), _impact_analysis_with_own_session() (+23 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+16 more)

### Community 15 - "WBSService"
Cohesion: 0.12
Nodes (11): EpicStatus, str, PhaseStatus, str, str, SprintStatus, require_project_roles(), WBSService (+3 more)

### Community 16 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (38): DeletePhaseDialog(), taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, usePhaseImpact(), wbsKeys, taskService (+30 more)

### Community 18 - "cn"
Cohesion: 0.10
Nodes (29): MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, Spinner(), ResourceRecommendationPanel(), ResourceRecommendationPanelProps, useRequestResourceRecommendation() (+21 more)

### Community 19 - "require_permissions"
Cohesion: 0.05
Nodes (60): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+52 more)

### Community 20 - "endpoints/notifications.py"
Cohesion: 0.09
Nodes (27): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+19 more)

### Community 21 - "formatDate"
Cohesion: 0.07
Nodes (45): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), TaskTable(), ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard(), STATUS_BADGE (+37 more)

### Community 22 - "RoleService"
Cohesion: 0.48
Nodes (13): RoleUpdate, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name() (+5 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (24): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+16 more)

### Community 24 - "ChangeRequestDetail.tsx"
Cohesion: 0.16
Nodes (18): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useImpactAnalysisJob(), useRunImpactAnalysis() (+10 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "security.py"
Cohesion: 0.12
Nodes (33): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+25 more)

### Community 29 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.22
Nodes (20): TaskCapabilities, TaskResponse, DateRangeMixin, EpicResponse, MilestoneCreate, MilestoneResponse, PhaseCreate, PhaseDeleteImpact (+12 more)

### Community 31 - "AuthService"
Cohesion: 0.14
Nodes (9): hash_password(), AuthService, datetime, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đổi một refresh token lấy một cặp token mới, xoay vòng token cũ ra. Mỗi refresh…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+1 more)

### Community 32 - "User"
Cohesion: 0.06
Nodes (47): AIResultResponse, Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException, ForbiddenException (+39 more)

### Community 33 - "react"
Cohesion: 0.07
Nodes (37): VerificationState, AdminLayout(), TABS, NotificationsPage(), FullPageSpinner(), Brand(), LanguageToggle(), LINKS (+29 more)

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (27): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+19 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (30): description, name, overrides, postcss, private, version, config, autoprefixer (+22 more)

### Community 36 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 37 - "task_service.py"
Cohesion: 0.12
Nodes (32): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate (+24 more)

### Community 38 - "Task"
Cohesion: 0.07
Nodes (44): Dependency, Project, Task, Worklog, AsyncSession, TaskRepository, CPMResponse, CPMTask (+36 more)

### Community 39 - "AdminUserService"
Cohesion: 0.06
Nodes (49): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), AdminUserCreate, AdminUserUpdate, field_validator (+41 more)

### Community 40 - "AIService"
Cohesion: 0.09
Nodes (44): AIJobResponse, AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get (+36 more)

### Community 41 - "typing"
Cohesion: 0.05
Nodes (64): Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, TooManyRequestsException, get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session., Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., Leave (+56 more)

### Community 42 - "OAuthService"
Cohesion: 0.19
Nodes (8): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, User, Phân giải identity của provider thành một User. `email_provider_verified` là…, Đổi `state` lấy luồng mà nó đại diện, đúng một lần. Trả về `(OAuthState,…

### Community 43 - "risk_analyzer.py"
Cohesion: 0.05
Nodes (76): str, RiskLevel, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được… (+68 more)

### Community 44 - "timedelta"
Cohesion: 0.16
Nodes (23): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+15 more)

### Community 45 - "main.py"
Cohesion: 0.14
Nodes (19): set_request_id(), Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), attach_request_id(), capture_client_ip(), health_check() (+11 more)

### Community 46 - "schemas/project.py"
Cohesion: 0.16
Nodes (15): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate (+7 more)

### Community 47 - "test_route_exposure.py"
Cohesion: 0.14
Nodes (16): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+8 more)

### Community 48 - "projects.py"
Cohesion: 0.16
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "get_redis"
Cohesion: 0.18
Nodes (15): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), get_redis(), _pending_key() (+7 more)

### Community 50 - "api.ts"
Cohesion: 0.05
Nodes (63): AuthLayout(), OAuthCallbackContent(), DashboardLayout(), ProfilePageContent(), EmailVerificationBanner(), EmailVerificationBannerProps, ChatMessageItem(), Props (+55 more)

### Community 51 - "PortfolioRepository"
Cohesion: 0.24
Nodes (3): PortfolioRepository, AsyncSession, AsyncSession

### Community 52 - "test_schema_and_query_shape.py"
Cohesion: 0.10
Nodes (21): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Epic, Milestone, Phase, Sprint, Subtask, _index_names() (+13 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.28
Nodes (20): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_upload_checks_size_and_replaces_previous_object() (+12 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "oauth.py"
Cohesion: 0.32
Nodes (15): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+7 more)

### Community 57 - "WBSServiceDep"
Cohesion: 0.23
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 58 - "rate_limit.py"
Cohesion: 0.16
Nodes (15): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+7 more)

### Community 59 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 60 - "BadRequestException"
Cohesion: 0.16
Nodes (13): BadRequestException, ProjectDetailResponse, ProjectMemberResponse, ProjectResponse, ProjectSummaryResponse, get_project_service(), ProjectService, AsyncSession (+5 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "TaskStatus"
Cohesion: 0.08
Nodes (45): NotificationType, str, str, TaskStatus, get_notification_service(), NotificationService, AsyncSession, Depends (+37 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (16): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+8 more)

### Community 65 - "epics.py"
Cohesion: 0.24
Nodes (14): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+6 more)

### Community 66 - ".update"
Cohesion: 0.14
Nodes (5): Any, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (19): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+11 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.43
Nodes (14): ProjectMemberCreate, db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden() (+6 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "Role"
Cohesion: 0.20
Nodes (4): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Role

### Community 74 - "AuditLog"
Cohesion: 0.18
Nodes (13): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu. (+5 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 78 - "ChatService"
Cohesion: 0.09
Nodes (39): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+31 more)

### Community 79 - "issue"
Cohesion: 0.17
Nodes (15): issue(), _key(), Any, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis, asyncio (+7 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "UserRepository"
Cohesion: 0.13
Nodes (4): AsyncSession, UserRepository, AsyncSession, AsyncSession

### Community 82 - "endpoints/auth.py"
Cohesion: 0.28
Nodes (13): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+5 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.15
Nodes (25): ChangeRequest, CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService (+17 more)

### Community 85 - "env.py"
Cohesion: 0.13
Nodes (16): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+8 more)

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

### Community 93 - "storage_service.py"
Cohesion: 0.16
Nodes (8): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, io, Minio, minio_error, urllib3, urllib3_util

### Community 94 - "ProjectRepository"
Cohesion: 0.16
Nodes (4): ProjectRepository, AsyncSession, date, datetime

### Community 95 - "WBSServiceDep"
Cohesion: 0.19
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 98 - "create_change_request"
Cohesion: 0.33
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "users.py"
Cohesion: 0.09
Nodes (32): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), AdminUserResponse (+24 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 103 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "authenticate_ws"
Cohesion: 0.22
Nodes (11): authenticate_ws(), Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên…, Phân giải một vé handshake thành một User đang active. Dùng session DB riêng,…, _redeem(), WSAuthError, notifications_ws(), Query, websocket (+3 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "redis_client.py"
Cohesion: 0.22
Nodes (9): close_redis(), get_redis_pubsub(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Client riêng cho `pubsub.listen()` trong ws_manager.py. Không được dùng chung…, Task nền chạy dài (được khởi động trong lifespan của FastAPI): subscribe mọi…, redis_listener(), lifespan(), Redis (+1 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "token_revocation.py"
Cohesion: 0.27
Nodes (9): is_revoked(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke(), _ttl_seconds() (+1 more)

### Community 111 - "DashboardService"
Cohesion: 0.05
Nodes (62): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+54 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 115 - "login/page.tsx"
Cohesion: 0.17
Nodes (6): metadata, LoginPageProps, metadata, metadata, next, ref_next_intl_server

### Community 116 - "conftest.py"
Cohesion: 0.15
Nodes (17): AsyncClient, Permission, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture (+9 more)

### Community 117 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 120 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 121 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 122 - "get_current_user"
Cohesion: 0.29
Nodes (8): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các…, oauth2_scheme

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 125 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 126 - "chat_ws"
Cohesion: 0.29
Nodes (5): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket.

### Community 128 - "Kết quả rà soát"
Cohesion: 0.29
Nodes (6): Chat dự án và thông báo WebSocket thời gian thực (hoàn thành 100%), Các model chính, Kiến trúc phía giao diện và chất lượng, Kiến trúc phía máy chủ (đã xác minh và kiểm thử), Kết quả rà soát, Tính năng quản trị và RBAC (hoàn thành 100%)

### Community 129 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "AIRequest"
Cohesion: 0.33
Nodes (4): AIOutput, AIRequest, Khung chung cho 4 job AI ở dưới (impact/schedule/resource/risk) — cùng vòng đời…, _run_ai_job()

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "MilestoneUpdate"
Cohesion: 0.50
Nodes (3): MilestoneStatus, str, MilestoneUpdate

### Community 149 - "get_me"
Cohesion: 0.50
Nodes (4): get_me(), CurrentUser, get, Lấy thông tin hồ sơ của người dùng hiện đang đăng nhập.

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 151 - "get_resource_service"
Cohesion: 0.50
Nodes (3): get_resource_service(), AsyncSession, Depends

### Community 152 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 154 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 163 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.06
Nodes (72): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+64 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.18
Nodes (8): _close_unauthorized(), enforce_connection_validity(), Watchdog: đóng `websocket` khi nó không còn được phép mở. Chạy song song với…, Ba lỗi ở tầng WebSocket, kiểm tra cùng nhau vì chúng nằm chung một đường. * JWT…, `Depends(get_db)` ở đây giữ một connection suốt vòng đời socket., test_watchdog_closes_the_socket_when_the_account_is_deactivated(), test_websocket_endpoints_do_not_hold_a_pooled_db_session(), inspect

### Community 168 - "UserService"
Cohesion: 0.10
Nodes (11): ServiceUnavailableException, UnauthorizedException, field_validator, UserUpdate, get_user_service(), AsyncSession, Depends, UploadFile (+3 more)

## Knowledge Gaps
- **375 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1189 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `PortfolioService`, `ai_tasks.py`, `WBSService`, `require_permissions`, `MilestoneUpdate`, `RoleService`, `security.py`, `wbs_service.py`, `AuthService`, `as_user`, `task_service.py`, `Task`, `AdminUserService`, `AIService`, `typing`, `OAuthService`, `UserService`, `timedelta`, `projects.py`, `BadRequestException`, `Role`, `ChatService`, `UserRepository`, `test_change_request_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `users.py`, `authenticate_ws`, `DashboardService`, `conftest.py`, `get_current_user`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `ProjectRepository` to `User`, `.update`, `Task`, `typing`, `AuditLog`, `Role`, `schemas/project.py`, `BadRequestException`, `TaskStatus`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `User` to `list_roles`, `PortfolioService`, `ws/chat.py`, `WBSService`, `require_permissions`, `RoleService`, `security.py`, `AuthService`, `task_service.py`, `AdminUserService`, `UserService`, `typing`, `AIService`, `test_route_exposure.py`, `BadRequestException`, `TaskStatus`, `ChatService`, `test_change_request_service.py`, `users.py`, `DashboardService`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._