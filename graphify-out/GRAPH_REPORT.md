# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-20)

## Corpus Check
- 433 files · ~235,804 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3559 nodes · 9659 edges · 165 communities (134 shown, 15 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 741 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd8f742b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- react
- db/base.py
- post
- PageState.tsx
- LeaveStatus
- portfolio_service.py
- users/page.tsx
- pytest
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- AITaskType
- portfolios/[id]/page.tsx
- User
- phases.py
- tasks/page.tsx
- RiskWidget.tsx
- users.py
- endpoints/notifications.py
- formatDate
- test_auth_password_recovery.py
- test_login_lockout.py
- ChangeRequestDetail.tsx
- NotificationService
- pydantic
- compilerOptions
- AuthService
- test_impact_analyzer.py
- auth_service.py
- FastAPI
- ForbiddenException
- useNotifications.ts
- test_authz_matrix.py
- package.json
- dashboard.py
- task_service.py
- conftest.py
- AdminUserService
- ai_tasks.py
- project_service.py
- OAuthService
- wrap_user_input
- test_auth_email_verification.py
- get_redis
- ProjectService
- @tanstack/react-query
- projects.py
- test_schedule_optimizer.py
- getApiErrorMessage
- endpoints/ai.py
- wbs_service.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- _compute_signals
- sprints.py
- ProjectCreate
- rate_limit.py
- test_route_exposure.py
- Thiết kế kiến trúc hệ thống
- Task
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- audit/page.tsx
- logging_config.py
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- ResourceService
- AuditLog
- test_resource_warnings.py
- BurndownChart.tsx
- AGENTS.md
- ChatService
- config.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- .__init__
- types
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
- test_token_revocation.py
- ProjectRepository
- BadRequestException
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_oauth_account_takeover.py
- xkiro_provider.py
- next.config.js
- main.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- test_project_scoping.py
- scripts
- Chi tiết kế hoạch triển khai
- vitest
- middleware.ts
- get_task_service
- Rà soát code và nâng cấp giao diện — 2026-09-15
- ApprovalStatus
- DashboardService
- playwright
- typing
- date_utils.py
- DependencyType
- test_dashboard_metrics.py
- DocumentType
- vitest.config.mts
- delete
- Chi tiết các Giai đoạn
- ge
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- get_dashboard_summary
- le
- next-env.d.ts
- Kết quả rà soát
- patch
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- UploadFile
- 11. Cài đặt và Chạy hệ thống
- oauth_state_store.py
- resource_leveling
- 1. Tổng quan dự án
- test_risk_analyzer.py
- field_validator
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- SchedulePanel.tsx
- report_tasks.py
- endpoints/auth.py
- test_cpm_scheduling.py
- 3. Ngăn xếp công nghệ
- asyncio
- test_ws_hardening.py
- user_service.py
- fixture

## God Nodes (most connected - your core abstractions)
1. `User` - 131 edges
2. `WBSService` - 68 edges
3. `ForbiddenException` - 64 edges
4. `getApiErrorMessage()` - 60 edges
5. `react` - 58 edges
6. `Task` - 56 edges
7. `lucide-react` - 56 edges
8. `TaskService` - 55 edges
9. `NotFoundException` - 54 edges
10. `Base` - 52 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `_start()` --calls--> `state_cookie_kwargs()`  [INFERRED]
  backend/app/api/v1/endpoints/oauth.py → backend/app/core/oauth_state_store.py
- `_handle_callback()` --calls--> `BadRequestException`  [INFERRED]
  backend/app/api/v1/endpoints/oauth.py → backend/app/core/exceptions.py
- `_finish()` --calls--> `state_cookie_path()`  [INFERRED]
  backend/app/api/v1/endpoints/oauth.py → backend/app/core/oauth_state_store.py

## Import Cycles
- None detected.

## Communities (165 total, 15 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (64): metadata, LoginPageProps, metadata, metadata, Alert(), AlertProps, VARIANT_CLASSES, Avatar() (+56 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (27): AIOutput, AIRequest, Approval, Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest (+19 more)

### Community 3 - "post"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "PageState.tsx"
Cohesion: 0.10
Nodes (28): AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), TimesheetPage(), EmptyState(), ErrorState(), LoadingState() (+20 more)

### Community 5 - "LeaveStatus"
Cohesion: 0.67
Nodes (3): LeaveStatus, LeaveType, str

### Community 6 - "portfolio_service.py"
Cohesion: 0.06
Nodes (41): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+33 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (47): AdminRolesPage(), AdminUsersPage(), Modal(), ModalProps, DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable() (+39 more)

### Community 8 - "pytest"
Cohesion: 0.09
Nodes (28): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+20 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.12
Nodes (34): ProjectMembersPage(), ProjectSettingsPage(), ProjectsPage(), usePortfolios(), InviteMemberDialog(), ProjectForm(), ProjectMembersTable(), InitialProjectMember (+26 more)

### Community 10 - "oauth.py"
Cohesion: 0.31
Nodes (15): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+7 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.20
Nodes (11): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+3 more)

### Community 13 - "AITaskType"
Cohesion: 0.13
Nodes (19): AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm…, Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI., Trả về tên model xKiro (dạng "vendor/model") được cấu hình cho một loại tác vụ., Trả về toàn bộ bảng định tuyến task -> model hiện hành, dùng để log/kiểm tra., resolve_model() (+11 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (27): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, PortfolioList() (+19 more)

### Community 15 - "User"
Cohesion: 0.07
Nodes (31): EpicStatus, str, MilestoneStatus, str, User, UserRepository, DateRangeMixin, EpicCreate (+23 more)

### Community 16 - "phases.py"
Cohesion: 0.24
Nodes (15): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+7 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.06
Nodes (58): KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage(), ViewMode, DeletePhaseDialog(), Editor (+50 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "users.py"
Cohesion: 0.07
Nodes (56): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+48 more)

### Community 20 - "endpoints/notifications.py"
Cohesion: 0.13
Nodes (24): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+16 more)

### Community 21 - "formatDate"
Cohesion: 0.07
Nodes (45): ProjectOverviewCharts, ProjectOverviewPage(), TaskTable(), WBSPage(), MiniProgressBar(), MiniProgressBarProps, ActiveProjectsGrid(), ActiveProjectsGridProps (+37 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.24
Nodes (17): verify_password(), build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+9 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "ChangeRequestDetail.tsx"
Cohesion: 0.12
Nodes (24): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList(), STATUS_CLASSES, StatusBadge(), changeRequestKeys (+16 more)

### Community 25 - "NotificationService"
Cohesion: 0.06
Nodes (38): ConnectionManager, publish(), publish_many(), Any, WebSocket, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY. (+30 more)

### Community 26 - "pydantic"
Cohesion: 0.14
Nodes (11): IDResponse, BaseModel, GanttResponse, GanttTask, BaseModel, ImpactReportResponse, BaseModel, BaseModel (+3 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.11
Nodes (15): AuthService, get_auth_service(), AsyncSession, datetime, Depends, get_db, TokenResponse, User (+7 more)

### Community 29 - "test_impact_analyzer.py"
Cohesion: 0.12
Nodes (35): str, RiskLevel, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession, Dependency (+27 more)

### Community 30 - "auth_service.py"
Cohesion: 0.10
Nodes (35): get_current_user(), get_current_user_media(), get_current_verified_user(), AsyncSession, Depends, get_db, Request, User (+27 more)

### Community 31 - "FastAPI"
Cohesion: 0.07
Nodes (38): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, create_dependency(), delete_dependency(), list_dependencies(), CurrentUser (+30 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.11
Nodes (27): ConflictException, ForbiddenException, NotFoundException, str, SubtaskStatus, TaskPriority, DependencyResponse, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết… (+19 more)

### Community 33 - "useNotifications.ts"
Cohesion: 0.08
Nodes (29): NotificationsPage(), handleSend(), useChatSocket(), sendMessage(), NotificationBell(), NotificationItem(), Props, TYPE_META (+21 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, config, autoprefixer (+21 more)

### Community 36 - "dashboard.py"
Cohesion: 0.15
Nodes (21): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth (+13 more)

### Community 37 - "task_service.py"
Cohesion: 0.07
Nodes (55): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), bulk_update_tasks(), change_task_status() (+47 more)

### Community 38 - "conftest.py"
Cohesion: 0.08
Nodes (38): AsyncClient, asyncio, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), as_user(), factory(), client(), override_db() (+30 more)

### Community 39 - "AdminUserService"
Cohesion: 0.05
Nodes (76): AdminUserResponse, create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete (+68 more)

### Community 40 - "ai_tasks.py"
Cohesion: 0.06
Nodes (65): AIRequestStatus, AIRequestType, str, AIJobResponse, _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation() (+57 more)

### Community 41 - "project_service.py"
Cohesion: 0.25
Nodes (14): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+6 more)

### Community 42 - "OAuthService"
Cohesion: 0.16
Nodes (11): get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession, Depends, get_db, TokenResponse (+3 more)

### Community 43 - "wrap_user_input"
Cohesion: 0.16
Nodes (20): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+12 more)

### Community 44 - "test_auth_email_verification.py"
Cohesion: 0.19
Nodes (18): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+10 more)

### Community 45 - "get_redis"
Cohesion: 0.09
Nodes (30): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), get_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ… (+22 more)

### Community 46 - "ProjectService"
Cohesion: 0.17
Nodes (10): ProjectDetailResponse, ProjectMemberResponse, ProjectResponse, ProjectSummaryResponse, get_project_service(), ProjectService, AsyncSession, date (+2 more)

### Community 47 - "@tanstack/react-query"
Cohesion: 0.19
Nodes (13): AIGeneratorModal(), STATUS_LABEL, mocks, aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject(), projectKeys (+5 more)

### Community 48 - "projects.py"
Cohesion: 0.18
Nodes (22): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+14 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.14
Nodes (29): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, XkiroProvider (+21 more)

### Community 50 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (63): AuthLayout(), OAuthCallbackContent(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardPage() (+55 more)

### Community 51 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (23): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+15 more)

### Community 52 - "wbs_service.py"
Cohesion: 0.06
Nodes (34): delete_epic(), delete, ChatMessage, Base, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Epic, Base, Milestone (+26 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.22
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "_compute_signals"
Cohesion: 0.14
Nodes (17): _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+9 more)

### Community 57 - "sprints.py"
Cohesion: 0.24
Nodes (15): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 58 - "ProjectCreate"
Cohesion: 0.18
Nodes (7): ProjectCreate, ProjectUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, _persist_plan(), test_portfolio_and_project_schema_validation()

### Community 59 - "rate_limit.py"
Cohesion: 0.15
Nodes (16): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+8 more)

### Community 60 - "test_route_exposure.py"
Cohesion: 0.17
Nodes (13): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+5 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "Task"
Cohesion: 0.11
Nodes (18): Base, Task, AsyncSession, TaskRepository, SOP-AI-004 / SOP-RM-001: Goi y nhan su phu hop nhat cho mot Task. Chi mang tinh…, AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên… (+10 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.12
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 65 - "audit/page.tsx"
Cohesion: 0.22
Nodes (11): AdminAuditPage(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs() (+3 more)

### Community 66 - "logging_config.py"
Cohesion: 0.23
Nodes (9): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, json (+1 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.12
Nodes (33): NotificationType, str, str, TaskStatus, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, _apply_status_side_effects() (+25 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "ResourceService"
Cohesion: 0.12
Nodes (18): Assignment, AssignmentCreate, get_resource_service(), AsyncSession, date, Depends, get_db, User (+10 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (16): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, Base, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy… (+8 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 78 - "ChatService"
Cohesion: 0.09
Nodes (37): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+29 more)

### Community 79 - "config.py"
Cohesion: 0.17
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+5 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 82 - "types"
Cohesion: 0.53
Nodes (5): build_db(), asyncio, test_list_maps_rows_with_actor(), test_list_returns_empty_page(), types

### Community 83 - "approvals.py"
Cohesion: 0.17
Nodes (12): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.13
Nodes (31): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), CRStatus (+23 more)

### Community 85 - "env.py"
Cohesion: 0.19
Nodes (11): do_run_migrations(), run_async_migrations(), run_migrations_online(), main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Connection, os (+3 more)

### Community 86 - "documents.py"
Cohesion: 0.17
Nodes (12): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.17
Nodes (12): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

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
Cohesion: 0.18
Nodes (11): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 92 - "system.py"
Cohesion: 0.18
Nodes (11): create_system(), delete_system(), get_system(), list_system(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 93 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.08
Nodes (12): Portfolio, Project, Role, BaseRepository, Any, AsyncSession, datetime, ProjectRepository (+4 more)

### Community 95 - "BadRequestException"
Cohesion: 0.17
Nodes (8): BadRequestException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, UnprocessableException, UploadFile, UserService, HTTPException

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (11): asyncio, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified() (+3 more)

### Community 98 - "xkiro_provider.py"
Cohesion: 0.28
Nodes (5): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., openai

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "main.py"
Cohesion: 0.10
Nodes (24): set_request_id(), close_redis(), get_client_ip(), Request, Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip() (+16 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 103 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (10): asyncio, fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown() (+2 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "vitest"
Cohesion: 0.33
Nodes (4): axios, ref_testing_library_jest_dom_vitest, @testing-library/react, vitest

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "get_task_service"
Cohesion: 0.40
Nodes (4): get_task_service(), AsyncSession, Depends, get_db

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 111 - "DashboardService"
Cohesion: 0.10
Nodes (19): ActiveProjectSummary, DashboardService, get_dashboard_service(), _iso_week_bounds(), AsyncSession, date, Depends, get_db (+11 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "typing"
Cohesion: 0.05
Nodes (26): alembic, list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles() (+18 more)

### Community 114 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 116 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 121 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 125 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 128 - "Kết quả rà soát"
Cohesion: 0.29
Nodes (6): Chat dự án và thông báo WebSocket thời gian thực (hoàn thành 100%), Các model chính, Kiến trúc phía giao diện và chất lượng, Kiến trúc phía máy chủ (đã xác minh và kiểm thử), Kết quả rà soát, Tính năng quản trị và RBAC (hoàn thành 100%)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "oauth_state_store.py"
Cohesion: 0.14
Nodes (16): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt. `lax` chứ không… (+8 more)

### Community 149 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 151 - "test_risk_analyzer.py"
Cohesion: 0.26
Nodes (18): str, RiskLevel, Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project(), asyncio, SOP-AI-005: run_risk_analysis phải luôn tạo được một RiskReport hợp lệ, kể cả… (+10 more)

### Community 154 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "SchedulePanel.tsx"
Cohesion: 0.16
Nodes (16): ACTION_LABEL, SchedulePanel(), SchedulePanelProps, SchedulePanelTask, STATUS_LABEL, IN_PROGRESS, scheduleOptimizationJobKeys, useOptimizeSchedule() (+8 more)

### Community 160 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 163 - "endpoints/auth.py"
Cohesion: 0.16
Nodes (20): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel (+12 more)

### Community 164 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (59): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession, Depends, get_db (+51 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (44): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+36 more)

### Community 168 - "user_service.py"
Cohesion: 0.10
Nodes (17): update_project_versions(), update_skills(), update_system(), get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, _put(), get_user_service() (+9 more)

## Knowledge Gaps
- **376 isolated node(s):** `STATUSES`, `ViewMode`, `Editor`, `InputProps`, `ModalProps` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1199 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `users.py`, `FastAPI`, `ForbiddenException`, `conftest.py`, `test_ws_hardening.py`, `ai_tasks.py`, `project_service.py`, `AdminUserService`, `user_service.py`, `test_auth_email_verification.py`, `ProjectService`, `projects.py`, `endpoints/ai.py`, `wbs_service.py`, `ChatService`, `test_change_request_service.py`, `ProjectRepository`, `BadRequestException`, `test_oauth_account_takeover.py`, `typing`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `Task` connect `Task` to `ForbiddenException`, `db/base.py`, `test_cpm_scheduling.py`, `task_service.py`, `conftest.py`, `test_project_scoping.py`, `ai_tasks.py`, `ResourceService`, `DashboardService`, `User`, `typing`, `test_schedule_optimizer.py`, `wbs_service.py`, `test_risk_analyzer.py`, `_compute_signals`, `test_impact_analyzer.py`, `ProjectRepository`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `AuditLog` connect `AuditLog` to `ForbiddenException`, `db/base.py`, `portfolio_service.py`, `user_service.py`, `project_service.py`, `OAuthService`, `test_auth_email_verification.py`, `ProjectService`, `DashboardService`, `typing`, `wbs_service.py`, `ProjectRepository`, `AuthService`, `auth_service.py`, `BadRequestException`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 23 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `STATUSES`, `ViewMode`, `Editor` to the rest of the system?**
  _376 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_auth_cookies.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0564274378416505 - nodes in this community are weakly interconnected._