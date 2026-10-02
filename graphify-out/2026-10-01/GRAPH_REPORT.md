# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-26)

## Corpus Check
- 434 files · ~236,818 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3538 nodes · 10300 edges · 153 communities (131 shown, 7 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6abf609`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ChatPanel.tsx
- Button.tsx
- db/base.py
- endpoints/auth.py
- formatDate
- AdminUserService
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- getApiErrorMessage
- ws_manager.py
- Chi tiết các Giai đoạn đã hoàn thành
- cn
- ai_tasks.py
- portfolios/[id]/page.tsx
- NotificationService
- test_schedule_optimizer.py
- useTasks.ts
- ws/chat.py
- users.py
- list_notifications
- dashboard.types.ts
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- security.py
- ChangeRequestDetail.tsx
- wbs.py
- AuthService
- User
- config.ts
- as_user
- package.json
- TaskServiceDep
- BadRequestException
- ForbiddenException
- sqlalchemy_ext_asyncio
- rate_limit.py
- NotFoundException
- oauth_service.py
- run_risk_analysis
- timedelta
- main.py
- project_service.py
- pytest
- list_projects
- auth_service.py
- react
- dashboard_service.py
- ChatMessage
- test_user_profile_settings.py
- dependencies
- devDependencies
- oauth.py
- typing
- Task
- test_auth_cookies.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- milestones.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- WBSServiceDep
- get_chat_history
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- config.py
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- endpoints/ai.py
- test_dashboard_activity_scope.py
- test_resource_warnings.py
- WBSServiceDep
- AGENTS.md
- chat_service.py
- test_ws_hardening.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- Chi tiết các Giai đoạn
- test_dashboard_metrics.py
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
- user_service.py
- ProjectRepository
- dashboards.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_chat_service.py
- ProjectCreate
- next.config.js
- conftest.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- create_dependency
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- Triển khai bản thử nghiệm trên Oracle Cloud Always Free
- middleware.ts
- my_assignments
- Rà soát code và nâng cấp giao diện — 2026-09-15
- FastAPI
- .get_user_summary
- playwright
- alembic
- get_critical_path
- get_project_service
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- ApprovalStatus
- vitest.config.mts
- resource_leveling
- DocumentType
- EmailStatus
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- next-env.d.ts
- Kết quả rà soát
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- 11. Cài đặt và Chạy hệ thống
- Chi tiết các Giai đoạn đã hoàn thành
- get_dashboard_service
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- Project
- test_auth_password_recovery.py
- ValueError
- 3. Ngăn xếp công nghệ
- 10. Đặc tả API và các điểm cuối WebSocket

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
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_user_search_result_never_carries_a_usable_address()` --uses--> `UserSearchResult`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/project.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py

## Import Cycles
- None detected.

## Communities (153 total, 7 thin omitted)

### Community 0 - "ChatPanel.tsx"
Cohesion: 0.09
Nodes (26): AuthLayout(), OAuthCallbackContent(), ProfilePageContent(), ProjectChatPage(), Props, ChatPanel(), handleSend(), Props (+18 more)

### Community 1 - "Button.tsx"
Cohesion: 0.07
Nodes (57): metadata, LoginPageProps, metadata, metadata, Alert(), AlertProps, VARIANT_CLASSES, Button (+49 more)

### Community 2 - "db/base.py"
Cohesion: 0.08
Nodes (41): AIOutput, Approval, Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., AuditLog, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState (+33 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (43): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+35 more)

### Community 4 - "formatDate"
Cohesion: 0.09
Nodes (33): DashboardPage(), TaskCard(), TaskTable(), StatusBadge(), ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard(), STATUS_BADGE (+25 more)

### Community 5 - "AdminUserService"
Cohesion: 0.06
Nodes (73): delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends, get (+65 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.07
Nodes (36): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+28 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (57): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+49 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.09
Nodes (26): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+18 more)

### Community 9 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (64): VerifyEmailContent(), verify(), AIInsightsPage(), ChangeRequestsPage(), ProjectLayout(), ProjectMembersPage(), ProjectOverviewPage(), ProjectSettingsPage() (+56 more)

### Community 10 - "ws_manager.py"
Cohesion: 0.29
Nodes (7): publish(), publish_many(), Any, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, json

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "cn"
Cohesion: 0.09
Nodes (32): MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, Modal(), ModalProps, Spinner(), ChatMessageItem() (+24 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.06
Nodes (56): AIJobResponse, AIResultResponse, AIRequest, AIRequestStatus, AIRequestType, str, AIJobResponse, ImpactReportResponse (+48 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.15
Nodes (24): PortfolioDetailPage(), PortfoliosPage(), DASHBOARD_KEYS, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioForm(), PortfolioFormProps, useCreatePortfolio() (+16 more)

### Community 15 - "NotificationService"
Cohesion: 0.09
Nodes (35): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, Notification, NotificationType, str, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel (+27 more)

### Community 16 - "test_schedule_optimizer.py"
Cohesion: 0.18
Nodes (25): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+17 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "ws/chat.py"
Cohesion: 0.13
Nodes (21): asyncio, chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized() (+13 more)

### Community 19 - "users.py"
Cohesion: 0.10
Nodes (41): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+33 more)

### Community 20 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 21 - "dashboard.types.ts"
Cohesion: 0.09
Nodes (22): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, MyTasksListProps (+14 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.17
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (19): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+11 more)

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
Cohesion: 0.09
Nodes (40): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+32 more)

### Community 29 - "ChangeRequestDetail.tsx"
Cohesion: 0.15
Nodes (20): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useCreateChangeRequest(), useImpactAnalysisJob() (+12 more)

### Community 30 - "wbs.py"
Cohesion: 0.13
Nodes (26): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+18 more)

### Community 31 - "AuthService"
Cohesion: 0.13
Nodes (11): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+3 more)

### Community 32 - "User"
Cohesion: 0.09
Nodes (24): str, SprintStatus, User, DateRangeMixin, PhaseUpdate, SprintCreate, SprintUpdate, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản… (+16 more)

### Community 33 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (26): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+18 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (60): description, name, overrides, postcss, private, version, ProjectsPage(), AIGeneratorModal() (+52 more)

### Community 36 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 37 - "BadRequestException"
Cohesion: 0.07
Nodes (43): Assignment, delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), BadRequestException (+35 more)

### Community 38 - "ForbiddenException"
Cohesion: 0.08
Nodes (30): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException (+22 more)

### Community 39 - "sqlalchemy_ext_asyncio"
Cohesion: 0.19
Nodes (6): BaseRepository, Any, AsyncSession, datetime, ModelType, sqlalchemy_ext_asyncio

### Community 40 - "rate_limit.py"
Cohesion: 0.15
Nodes (16): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+8 more)

### Community 41 - "NotFoundException"
Cohesion: 0.07
Nodes (32): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, create_role(), post, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser… (+24 more)

### Community 42 - "oauth_service.py"
Cohesion: 0.08
Nodes (19): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., AsyncSession, UserRepository, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse (+11 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.13
Nodes (31): str, RiskLevel, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score(), _normalize_level() (+23 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "main.py"
Cohesion: 0.10
Nodes (27): set_request_id(), close_redis(), get_client_ip(), Request, Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip() (+19 more)

### Community 46 - "project_service.py"
Cohesion: 0.29
Nodes (15): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberRoleUpdate, ProjectResponse (+7 more)

### Community 47 - "pytest"
Cohesion: 0.08
Nodes (34): _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu… (+26 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "auth_service.py"
Cohesion: 0.07
Nodes (40): _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), consume(), issue(), _key(), Any (+32 more)

### Community 50 - "react"
Cohesion: 0.05
Nodes (55): VerificationState, AdminLayout(), TABS, DashboardLayout(), FullPageSpinner(), Brand(), LanguageToggle(), LINKS (+47 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.18
Nodes (23): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+15 more)

### Community 52 - "ChatMessage"
Cohesion: 0.18
Nodes (10): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, _index_names(), Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model, nên…, Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00., history() lọc theo project_id + id < before_id và ORDER BY id DESC; một index…, test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in() (+2 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "oauth.py"
Cohesion: 0.27
Nodes (17): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+9 more)

### Community 57 - "typing"
Cohesion: 0.05
Nodes (59): ABC, Leave, LeaveStatus, LeaveType, str, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider. (+51 more)

### Community 58 - "Task"
Cohesion: 0.08
Nodes (41): Dependency, Task, Worklog, AsyncSession, TaskRepository, CPMResponse, CPMTask, BaseModel (+33 more)

### Community 59 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 60 - "ProjectService"
Cohesion: 0.23
Nodes (5): ProjectMemberResponse, ProjectService, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.13
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 65 - "WBSServiceDep"
Cohesion: 0.19
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 66 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.10
Nodes (32): TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.… (+24 more)

### Community 70 - "config.py"
Cohesion: 0.22
Nodes (11): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+3 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (24): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, post (+16 more)

### Community 74 - "test_dashboard_activity_scope.py"
Cohesion: 0.18
Nodes (13): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed() (+5 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "WBSServiceDep"
Cohesion: 0.23
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 78 - "chat_service.py"
Cohesion: 0.16
Nodes (17): ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án., ChatService, get_chat_service() (+9 more)

### Community 79 - "test_ws_hardening.py"
Cohesion: 0.12
Nodes (22): issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis (+14 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.17
Nodes (23): CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService, get_change_request_service() (+15 more)

### Community 85 - "env.py"
Cohesion: 0.15
Nodes (14): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+6 more)

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

### Community 93 - "user_service.py"
Cohesion: 0.08
Nodes (26): ServiceUnavailableException, UnauthorizedException, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase (+18 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.10
Nodes (9): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+1 more)

### Community 95 - "dashboards.py"
Cohesion: 0.23
Nodes (12): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+4 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_chat_service.py"
Cohesion: 0.45
Nodes (10): build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes(), test_history_no_more_pages_when_under_limit(), test_history_rejects_non_member(), test_history_returns_items_in_chronological_order_and_flags_more(), test_mark_read_creates_state_when_absent() (+2 more)

### Community 98 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "conftest.py"
Cohesion: 0.17
Nodes (16): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+8 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 103 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "Triển khai bản thử nghiệm trên Oracle Cloud Always Free"
Cohesion: 0.22
Nodes (8): 1. Tạo máy và mạng, 2. Cài Docker và lấy mã nguồn, 3. Cấu hình bí mật và URL, 4. Build, migrate và khởi động, 5. Kiểm tra sau triển khai, Nguồn đối chiếu, Triển khai bản thử nghiệm trên Oracle Cloud Always Free, Điều kiện trước khi bắt đầu

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "FastAPI"
Cohesion: 0.13
Nodes (18): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+10 more)

### Community 111 - ".get_user_summary"
Cohesion: 0.14
Nodes (10): ActiveProjectSummary, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*., BurndownPoint, MyTaskItem (+2 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 115 - "get_project_service"
Cohesion: 0.50
Nodes (3): get_project_service(), AsyncSession, Depends

### Community 116 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

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

### Community 148 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 152 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 161 - "Project"
Cohesion: 0.12
Nodes (34): ChangeRequest, ImpactReport, str, RiskLevel, Project, _build_prompt(), generate_impact_analysis(), get_ai_provider() (+26 more)

### Community 163 - "test_auth_password_recovery.py"
Cohesion: 0.15
Nodes (23): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), verify_password(), field_validator, RegisterRequest, ResetPasswordRequest, build_request(), build_service() (+15 more)

### Community 164 - "ValueError"
Cohesion: 0.05
Nodes (56): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator (+48 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 168 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

## Knowledge Gaps
- **382 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1197 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `AdminUserService`, `portfolio_service.py`, `ai_tasks.py`, `ws/chat.py`, `users.py`, `security.py`, `wbs.py`, `AuthService`, `as_user`, `BadRequestException`, `ForbiddenException`, `sqlalchemy_ext_asyncio`, `NotFoundException`, `oauth_service.py`, `timedelta`, `project_service.py`, `pytest`, `list_projects`, `auth_service.py`, `dashboard_service.py`, `typing`, `Task`, `ProjectService`, `endpoints/ai.py`, `chat_service.py`, `test_change_request_service.py`, `user_service.py`, `ProjectRepository`, `conftest.py`, `FastAPI`, `.get_user_summary`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `ProjectRepository` to `User`, `Project`, `db/base.py`, `TaskStatus`, `sqlalchemy_ext_asyncio`, `NotFoundException`, `project_service.py`, `get_project_service`, `Task`, `ProjectService`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `db/base.py`, `AdminUserService`, `portfolio_service.py`, `ai_tasks.py`, `NotificationService`, `ws/chat.py`, `users.py`, `security.py`, `AuthService`, `User`, `BadRequestException`, `NotFoundException`, `project_service.py`, `pytest`, `auth_service.py`, `dashboard_service.py`, `ProjectService`, `test_change_request_service.py`, `test_chat_service.py`, `FastAPI`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ChatPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._