# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-22)

## Corpus Check
- 433 files · ~235,804 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3526 nodes · 10272 edges · 147 communities (124 shown, 8 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a612fc8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ChatPanel.tsx
- Button.tsx
- db/base.py
- endpoints/auth.py
- getApiErrorMessage
- admin.py
- PortfolioService
- users/page.tsx
- email_tasks.py
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- ai_tasks.py
- portfolios/page.tsx
- User
- wbs.py
- useTasks.ts
- RiskWidget.tsx
- users.py
- endpoints/notifications.py
- lucide-react
- RoleService
- auth_service.py
- ChangeRequestDetail.tsx
- ConnectionManager
- pydantic
- compilerOptions
- AuthService
- Project
- security.py
- FastAPI
- TaskService
- react
- as_user
- package.json
- test_resource_recommender.py
- tasks.py
- scheduling_service.py
- AdminUserService
- AIService
- conftest.py
- BadRequestException
- wrap_user_input
- timedelta
- main.py
- ProjectService
- list_portfolios
- projects.py
- test_schedule_optimizer.py
- api.ts
- PortfolioRepository
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- get_chat_history
- sprints.py
- ProjectCreate
- rate_limit.py
- test_route_exposure.py
- Thiết kế kiến trúc hệ thống
- NotificationService
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- epics.py
- is_admin
- worklogs.py
- Chi tiết các Giai đoạn
- risk_analyzer.py
- Chi tiết các Giai đoạn đã hoàn thành
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- ForbiddenException
- pytest
- test_resource_warnings.py
- dashboard.types.ts
- AGENTS.md
- chat_service.py
- PaginatedResponse
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- UserRepository
- test_rate_limit.py
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
- create_dependency
- ProjectRepository
- .__init__
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_oauth_account_takeover.py
- XkiroProvider
- next.config.js
- typing
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- update_subtask
- get_current_active_superuser
- scripts
- Chi tiết kế hoạch triển khai
- tailwind.config.ts
- middleware.ts
- overrides
- Rà soát code và nâng cấp giao diện — 2026-09-15
- DashboardService
- playwright
- alembic
- vitest.config.mts
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
- ValueError
- 3. Ngăn xếp công nghệ
- test_ws_hardening.py
- user_service.py

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
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py

## Import Cycles
- None detected.

## Communities (147 total, 8 thin omitted)

### Community 0 - "ChatPanel.tsx"
Cohesion: 0.10
Nodes (23): ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+15 more)

### Community 1 - "Button.tsx"
Cohesion: 0.05
Nodes (77): metadata, LoginPageProps, metadata, metadata, Alert(), AlertProps, VARIANT_CLASSES, Avatar() (+69 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (34): AIOutput, AIRequest, Approval, ApprovalStatus, str, Assignment, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,… (+26 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.07
Nodes (60): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+52 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (55): AdminAuditPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectLayout(), ProjectMembersPage(), ProjectSettingsPage(), KanbanColumn(), SprintView() (+47 more)

### Community 5 - "admin.py"
Cohesion: 0.12
Nodes (24): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+16 more)

### Community 6 - "PortfolioService"
Cohesion: 0.13
Nodes (16): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+8 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (50): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+42 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.09
Nodes (26): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+18 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.08
Nodes (36): ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, mocks, aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject() (+28 more)

### Community 10 - "oauth.py"
Cohesion: 0.11
Nodes (33): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+25 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.07
Nodes (40): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, AITaskType, model_routing_table(), str (+32 more)

### Community 14 - "portfolios/page.tsx"
Cohesion: 0.16
Nodes (22): PortfoliosPage(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, PortfolioList(), useCreatePortfolio(), useDeletePortfolio() (+14 more)

### Community 15 - "User"
Cohesion: 0.11
Nodes (18): EpicStatus, str, PhaseStatus, str, str, SprintStatus, User, EpicCreate (+10 more)

### Community 16 - "wbs.py"
Cohesion: 0.08
Nodes (48): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+40 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (37): DeletePhaseDialog(), taskKeys, useInvalidate(), useTaskActions(), usePhaseImpact(), wbsKeys, taskService, wbsService (+29 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "endpoints/notifications.py"
Cohesion: 0.09
Nodes (27): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+19 more)

### Community 21 - "lucide-react"
Cohesion: 0.08
Nodes (40): DashboardPage(), PortfolioDetailPage(), ProjectOverviewPage(), TaskTable(), MiniProgressBar(), MiniProgressBarProps, ACTION_CLASSES, actionBadgeClass() (+32 more)

### Community 22 - "RoleService"
Cohesion: 0.22
Nodes (16): RoleCreate, RoleUpdate, AsyncSession, Role, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db() (+8 more)

### Community 23 - "auth_service.py"
Cohesion: 0.10
Nodes (27): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+19 more)

### Community 24 - "ChangeRequestDetail.tsx"
Cohesion: 0.15
Nodes (20): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, changeRequestKeys, IN_PROGRESS, useChangeRequest(), useCreateChangeRequest(), useImpactAnalysisJob() (+12 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "pydantic"
Cohesion: 0.50
Nodes (4): GanttResponse, GanttTask, BaseModel, pydantic

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.11
Nodes (14): TooManyRequestsException, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, revoke(), AuthService, get_auth_service(), AsyncSession, datetime, Depends (+6 more)

### Community 29 - "Project"
Cohesion: 0.10
Nodes (39): Dependency, str, RiskLevel, Project, datetime, _build_prompt(), generate_impact_analysis(), get_ai_provider() (+31 more)

### Community 30 - "security.py"
Cohesion: 0.09
Nodes (41): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+33 more)

### Community 31 - "FastAPI"
Cohesion: 0.10
Nodes (19): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+11 more)

### Community 32 - "TaskService"
Cohesion: 0.08
Nodes (40): str, SubtaskStatus, str, TaskPriority, AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate (+32 more)

### Community 33 - "react"
Cohesion: 0.12
Nodes (21): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+13 more)

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (26): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+18 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (26): description, name, private, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+18 more)

### Community 36 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (19): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+11 more)

### Community 37 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "scheduling_service.py"
Cohesion: 0.11
Nodes (30): set_current_project_id(), Worklog, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession (+22 more)

### Community 39 - "AdminUserService"
Cohesion: 0.27
Nodes (25): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio (+17 more)

### Community 40 - "AIService"
Cohesion: 0.09
Nodes (42): AIJobResponse, AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get (+34 more)

### Community 41 - "conftest.py"
Cohesion: 0.17
Nodes (16): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+8 more)

### Community 42 - "BadRequestException"
Cohesion: 0.10
Nodes (22): BadRequestException, ServiceUnavailableException, UnauthorizedException, code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem… (+14 more)

### Community 43 - "wrap_user_input"
Cohesion: 0.11
Nodes (26): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+18 more)

### Community 44 - "timedelta"
Cohesion: 0.15
Nodes (24): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+16 more)

### Community 45 - "main.py"
Cohesion: 0.06
Nodes (47): set_request_id(), close_redis(), get_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip() (+39 more)

### Community 46 - "ProjectService"
Cohesion: 0.13
Nodes (23): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+15 more)

### Community 47 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 48 - "projects.py"
Cohesion: 0.16
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.18
Nodes (25): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+17 more)

### Community 50 - "api.ts"
Cohesion: 0.05
Nodes (54): AuthLayout(), OAuthCallbackContent(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardLayout() (+46 more)

### Community 51 - "PortfolioRepository"
Cohesion: 0.14
Nodes (7): PortfolioRepository, AsyncSession, datetime, AsyncSession, get_project_service(), AsyncSession, Depends

### Community 52 - "Task"
Cohesion: 0.11
Nodes (20): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+12 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.17
Nodes (27): ChangePasswordRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate, UserResponse, UserUpdate (+19 more)

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
Cohesion: 0.27
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 58 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 59 - "rate_limit.py"
Cohesion: 0.16
Nodes (15): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+7 more)

### Community 60 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "NotificationService"
Cohesion: 0.09
Nodes (36): Notification, NotificationType, str, get_notification_service(), NotificationService, AsyncSession, Depends, NotificationService – CRUD + helper để tạo notifications từ các service khác.… (+28 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.09
Nodes (25): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+17 more)

### Community 65 - "epics.py"
Cohesion: 0.26
Nodes (12): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+4 more)

### Community 66 - "is_admin"
Cohesion: 0.25
Nodes (3): User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, is_admin()

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "risk_analyzer.py"
Cohesion: 0.10
Nodes (30): LeaveStatus, LeaveType, str, RiskReport, TaskStatus, _candidate_stats(), Tinh cac chi so xac dinh (khong AI) cho tung thanh vien du an: ky nang,…, _compute_signals() (+22 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "ForbiddenException"
Cohesion: 0.08
Nodes (30): AIResultResponse, Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException, ForbiddenException (+22 more)

### Community 74 - "pytest"
Cohesion: 0.09
Nodes (24): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditService, AsyncSession, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., two_projects() (+16 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.13
Nodes (26): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+18 more)

### Community 76 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (26): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+18 more)

### Community 78 - "chat_service.py"
Cohesion: 0.11
Nodes (31): publish(), Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+23 more)

### Community 79 - "PaginatedResponse"
Cohesion: 0.22
Nodes (7): AdminUserResponse, IDResponse, PaginatedResponse, BaseModel, PaginatedResponse, datetime, PaginatedResponse

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 82 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (33): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+25 more)

### Community 85 - "env.py"
Cohesion: 0.10
Nodes (20): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+12 more)

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

### Community 93 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.09
Nodes (7): BaseRepository, Any, AsyncSession, ProjectRepository, AsyncSession, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 98 - "XkiroProvider"
Cohesion: 0.15
Nodes (10): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., get_ai_provider(), xKiro la provider AI duy nhat duoc ho tro (gop nhieu model mien phi sau 1 API…, get_ai_provider(), xKiro là provider AI duy nhất được hỗ trợ (gộp nhiều model miễn phí sau 1 API… (+2 more)

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "typing"
Cohesion: 0.08
Nodes (41): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), get_client_ip() (+33 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 103 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

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

### Community 111 - "DashboardService"
Cohesion: 0.05
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

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
Cohesion: 0.15
Nodes (27): str, RiskLevel, _as_list(), _clamp_score(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+19 more)

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
Cohesion: 0.10
Nodes (34): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), verify_password(), AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest (+26 more)

### Community 164 - "ValueError"
Cohesion: 0.06
Nodes (52): field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator, model_validator, backward_pass(), build_graph(), compute_cpm() (+44 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (42): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+34 more)

### Community 168 - "user_service.py"
Cohesion: 0.11
Nodes (14): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, get_user_service(), AsyncSession, Depends, io, Minio (+6 more)

## Knowledge Gaps
- **375 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1189 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `PortfolioService`, `ai_tasks.py`, `wbs.py`, `users.py`, `RoleService`, `auth_service.py`, `AuthService`, `security.py`, `FastAPI`, `TaskService`, `as_user`, `scheduling_service.py`, `test_ws_hardening.py`, `AIService`, `AdminUserService`, `BadRequestException`, `user_service.py`, `conftest.py`, `timedelta`, `ProjectService`, `list_portfolios`, `projects.py`, `is_admin`, `risk_analyzer.py`, `ForbiddenException`, `chat_service.py`, `UserRepository`, `test_change_request_service.py`, `env.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `typing`, `get_current_active_superuser`, `DashboardService`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `ResourceService` connect `ForbiddenException` to `TaskService`, `db/base.py`, `typing`, `risk_analyzer.py`, `scheduling_service.py`, `BadRequestException`, `pytest`, `test_resource_warnings.py`, `User`, `Task`, `Project`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `db/base.py`, `admin.py`, `PortfolioService`, `User`, `users.py`, `RoleService`, `auth_service.py`, `AuthService`, `security.py`, `FastAPI`, `TaskService`, `test_ws_hardening.py`, `AdminUserService`, `AIService`, `ProjectService`, `test_route_exposure.py`, `NotificationService`, `is_admin`, `chat_service.py`, `test_change_request_service.py`, `.__init__`, `typing`, `get_current_active_superuser`, `DashboardService`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ChatPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._