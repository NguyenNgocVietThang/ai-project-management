# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-17)

## Corpus Check
- 434 files · ~157,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3472 nodes · 9415 edges · 189 communities (142 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 745 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `baea9423`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- ProjectWizard.tsx
- db/base.py
- refresh_token
- api.ts
- generate_resource_recommendation
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- useProjects.ts
- oauth.py
- get_redis
- FastAPI
- AITaskType
- portfolios/page.tsx
- User
- wbs_service.py
- useTasks.ts
- react
- users.py
- NotificationService
- getApiErrorMessage
- test_auth_password_recovery.py
- hash_password
- dashboard.types.ts
- user_service.py
- ai_tasks.py
- compilerOptions
- milestones.py
- AdminUserService
- auth_service.py
- endpoints/ai.py
- task_service.py
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- tasks.py
- config.py
- list_roles
- AuthService
- project_service.py
- OAuthService
- audit_service.py
- timedelta
- conftest.py
- ProjectService
- vitest
- list_projects
- test_schedule_optimizer.py
- ChatPanel.tsx
- validate_password_policy
- test_schema_and_query_shape.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- ChangeRequestDetail.tsx
- test_audit_regressions.py
- ConnectionManager
- RoleService
- UserRepository
- get_db
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- wrap_user_input
- logging_config.py
- ResourceServiceDep
- useNotifications.ts
- TaskStatus
- Rà soát code và nâng cấp giao diện — 2026-09-15
- endpoints/auth.py
- System Architecture Design
- ResourceService
- AuditLog
- test_resource_warnings.py
- BurndownChart.tsx
- AGENTS.md
- get_chat_history
- notification_tasks.py
- test_token_revocation.py
- my_assignments
- Software Requirements Specification (SRS)
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
- Chi tiết các Giai đoạn đã hoàn thành
- ProjectRepository
- list_notifications
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- capture_client_ip
- 3. Yêu cầu chức năng (Functional Requirements)
- oauth_service.py
- Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- scripts
- Chi tiết kế hoạch triển khai
- admin.py
- middleware.ts
- schemas/gantt.py
- Chi tiết các Giai đoạn
- Chi tiết các Giai đoạn
- chat_service.py
- playwright
- .eslintrc.json
- publish
- next-env.d.ts
- scheduling_tasks.py
- Findings
- 11. Cài đặt và Chạy hệ thống
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- run_impact_analysis
- 3. Technology Stack
- run_risk_analysis
- test_notification_triggers.py
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- test_resource_recommender.py
- useAIGenerator.ts
- rate_limit.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- scheduling_service.py
- CLAUDE.md
- providers.tsx
- ValueError
- Role
- AIService
- ForbiddenException
- StorageService
- forgot-password/page.tsx
- ._queue
- get_ai_service
- resource_leveling
- get_admin_user_service
- get_ai_job
- ApprovalStatus
- CRStatus
- DocumentType
- EmailStatus
- RiskLevel
- LeaveType
- RiskLevel
- AIJobResponse
- AIResultResponse
- model_validator
- ChangeRequest
- ImpactReport
- RiskReport

## God Nodes (most connected - your core abstractions)
1. `User` - 199 edges
2. `ForbiddenException` - 75 edges
3. `WBSService` - 69 edges
4. `Base` - 68 edges
5. `TaskService` - 67 edges
6. `BadRequestException` - 60 edges
7. `getApiErrorMessage()` - 60 edges
8. `NotFoundException` - 59 edges
9. `react` - 58 edges
10. `lucide-react` - 56 edges

## Surprising Connections (you probably didn't know these)
- `run_risk_analysis()` --calls--> `RiskReport`  [EXTRACTED]
  backend/app/services/ai/risk_analyzer.py → frontend/src/types/risk-report.types.ts
- `run_impact_analysis()` --calls--> `ImpactReport`  [EXTRACTED]
  backend/app/services/ai/impact_analyzer.py → frontend/src/types/change-request.types.ts
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `AIService` --uses--> `AIJobResponse`  [INFERRED]
  backend/app/services/ai_service.py → backend/app/schemas/ai.py

## Import Cycles
- None detected.

## Communities (189 total, 17 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "ProjectWizard.tsx"
Cohesion: 0.08
Nodes (38): LoginPageProps, metadata, Input, InputProps, Label, getPasswordStrength(), passwordSchema, ForgotPasswordFormValues (+30 more)

### Community 2 - "db/base.py"
Cohesion: 0.11
Nodes (17): AIOutput, Approval, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest, Comment, Document (+9 more)

### Community 3 - "refresh_token"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "api.ts"
Cohesion: 0.05
Nodes (64): AuthLayout(), OAuthCallbackContent(), VerificationState, AdminLayout(), TABS, DashboardLayout(), ProfilePageContent(), FullPageSpinner() (+56 more)

### Community 5 - "generate_resource_recommendation"
Cohesion: 0.20
Nodes (16): _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, AsyncSession, Task (+8 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.10
Nodes (21): Portfolio, PortfolioStatus, str, PortfolioRepository, AsyncSession, datetime, PortfolioBase, PortfolioCapabilities (+13 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (51): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+43 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.11
Nodes (22): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+14 more)

### Community 9 - "useProjects.ts"
Cohesion: 0.11
Nodes (30): ProjectsPage(), InviteMemberDialog(), InitialProjectMember, ProjectWizard(), useAssignableRoles(), useUserSearch(), projectKeys, useCreateProject() (+22 more)

### Community 10 - "oauth.py"
Cohesion: 0.27
Nodes (17): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+9 more)

### Community 11 - "get_redis"
Cohesion: 0.16
Nodes (17): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), close_redis(), get_redis() (+9 more)

### Community 12 - "FastAPI"
Cohesion: 0.10
Nodes (37): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+29 more)

### Community 13 - "AITaskType"
Cohesion: 0.10
Nodes (23): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+15 more)

### Community 14 - "portfolios/page.tsx"
Cohesion: 0.14
Nodes (26): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), PortfolioCard(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, PortfolioList() (+18 more)

### Community 15 - "User"
Cohesion: 0.12
Nodes (12): User, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, add_audit(), get_project_context(), is_admin(), AsyncSession, require_project_roles() (+4 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.05
Nodes (74): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+66 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "react"
Cohesion: 0.08
Nodes (38): MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps, VARIANT_CLASSES, Avatar(), AvatarProps, Button (+30 more)

### Community 19 - "users.py"
Cohesion: 0.06
Nodes (61): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+53 more)

### Community 20 - "NotificationService"
Cohesion: 0.16
Nodes (18): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, NotificationType, str, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse (+10 more)

### Community 21 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (78): VerifyEmailContent(), verify(), AdminAuditPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectMembersPage() (+70 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.23
Nodes (18): ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+10 more)

### Community 23 - "hash_password"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (33): DashboardPage(), ProjectOverviewCharts, ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard(), STATUS_BADGE, MyTasksList(), MyTasksListProps (+25 more)

### Community 25 - "user_service.py"
Cohesion: 0.08
Nodes (30): ServiceUnavailableException, UnauthorizedException, Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel (+22 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.10
Nodes (30): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, SOP-AI-001: Điều phối vòng đời AIRequest cho tính năng sinh dự án bằng AI.…, generate_project_task(), _generate_with_own_session() (+22 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 29 - "AdminUserService"
Cohesion: 0.31
Nodes (24): AdminUserCreate, AdminUserUpdate, AdminUserService, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 30 - "auth_service.py"
Cohesion: 0.13
Nodes (25): create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết…, _utcnow(), is_revoked() (+17 more)

### Community 31 - "endpoints/ai.py"
Cohesion: 0.17
Nodes (24): AIServiceDep, generate_project(), CurrentVerifiedUser, Depends, post, User, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.…, SOP-AI-002: Xếp hàng phân tích tác động cho một change request đã có. (+16 more)

### Community 32 - "task_service.py"
Cohesion: 0.09
Nodes (31): BadRequestException, Assignment, DependencyType, str, TaskPriority, IDResponse, PaginatedResponse, BaseModel (+23 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (36): authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên…, Phân giải một vé handshake thành một User đang active. Dùng session DB riêng,…, Watchdog: đóng `websocket` khi nó không còn được phép mở. Chạy song song với…, _redeem() (+28 more)

### Community 34 - "as_user"
Cohesion: 0.12
Nodes (29): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+21 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, config, autoprefixer (+21 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 37 - "tasks.py"
Cohesion: 0.16
Nodes (23): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+15 more)

### Community 38 - "config.py"
Cohesion: 0.24
Nodes (10): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+2 more)

### Community 39 - "list_roles"
Cohesion: 0.16
Nodes (16): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+8 more)

### Community 40 - "AuthService"
Cohesion: 0.13
Nodes (11): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+3 more)

### Community 41 - "project_service.py"
Cohesion: 0.14
Nodes (26): change_project_member_role(), patch, put, Doi vai tro cua mot thanh vien du an ma khong lam mat lich su tham gia., update_project(), ProjectMethodology, ProjectStatus, str (+18 more)

### Community 42 - "OAuthService"
Cohesion: 0.16
Nodes (10): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService, Any, AsyncSession, Depends, User (+2 more)

### Community 43 - "audit_service.py"
Cohesion: 0.22
Nodes (12): AuditLogResponse, AuditService, get_audit_service(), AsyncSession, datetime, Depends, PaginatedResponse, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm. (+4 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "conftest.py"
Cohesion: 0.20
Nodes (14): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+6 more)

### Community 46 - "ProjectService"
Cohesion: 0.15
Nodes (10): Project, ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, date, Depends, Project (+2 more)

### Community 47 - "vitest"
Cohesion: 0.29
Nodes (4): mocks, @testing-library/react, @testing-library/user-event, vitest

### Community 48 - "list_projects"
Cohesion: 0.18
Nodes (19): add_project_member(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser (+11 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.15
Nodes (29): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, XkiroProvider (+21 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (22): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+14 more)

### Community 51 - "validate_password_policy"
Cohesion: 0.40
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 52 - "test_schema_and_query_shape.py"
Cohesion: 0.10
Nodes (21): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Epic, Milestone, Phase, Sprint, Subtask, _index_names() (+13 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.27
Nodes (21): verify_password(), OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó. (+13 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ChangeRequestDetail.tsx"
Cohesion: 0.16
Nodes (19): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useImpactAnalysisJob(), useRunImpactAnalysis() (+11 more)

### Community 57 - "test_audit_regressions.py"
Cohesion: 0.15
Nodes (21): AIRequest, Dependency, Worklog, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., project_work() (+13 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "RoleService"
Cohesion: 0.37
Nodes (14): RoleCreate, RoleUpdate, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio (+6 more)

### Community 60 - "UserRepository"
Cohesion: 0.11
Nodes (12): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+4 more)

### Community 61 - "get_db"
Cohesion: 0.16
Nodes (12): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session. (+4 more)

### Community 62 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.23
Nodes (11): apply(), systemPrefersDark(), Status(), ThemeContext, ThemeContextValue, themeInitScript, ThemePreference, ThemeProvider() (+3 more)

### Community 65 - "wrap_user_input"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 66 - "logging_config.py"
Cohesion: 0.15
Nodes (13): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+5 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.16
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "useNotifications.ts"
Cohesion: 0.19
Nodes (19): NotificationsPage(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS, useDeleteNotification() (+11 more)

### Community 69 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 70 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 71 - "endpoints/auth.py"
Cohesion: 0.31
Nodes (12): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+4 more)

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 73 - "ResourceService"
Cohesion: 0.10
Nodes (16): Assignment, set_current_project_id(), Task, AsyncSession, TaskRepository, get_resource_service(), AsyncSession, date (+8 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (16): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy… (+8 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 78 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 79 - "notification_tasks.py"
Cohesion: 0.23
Nodes (11): AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session() (+3 more)

### Community 80 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 81 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 82 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "ChangeRequestService"
Cohesion: 0.12
Nodes (32): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+24 more)

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

### Community 93 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.09
Nodes (9): BaseRepository, Any, AsyncSession, ProjectRepository, AsyncSession, date, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+1 more)

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
Cohesion: 0.20
Nodes (12): Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), attach_request_id(), capture_client_ip(), Request, Gắn một id cho mỗi request và trả nó lại trong response. Nếu không có nó, không… (+4 more)

### Community 101 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 102 - "oauth_service.py"
Cohesion: 0.19
Nodes (13): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Key Redis cho một luồng, dẫn xuất từ CẢ state lẫn bí mật trong cookie. Ràng… (+5 more)

### Community 103 - "Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Checkpoint: 4 trụ cột backend/frontend cô lập xong, Checkpoint: Tích hợp hoàn chỉnh, Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "admin.py"
Cohesion: 0.23
Nodes (10): AdminUserResponse, AuditActorSummary, PermissionResponse, BaseModel, Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log., Chỉ đủ để đổ vào một bộ chọn vai trò dự án. Cố tình bỏ `permissions`:…, RoleDetailResponse, RoleOptionResponse (+2 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 109 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 110 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 111 - "chat_service.py"
Cohesion: 0.10
Nodes (33): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatHistoryResponse (+25 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 125 - "publish"
Cohesion: 0.18
Nodes (9): publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, get_notification_service(), AsyncSession, Depends (+1 more)

### Community 145 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (8): _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 146 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 149 - "run_impact_analysis"
Cohesion: 0.13
Nodes (32): _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession, Dependency, Project, Task (+24 more)

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "run_risk_analysis"
Cohesion: 0.12
Nodes (34): _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+26 more)

### Community 152 - "test_notification_triggers.py"
Cohesion: 0.38
Nodes (10): notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged(), test_notify_project_team_excludes_given_users(), test_notify_project_team_with_no_exclusions_notifies_everyone() (+2 more)

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
Cohesion: 0.20
Nodes (13): ResourceRecommendationPanel(), IN_PROGRESS, resourceRecommendationJobKeys, useRequestResourceRecommendation(), useResourceRecommendationJob(), ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService (+5 more)

### Community 157 - "test_resource_recommender.py"
Cohesion: 0.45
Nodes (10): _candidate(), asyncio, SOP-AI-004: goi y nhan su phai loc bo user_id AI bia ra va chuan hoa…, _task(), test_fit_score_outside_range_is_clamped(), test_ranks_are_renumbered_contiguously_after_filtering(), test_run_resource_recommendation_merges_raw_stats_into_result(), test_run_resource_recommendation_merges_stats_and_raises_when_task_missing() (+2 more)

### Community 158 - "useAIGenerator.ts"
Cohesion: 0.14
Nodes (15): aiJobKeys, IN_PROGRESS, IN_PROGRESS, scheduleOptimizationJobKeys, aiService, scheduleOptimizationService, AIJobResponse, AIJobStatus (+7 more)

### Community 159 - "rate_limit.py"
Cohesion: 0.25
Nodes (10): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+2 more)

### Community 160 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song), Task 1: Change Request CRUD tối giản, Task 2: AI Impact Analysis (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Risk Analysis (SOP-AI-005) — song song, sau Task 1 (+2 more)

### Community 161 - "scheduling_service.py"
Cohesion: 0.17
Nodes (14): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ… (+6 more)

### Community 163 - "providers.tsx"
Cohesion: 0.25
Nodes (6): metadata, viewport, Providers(), ThemedToaster(), notifyError(), sonner

### Community 164 - "ValueError"
Cohesion: 0.05
Nodes (57): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator (+49 more)

### Community 165 - "Role"
Cohesion: 0.24
Nodes (4): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Role

### Community 166 - "AIService"
Cohesion: 0.33
Nodes (14): AIRequestStatus, AIRequestType, str, AIService, ai_request(), db(), asyncio, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng… (+6 more)

### Community 167 - "ForbiddenException"
Cohesion: 0.08
Nodes (19): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,… (+11 more)

### Community 168 - "StorageService"
Cohesion: 0.24
Nodes (4): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, Minio

### Community 169 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 170 - "._queue"
Cohesion: 0.39
Nodes (3): AIRequestType, User, Tao AIRequest + xep hang Celery task — dung chung cho ca 4 loai phan tich AI o…

### Community 171 - "get_ai_service"
Cohesion: 0.40
Nodes (4): get_ai_service(), AsyncSession, Depends, get_db

### Community 172 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 173 - "get_admin_user_service"
Cohesion: 0.50
Nodes (3): get_admin_user_service(), AsyncSession, Depends

### Community 174 - "get_ai_job"
Cohesion: 0.67
Nodes (3): get_ai_job(), CurrentUser, get

## Knowledge Gaps
- **375 isolated node(s):** `5 Trụ cột AI chính:`, `Hiện trạng & Hạ tầng sẵn có`, `Danh mục tính năng triển khai theo Phase`, `GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure`, `GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001)` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1171 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ChangeRequest` connect `ChangeRequestDetail.tsx` to `react`, `ForbiddenException`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `portfolio_service.py`, `FastAPI`, `User`, `users.py`, `NotificationService`, `user_service.py`, `AdminUserService`, `auth_service.py`, `task_service.py`, `dashboard_service.py`, `AIService`, `list_roles`, `AuthService`, `project_service.py`, `ProjectService`, `RoleService`, `UserRepository`, `get_db`, `ResourceService`, `chat_service.py`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `FastAPI`, `wbs_service.py`, `users.py`, `user_service.py`, `AdminUserService`, `auth_service.py`, `task_service.py`, `test_ws_hardening.py`, `scheduling_service.py`, `as_user`, `dashboard_service.py`, `Role`, `ForbiddenException`, `AuthService`, `project_service.py`, `OAuthService`, `timedelta`, `conftest.py`, `ProjectService`, `list_projects`, `test_audit_regressions.py`, `RoleService`, `UserRepository`, `get_db`, `ResourceService`, `ProjectRepository`, `test_oauth_account_takeover.py`, `oauth_service.py`, `chat_service.py`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `User` (e.g. with `list_audit_logs()` and `list_permissions()`) actually correct?**
  _`User` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 39 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 39 INFERRED edges - model-reasoned connections that need verification._
- **What connects `5 Trụ cột AI chính:`, `Hiện trạng & Hạ tầng sẵn có`, `Danh mục tính năng triển khai theo Phase` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._