# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-18)

## Corpus Check
- 434 files · ~157,704 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3494 nodes · 10415 edges · 166 communities (142 shown, 9 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 915 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `441623bc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- Button.tsx
- db/base.py
- common.py
- getApiErrorMessage
- test_resource_recommender.py
- PortfolioService
- users/page.tsx
- email_tasks.py
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- Project
- portfolios/[id]/page.tsx
- User
- wbs.py
- useTasks.ts
- cn
- users.py
- NotificationService
- formatDate
- test_auth_password_recovery.py
- test_login_lockout.py
- tasks.py
- test_route_exposure.py
- ai_tasks.py
- compilerOptions
- AuthService
- run_impact_analysis
- auth_service.py
- typing
- ForbiddenException
- react
- test_authz_matrix.py
- package.json
- dashboard.py
- task_service.py
- fixture
- admin.py
- NotFoundException
- project_service.py
- OAuthService
- resource_recommender.py
- test_auth_email_verification.py
- get_redis
- ProjectService
- test_admin_users.py
- list_projects
- test_schedule_optimizer.py
- api.ts
- post
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- ChangeRequestDetail.tsx
- scheduling_service.py
- ConnectionManager
- endpoints/auth.py
- RoleService
- System Architecture Design
- notification_tasks.py
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- ProjectCreate
- logging_config.py
- worklogs.py
- ChatPanel.tsx
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- list_audit_logs
- Software Requirements Specification (SRS)
- ResourceService
- unittest_mock
- test_resource_warnings.py
- TeamBarChart.tsx
- AGENTS.md
- ChatService
- Settings
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
- UserService
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- pytest
- next.config.js
- main.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- test_project_scoping.py
- scripts
- useAIGenerator.ts
- BaseRepository
- middleware.ts
- pydantic
- Rà soát code và nâng cấp giao diện — 2026-09-15
- list_portfolios
- DashboardService
- playwright
- env.py
- date_utils.py
- AdminUserCreate
- test_dashboard_metrics.py
- BurndownChart.tsx
- vitest.config.mts
- get_current_active_superuser
- schemas/user.py
- Danh mục tính năng triển khai theo Phase
- test_ai_service.py
- Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- dashboards.py
- PortfolioRepository
- next-env.d.ts
- Rà soát 2026-09-06
- SchedulingService
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- AdminUserService
- 11. Cài đặt và Chạy hệ thống
- .start_flow
- resource_leveling
- 1. Tổng quan dự án
- run_risk_analysis
- tailwind.config.ts
- 12. Cấu hình & Biến môi trường
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- get_wbs_service
- useScheduleOptimization.ts
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
- `GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)` --references--> `WBSService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/wbs_service.py
- `GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py
- `Phát hiện quan trọng làm thay đổi phạm vi` --references--> `AIImpactAnalysisRequest`  [INFERRED]
  docs/archive/phase3-ai-features/plan.md → backend/app/schemas/ai.py

## Import Cycles
- None detected.

## Communities (166 total, 9 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "Button.tsx"
Cohesion: 0.06
Nodes (62): Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), metadata, LoginPageProps, metadata, OAuthCallbackPage(), metadata (+54 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (31): Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, Comment (+23 more)

### Community 3 - "common.py"
Cohesion: 0.12
Nodes (28): AuthServiceDep, create_websocket_ticket(), forgot_password(), get_me(), login(), logout(), CurrentUser, Depends (+20 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (62): VerifyEmailContent(), verify(), DashboardPage(), ProfilePageContent(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout() (+54 more)

### Community 5 - "test_resource_recommender.py"
Cohesion: 0.21
Nodes (20): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+12 more)

### Community 6 - "PortfolioService"
Cohesion: 0.15
Nodes (14): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+6 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (54): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+46 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.16
Nodes (17): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+9 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.12
Nodes (30): ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, useAIJob(), useGenerateProject(), InviteMemberDialog(), InitialProjectMember, ProjectWizard() (+22 more)

### Community 10 - "oauth.py"
Cohesion: 0.11
Nodes (33): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+25 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Dependencies & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 12 - "my_assignments"
Cohesion: 0.20
Nodes (11): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+3 more)

### Community 13 - "Project"
Cohesion: 0.04
Nodes (71): ABC, AIOutput, AIRequest, ChangeRequest, Dependency, Project, datetime, BaseAIProvider (+63 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (26): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, portfolioKeys (+18 more)

### Community 15 - "User"
Cohesion: 0.09
Nodes (19): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, User, add_audit() (+11 more)

### Community 16 - "wbs.py"
Cohesion: 0.05
Nodes (72): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+64 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (36): DeletePhaseDialog(), taskKeys, useInvalidate(), usePhaseImpact(), wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (31): MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, EmptyState(), Spinner(), UserTable(), ResourceRecommendationPanel() (+23 more)

### Community 19 - "users.py"
Cohesion: 0.11
Nodes (36): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+28 more)

### Community 20 - "NotificationService"
Cohesion: 0.09
Nodes (30): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+22 more)

### Community 21 - "formatDate"
Cohesion: 0.06
Nodes (49): Danh mục tính năng đã triển khai, Danh mục tính năng triển khai theo Phase, ProjectOverviewCharts, ProjectOverviewPage(), TaskTable(), ChatMessageItem(), ActiveProjectsGrid(), ActiveProjectsGridProps (+41 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "tasks.py"
Cohesion: 0.17
Nodes (21): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+13 more)

### Community 25 - "test_route_exposure.py"
Cohesion: 0.17
Nodes (13): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+5 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.15
Nodes (24): impact_analysis_task(), _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task(), _optimize_schedule_with_own_session(), task, Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho… (+16 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.15
Nodes (9): AuthService, get_auth_service(), AsyncSession, datetime, Depends, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+1 more)

### Community 29 - "run_impact_analysis"
Cohesion: 0.24
Nodes (20): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+12 more)

### Community 30 - "auth_service.py"
Cohesion: 0.08
Nodes (39): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+31 more)

### Community 31 - "typing"
Cohesion: 0.06
Nodes (57): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), role_checker() (+49 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.09
Nodes (28): get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, BadRequestException, ForbiddenException, DependencyType, str, str, SubtaskStatus (+20 more)

### Community 33 - "react"
Cohesion: 0.06
Nodes (44): Admin / RBAC Feature (100% Complete), Findings, Frontend Architecture & Quality, Real-Time Project Chat & WebSocket Notification (100% Complete), VerificationState, AdminLayout(), TABS, DashboardLayout() (+36 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "dashboard.py"
Cohesion: 0.15
Nodes (19): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, ProjectDashboardStats, ProjectStats (+11 more)

### Community 37 - "task_service.py"
Cohesion: 0.08
Nodes (41): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, TaskServiceDep (+33 more)

### Community 38 - "fixture"
Cohesion: 0.14
Nodes (18): AsyncClient, as_user(), factory(), client(), override_db(), _disable_rate_limiting(), event_loop(), make_user() (+10 more)

### Community 39 - "admin.py"
Cohesion: 0.13
Nodes (23): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+15 more)

### Community 40 - "NotFoundException"
Cohesion: 0.11
Nodes (11): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, NotFoundException, TooManyRequestsException, UnprocessableException, AIRequestType, AIJobResponse, AIService (+3 more)

### Community 41 - "project_service.py"
Cohesion: 0.23
Nodes (19): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+11 more)

### Community 42 - "OAuthService"
Cohesion: 0.20
Nodes (7): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, AsyncSession, Đổi `state` lấy luồng mà nó đại diện, đúng một lần. Trả về `(OAuthState,…

### Community 43 - "resource_recommender.py"
Cohesion: 0.13
Nodes (16): Assignment, Leave, LeaveStatus, LeaveType, str, Skill, _candidate_stats(), get_ai_provider() (+8 more)

### Community 44 - "test_auth_email_verification.py"
Cohesion: 0.22
Nodes (16): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+8 more)

### Community 45 - "get_redis"
Cohesion: 0.20
Nodes (13): get_redis(), health_check(), get, Tình trạng sẵn sàng, bao gồm cả các phụ thuộc. Kiểm tra thật sự chạm tới…, _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về… (+5 more)

### Community 46 - "ProjectService"
Cohesion: 0.20
Nodes (6): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, Depends, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…

### Community 47 - "test_admin_users.py"
Cohesion: 0.30
Nodes (21): AdminUserUpdate, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành…, Ngay cả một Admin đầy đủ cũng không được viết lại tập role của chính mình — đó…, Admin UI luôn gửi toàn bộ form; một is_superuser / role_ids không thay đổi…, test_create_user_blocks_non_admin_assigning_roles() (+13 more)

### Community 48 - "list_projects"
Cohesion: 0.18
Nodes (20): add_project_member(), change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser (+12 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.16
Nodes (26): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+18 more)

### Community 50 - "api.ts"
Cohesion: 0.09
Nodes (39): EmailVerificationBannerProps, AvatarSection(), AvatarSectionProps, resolveAvatarUrl(), DangerZoneSection(), LinkedAccountsSection(), LinkedAccountsSectionProps, providers (+31 more)

### Community 51 - "post"
Cohesion: 0.16
Nodes (24): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+16 more)

### Community 52 - "Task"
Cohesion: 0.12
Nodes (19): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.23
Nodes (18): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage() (+10 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ChangeRequestDetail.tsx"
Cohesion: 0.17
Nodes (17): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useImpactAnalysisJob(), useRunImpactAnalysis() (+9 more)

### Community 57 - "scheduling_service.py"
Cohesion: 0.13
Nodes (23): set_current_project_id(), Worklog, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession, Depends, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost() (+15 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "endpoints/auth.py"
Cohesion: 0.21
Nodes (18): exchange_oauth_code(), Response, Đổi mã one-time code từ OAuth redirect lấy cặp token thực tế. Dùng một lần: lần…, Làm mới access token. Trình duyệt không gửi gì cả — refresh token tới từ cookie…, refresh_token(), AccessTokenResponse, ForgotPasswordRequest, LoginRequest (+10 more)

### Community 60 - "RoleService"
Cohesion: 0.28
Nodes (15): RoleCreate, RoleUpdate, AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role() (+7 more)

### Community 61 - "System Architecture Design"
Cohesion: 0.14
Nodes (14): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+6 more)

### Community 62 - "notification_tasks.py"
Cohesion: 0.15
Nodes (14): AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session() (+6 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (21): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 3. Technology Stack, 4. Phân cấp cấu trúc dự án (WBS) (+13 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.10
Nodes (20): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+12 more)

### Community 65 - "ProjectCreate"
Cohesion: 0.15
Nodes (7): create_project(), Depends, ProjectCreate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, test_portfolio_and_project_schema_validation()

### Community 66 - "logging_config.py"
Cohesion: 0.12
Nodes (16): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, main() (+8 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (18): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+10 more)

### Community 68 - "ChatPanel.tsx"
Cohesion: 0.10
Nodes (27): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), AuthLayout(), OAuthCallbackContent(), Props, ChatPanel(), handleSend(), Props, chatKeys (+19 more)

### Community 69 - "TaskStatus"
Cohesion: 0.10
Nodes (38): NotificationType, str, str, TaskStatus, TaskStatusUpdate, TaskUpdate, AsyncSession, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`… (+30 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.13
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 72 - "Software Requirements Specification (SRS)"
Cohesion: 0.15
Nodes (13): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+5 more)

### Community 73 - "ResourceService"
Cohesion: 0.15
Nodes (8): ConflictException, Phân giải identity của provider thành một User. `email_provider_verified` là…, AsyncSession, date, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach…, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc…, ResourceService

### Community 74 - "unittest_mock"
Cohesion: 0.18
Nodes (12): _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_recent_activity_filters_by_visible_projects() (+4 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 78 - "ChatService"
Cohesion: 0.10
Nodes (35): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+27 more)

### Community 79 - "Settings"
Cohesion: 0.25
Nodes (10): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+2 more)

### Community 80 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 82 - "AuditService"
Cohesion: 0.12
Nodes (17): AuditService, AsyncSession, datetime, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio, test_list_maps_rows_with_actor(), test_list_returns_empty_page() (+9 more)

### Community 83 - "approvals.py"
Cohesion: 0.18
Nodes (11): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.13
Nodes (29): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), CRStatus (+21 more)

### Community 85 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 86 - "documents.py"
Cohesion: 0.17
Nodes (12): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.17
Nodes (12): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 88 - "leaves.py"
Cohesion: 0.18
Nodes (11): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 89 - "project_versions.py"
Cohesion: 0.17
Nodes (12): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (12): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 91 - "skills.py"
Cohesion: 0.18
Nodes (11): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 92 - "system.py"
Cohesion: 0.17
Nodes (12): create_system(), delete_system(), get_system(), list_system(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 93 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 95 - "UserService"
Cohesion: 0.19
Nodes (10): ServiceUnavailableException, UnauthorizedException, DeleteAccountRequest, get_user_service(), AsyncSession, Depends, UploadFile, UserService (+2 more)

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
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "main.py"
Cohesion: 0.08
Nodes (35): set_request_id(), client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực… (+27 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.13
Nodes (12): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song) (+4 more)

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
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 106 - "BaseRepository"
Cohesion: 0.17
Nodes (6): BaseRepository, Any, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "pydantic"
Cohesion: 0.50
Nodes (4): GanttResponse, GanttTask, BaseModel, pydantic

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "list_portfolios"
Cohesion: 0.19
Nodes (15): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+7 more)

### Community 111 - "DashboardService"
Cohesion: 0.23
Nodes (8): PortfolioProjectHealth, UserDashboardStats, DashboardService, _iso_week_bounds(), AsyncSession, date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*.

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "env.py"
Cohesion: 0.05
Nodes (7): alembic, do_run_migrations(), run_async_migrations(), run_migrations_online(), Connection, sqlalchemy_dialects, sqlalchemy_engine

### Community 114 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 116 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 117 - "BurndownChart.tsx"
Cohesion: 0.60
Nodes (4): BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 120 - "schemas/user.py"
Cohesion: 0.22
Nodes (9): AdminUserResponse, ChangePasswordRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate, UserResponse (+1 more)

### Community 121 - "Danh mục tính năng triển khai theo Phase"
Cohesion: 0.14
Nodes (13): parse_document_task(), SOP-DOC-001: Phân tích tài liệu BRD/SRS bằng AI., 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View) (+5 more)

### Community 122 - "test_ai_service.py"
Cohesion: 0.41
Nodes (12): AIRequestStatus, str, ai_request(), db(), asyncio, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 123 - "Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.15
Nodes (12): 4 trụ cột (song song, sau Task 1), Checkpoint: 4 trụ cột backend/frontend cô lập xong, Checkpoint: Tích hợp hoàn chỉnh, Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Kiến trúc mới, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm), Overview (+4 more)

### Community 125 - "dashboards.py"
Cohesion: 0.29
Nodes (10): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+2 more)

### Community 126 - "PortfolioRepository"
Cohesion: 0.27
Nodes (3): PortfolioRepository, AsyncSession, AsyncSession

### Community 128 - "Rà soát 2026-09-06"
Cohesion: 0.25
Nodes (7): RecentActivityItem, Bảo mật, Còn nợ, Giao diện, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 129 - "SchedulingService"
Cohesion: 0.43
Nodes (5): CPMResponse, CPMTask, BaseModel, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "AdminUserService"
Cohesion: 0.27
Nodes (4): AdminUserService, AsyncSession, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - ".start_flow"
Cohesion: 0.33
Nodes (5): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Bắt đầu một luồng OAuth. Trả về `(state, browser_secret, code_challenge)`.…

### Community 149 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 151 - "run_risk_analysis"
Cohesion: 0.09
Nodes (41): str, RiskLevel, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Model trả về thứ mà ta sẽ không hành động theo., Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+33 more)

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Frontend `/admin`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

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
Cohesion: 0.09
Nodes (45): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+37 more)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (55): asyncio, chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized() (+47 more)

### Community 168 - "user_service.py"
Cohesion: 0.12
Nodes (14): update_approvals(), update_leaves(), update_skills(), get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, _put(), io (+6 more)

## Knowledge Gaps
- **331 isolated node(s):** `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-09-18)`, `Hạ tầng Real-time & WebSocket Architecture`, `Backend (Python)` (+326 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1103 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatDate` to `ForbiddenException`, `react`, `ChatPanel.tsx`, `TaskStatus`, `PortfolioService`, `getApiErrorMessage`, `ResourceService`, `projects/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `ChatService`, `DashboardService`, `ProjectService`, `User`, `portfolios/[id]/page.tsx`, `NotificationService`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `SchedulingService`, `db/base.py`, `PortfolioService`, `Project`, `AdminUserService`, `users.py`, `ai_tasks.py`, `AuthService`, `auth_service.py`, `typing`, `ForbiddenException`, `dashboard.py`, `task_service.py`, `fixture`, `test_ws_hardening.py`, `NotFoundException`, `project_service.py`, `OAuthService`, `resource_recommender.py`, `user_service.py`, `test_auth_email_verification.py`, `ProjectService`, `test_admin_users.py`, `post`, `scheduling_service.py`, `RoleService`, `ProjectCreate`, `logging_config.py`, `list_audit_logs`, `ResourceService`, `ChatService`, `UserRepository`, `test_change_request_service.py`, `ProjectRepository`, `UserService`, `test_oauth_account_takeover.py`, `list_portfolios`, `DashboardService`, `get_current_active_superuser`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button.tsx` to `Chi tiết các Giai đoạn đã hoàn thành`, `users/page.tsx`, `OAuthService`, `RoleService`, `AuditService`, `AuthService`, `UserService`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 41 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-09-18)` to the rest of the system?**
  _331 weakly-connected nodes found - possible documentation gaps or missing edges._