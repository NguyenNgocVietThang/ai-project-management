# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-22)

## Corpus Check
- 433 files · ~235,804 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3524 nodes · 10270 edges · 153 communities (131 shown, 7 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d43647cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ChatPanel.tsx
- Button.tsx
- db/base.py
- refresh_token
- getApiErrorMessage
- roles.py
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- wbs/page.tsx
- get_redis
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- ai_tasks.py
- portfolios/[id]/page.tsx
- User
- milestones.py
- useTasks.ts
- RiskWidget.tsx
- require_permissions
- list_notifications
- formatDate
- test_admin_roles.py
- test_login_lockout.py
- ChangeRequestDetail.tsx
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- auth_service.py
- run_impact_analysis
- test_token_revocation.py
- list_audit_logs
- ForbiddenException
- react
- as_user
- package.json
- test_resource_recommender.py
- task_service.py
- Project
- AdminUserService
- AIService
- typing
- BadRequestException
- risk_analyzer.py
- timedelta
- main.py
- project_service.py
- list_portfolios
- list_projects
- test_schedule_optimizer.py
- api.ts
- PortfolioRepository
- test_schema_and_query_shape.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- get_chat_history
- sprints.py
- ProjectCreate
- test_auth_cookies.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- pytest
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- ChatService
- is_admin
- ResourceServiceDep
- Chi tiết các Giai đoạn
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- NotFoundException
- AuditLog
- test_resource_warnings.py
- dashboard.types.ts
- AGENTS.md
- chat_service.py
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
- impact_analyzer.py
- ProjectRepository
- WBSServiceDep
- Tài liệu yêu cầu nghiệp vụ (BRD)
- app/layout.tsx
- change_requests.py
- next.config.js
- FastAPI
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- tailwind.config.ts
- middleware.ts
- PortfolioBase
- Rà soát code và nâng cấp giao diện — 2026-09-15
- date_utils.py
- dashboard_service.py
- playwright
- alembic
- report_tasks.py
- forgot-password/page.tsx
- Permission
- get_critical_path
- vitest.config.mts
- resource_leveling
- Chi tiết các Giai đoạn
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- next-env.d.ts
- Kết quả rà soát
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- 11. Cài đặt và Chạy hệ thống
- 1. Tổng quan dự án
- run_risk_analysis
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- test_auth_password_recovery.py
- utils/cpm.py
- 3. Ngăn xếp công nghệ
- test_ws_hardening.py
- users.py

## God Nodes (most connected - your core abstractions)
1. `User` - 220 edges
2. `ForbiddenException` - 82 edges
3. `WBSService` - 70 edges
4. `Base` - 68 edges
5. `TaskService` - 68 edges
6. `NotFoundException` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

## Surprising Connections (you probably didn't know these)
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `ProjectRepository` --uses--> `AuditLog`  [INFERRED]
  backend/app/repositories/project_repository.py → backend/app/models/audit_log.py
- `AuditService` --uses--> `AuditLog`  [INFERRED]
  backend/app/services/audit_service.py → backend/app/models/audit_log.py
- `AuthService` --uses--> `AuditLog`  [INFERRED]
  backend/app/services/auth_service.py → backend/app/models/audit_log.py

## Import Cycles
- None detected.

## Communities (153 total, 7 thin omitted)

### Community 0 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (23): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+15 more)

### Community 1 - "Button.tsx"
Cohesion: 0.06
Nodes (68): LoginPageProps, metadata, Alert(), AlertProps, VARIANT_CLASSES, Avatar(), AvatarProps, Button (+60 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (34): Approval, ApprovalStatus, str, Assignment, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —… (+26 more)

### Community 3 - "refresh_token"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (67): VerificationState, VerifyEmailContent(), verify(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectMembersPage() (+59 more)

### Community 5 - "roles.py"
Cohesion: 0.11
Nodes (29): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+21 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.25
Nodes (12): PortfolioStatus, str, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate (+4 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (42): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+34 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.16
Nodes (17): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+9 more)

### Community 9 - "wbs/page.tsx"
Cohesion: 0.10
Nodes (18): DeletePhaseDialog(), Editor, EntityEditor(), statusOptions(), ConfirmDialog(), ConfirmDialogProps, Modal(), ModalProps (+10 more)

### Community 10 - "get_redis"
Cohesion: 0.05
Nodes (60): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+52 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.08
Nodes (31): AIOutput, ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, SOP-AI-001: Điều phối vòng đời AIRequest cho tính năng sinh dự án bằng AI.…, impact_analysis_task() (+23 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.08
Nodes (40): AdminAuditPage(), PortfolioDetailPage(), PortfoliosPage(), EmptyState(), ErrorState(), LoadingState(), AuditLogFilters(), ACTION_CLASSES (+32 more)

### Community 15 - "User"
Cohesion: 0.07
Nodes (41): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+33 more)

### Community 16 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "require_permissions"
Cohesion: 0.12
Nodes (32): AdminUserServiceDep, change_password(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user() (+24 more)

### Community 20 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 21 - "formatDate"
Cohesion: 0.09
Nodes (33): DashboardPage(), ProjectOverviewPage(), KanbanColumn(), SprintView(), TaskTable(), MiniProgressBar(), MiniProgressBarProps, StatusBadge() (+25 more)

### Community 22 - "test_admin_roles.py"
Cohesion: 0.58
Nodes (10): build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role(), test_delete_role_blocks_when_users_still_assigned(), test_delete_role_succeeds_when_unused() (+2 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "ChangeRequestDetail.tsx"
Cohesion: 0.13
Nodes (24): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList(), STATUS_CLASSES, changeRequestKeys, IN_PROGRESS (+16 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "auth_service.py"
Cohesion: 0.07
Nodes (43): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), TooManyRequestsException, create_access_token(), create_refresh_token(), decode_token(), Any, datetime (+35 more)

### Community 29 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 30 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 31 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 32 - "ForbiddenException"
Cohesion: 0.09
Nodes (33): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException, DependencyType, str (+25 more)

### Community 33 - "react"
Cohesion: 0.10
Nodes (29): NotificationsPage(), FullPageSpinner(), Brand(), LanguageToggle(), LINKS, MainNav(), MobileNav(), NotificationBell() (+21 more)

### Community 34 - "as_user"
Cohesion: 0.08
Nodes (40): AsyncClient, as_user(), client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture (+32 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (19): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+11 more)

### Community 37 - "task_service.py"
Cohesion: 0.06
Nodes (69): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+61 more)

### Community 38 - "Project"
Cohesion: 0.08
Nodes (39): AIRequest, Project, Worklog, datetime, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ… (+31 more)

### Community 39 - "AdminUserService"
Cohesion: 0.06
Nodes (49): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), AdminUserCreate, AdminUserUpdate, field_validator (+41 more)

### Community 40 - "AIService"
Cohesion: 0.09
Nodes (42): AIJobResponse, AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get (+34 more)

### Community 41 - "typing"
Cohesion: 0.08
Nodes (19): Các bảng liên kết cho quan hệ nhiều-nhiều., Task, BaseRepository, Any, AsyncSession, datetime, AsyncSession, TaskRepository (+11 more)

### Community 42 - "BadRequestException"
Cohesion: 0.14
Nodes (18): BadRequestException, OAuthService, Any, User, Phân giải identity của provider thành một User. `email_provider_verified` là…, Đổi `state` lấy luồng mà nó đại diện, đúng một lần. Trả về `(OAuthState,…, asyncio, User (+10 more)

### Community 43 - "risk_analyzer.py"
Cohesion: 0.05
Nodes (68): ABC, Leave, LeaveStatus, LeaveType, str, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider. (+60 more)

### Community 44 - "timedelta"
Cohesion: 0.30
Nodes (15): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+7 more)

### Community 45 - "main.py"
Cohesion: 0.07
Nodes (37): set_request_id(), client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực… (+29 more)

### Community 46 - "project_service.py"
Cohesion: 0.26
Nodes (17): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse (+9 more)

### Community 47 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.18
Nodes (25): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+17 more)

### Community 50 - "api.ts"
Cohesion: 0.06
Nodes (47): AuthLayout(), OAuthCallbackContent(), AdminLayout(), TABS, DashboardLayout(), ProfilePageContent(), EmailVerificationBanner(), EmailVerificationBannerProps (+39 more)

### Community 51 - "PortfolioRepository"
Cohesion: 0.20
Nodes (5): PortfolioRepository, AsyncSession, get_portfolio_service(), AsyncSession, Depends

### Community 52 - "test_schema_and_query_shape.py"
Cohesion: 0.12
Nodes (19): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Milestone, Phase, Sprint, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.27
Nodes (21): verify_password(), OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó. (+13 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 57 - "sprints.py"
Cohesion: 0.21
Nodes (18): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+10 more)

### Community 58 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 59 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 60 - "ProjectService"
Cohesion: 0.23
Nodes (5): ProjectMemberResponse, ProjectService, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "pytest"
Cohesion: 0.07
Nodes (40): NotificationType, str, NotificationService, AsyncSession, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, notify_project_team(), ProjectContext (+32 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.23
Nodes (11): apply(), systemPrefersDark(), Status(), ThemeContext, ThemeContextValue, themeInitScript, ThemePreference, ThemeProvider() (+3 more)

### Community 65 - "ChatService"
Cohesion: 0.25
Nodes (15): ChatService, get_chat_service(), AsyncSession, Depends, build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes() (+7 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.18
Nodes (17): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+9 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "NotFoundException"
Cohesion: 0.06
Nodes (22): AIResultResponse, Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, ConflictException, NotFoundException, UnprocessableException, Role (+14 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (26): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+18 more)

### Community 78 - "chat_service.py"
Cohesion: 0.17
Nodes (15): publish(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel (+7 more)

### Community 79 - "issue"
Cohesion: 0.18
Nodes (14): issue(), _key(), Any, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis, asyncio (+6 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "UserRepository"
Cohesion: 0.15
Nodes (3): AsyncSession, UserRepository, AsyncSession

### Community 82 - "endpoints/auth.py"
Cohesion: 0.28
Nodes (13): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+5 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.16
Nodes (24): CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService, get_change_request_service() (+16 more)

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

### Community 93 - "impact_analyzer.py"
Cohesion: 0.21
Nodes (12): ChangeRequest, Dependency, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, SOP-AI-002: Phân tích tác động (impact analysis) của một Change Request bằng…, Tính CPM hiện tại của dự án để làm bối cảnh lịch trình thật cho AI. Cùng cách… (+4 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.11
Nodes (7): ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., get_project_service(), AsyncSession, Depends

### Community 95 - "WBSServiceDep"
Cohesion: 0.22
Nodes (14): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+6 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "app/layout.tsx"
Cohesion: 0.23
Nodes (7): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), notifyError(), sonner

### Community 98 - "change_requests.py"
Cohesion: 0.36
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "FastAPI"
Cohesion: 0.05
Nodes (55): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, get_current_user(), get_current_user_media() (+47 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.33
Nodes (7): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers, ref_next_intl_server

### Community 103 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 111 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 115 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 116 - "Permission"
Cohesion: 0.47
Nodes (4): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission

### Community 117 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 121 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 128 - "Kết quả rà soát"
Cohesion: 0.29
Nodes (6): Chat dự án và thông báo WebSocket thời gian thực (hoàn thành 100%), Các model chính, Kiến trúc phía giao diện và chất lượng, Kiến trúc phía máy chủ (đã xác minh và kiểm thử), Kết quả rà soát, Tính năng quản trị và RBAC (hoàn thành 100%)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 151 - "run_risk_analysis"
Cohesion: 0.21
Nodes (21): str, RiskLevel, _level_from_score(), _normalize_level(), Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project() (+13 more)

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
Cohesion: 0.23
Nodes (18): ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+10 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.09
Nodes (46): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+38 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.10
Nodes (27): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+19 more)

### Community 168 - "users.py"
Cohesion: 0.06
Nodes (45): connect_social_account(), OAuthServiceDep, Response, ServiceUnavailableException, UnauthorizedException, AdminUserResponse, Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult (+37 more)

## Knowledge Gaps
- **375 isolated node(s):** `Props`, `WSClientOptions`, `LoginPageProps`, `AlertProps`, `AvatarProps` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `roles.py`, `portfolio_service.py`, `ai_tasks.py`, `require_permissions`, `auth_service.py`, `list_audit_logs`, `ForbiddenException`, `as_user`, `task_service.py`, `Project`, `test_ws_hardening.py`, `AIService`, `users.py`, `typing`, `AdminUserService`, `risk_analyzer.py`, `BadRequestException`, `project_service.py`, `list_portfolios`, `list_projects`, `timedelta`, `ProjectService`, `ChatService`, `is_admin`, `NotFoundException`, `chat_service.py`, `UserRepository`, `test_change_request_service.py`, `ProjectRepository`, `FastAPI`, `dashboard_service.py`, `Permission`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `ProjectRepository` to `db/base.py`, `TaskStatus`, `Project`, `typing`, `AuditLog`, `NotFoundException`, `project_service.py`, `User`, `ProjectService`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `AuthService` connect `auth_service.py` to `ForbiddenException`, `test_auth_password_recovery.py`, `users.py`, `NotFoundException`, `BadRequestException`, `AuditLog`, `timedelta`, `User`, `UserRepository`, `endpoints/auth.py`, `test_user_profile_settings.py`, `test_login_lockout.py`, `test_token_revocation.py`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `WSClientOptions`, `LoginPageProps` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ChatPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._