# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-08)

## Corpus Check
- 432 files · ~233,161 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3499 nodes · 10248 edges · 156 communities (133 shown, 8 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 787 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b6bec6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- react
- db/base.py
- endpoints/auth.py
- dashboard.types.ts
- roles.py
- portfolio_service.py
- users/page.tsx
- unittest_mock
- getApiErrorMessage
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- RiskWidget.tsx
- ai_tasks.py
- portfolios/[id]/page.tsx
- NotificationService
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- list_portfolios
- test_phase2_task_wbs.py
- useNotifications.ts
- auth_service.py
- test_resource_recommender.py
- ConnectionManager
- pydantic
- compilerOptions
- security.py
- ChangeRequestDetail.tsx
- wbs.py
- AuthService
- User
- lucide-react
- as_user
- package.json
- schemas/task.py
- ResourceService
- TaskService
- test_auth_password_recovery.py
- get_oauth_service
- ProjectRepository
- oauth_service.py
- run_risk_analysis
- timedelta
- main.py
- ValueError
- test_oauth_account_takeover.py
- project_service.py
- user_service.py
- api.ts
- dashboard_service.py
- _index_names
- test_user_profile_settings.py
- dependencies
- devDependencies
- tasks.py
- typing
- task_service.py
- RoleService
- ProjectService
- Thiết kế kiến trúc hệ thống
- milestones.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- phase2_common.py
- login/page.tsx
- ChatPanel.tsx
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- AdminUserService
- test_portfolio_project_core.py
- list_notifications
- endpoints/ai.py
- FastAPI
- test_resource_warnings.py
- ._queue
- AGENTS.md
- ChatService
- audit_service.py
- config.py
- Chi tiết các Giai đoạn
- pytest
- approvals.py
- test_change_request_service.py
- env.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- rate_limit.py
- system.py
- BadRequestException
- sqlalchemy_ext_asyncio
- epics.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- skills.py
- test_route_exposure.py
- next.config.js
- Chi tiết các Giai đoạn đã hoàn thành
- PortfolioUpdate
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- Triển khai bản thử nghiệm trên Oracle Cloud Always Free
- middleware.ts
- my_assignments
- Rà soát code và nâng cấp giao diện — 2026-09-15
- create_change_request
- ForbiddenException
- playwright
- alembic
- app/layout.tsx
- get_redis
- list_projects
- ApprovalStatus
- vitest.config.mts
- create_dependency
- report_tasks.py
- EmailStatus
- test_large_projects_recalculate_in_the_background
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- .eslintrc.json
- _MessageBudget
- get_wbs_service
- next-env.d.ts
- FakeSocket
- 1. Tổng quan dự án
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- Đặc tả yêu cầu phần mềm (SRS)
- 11. Cài đặt và Chạy hệ thống
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- 10. Đặc tả API và các điểm cuối WebSocket
- run_impact_analysis
- test_cpm_scheduling.py
- 3. Ngăn xếp công nghệ
- config.ts
- ThemeProvider.tsx

## God Nodes (most connected - your core abstractions)
1. `User` - 218 edges
2. `ForbiddenException` - 82 edges
3. `WBSService` - 70 edges
4. `NotFoundException` - 68 edges
5. `Base` - 68 edges
6. `TaskService` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 60 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_user_search_result_never_carries_a_usable_address()` --uses--> `UserSearchResult`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/project.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py

## Import Cycles
- None detected.

## Communities (156 total, 8 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.18
Nodes (23): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+15 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (64): Alert(), AlertProps, VARIANT_CLASSES, Button, ButtonProps, VARIANT_CLASSES, Input, InputProps (+56 more)

### Community 2 - "db/base.py"
Cohesion: 0.08
Nodes (42): Approval, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, Comment (+34 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (45): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+37 more)

### Community 4 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (26): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+18 more)

### Community 5 - "roles.py"
Cohesion: 0.14
Nodes (25): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+17 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.13
Nodes (17): PortfolioStatus, str, PortfolioRepository, AsyncSession, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary (+9 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (53): AdminRolesPage(), AdminUsersPage(), ConfirmDialog(), ConfirmDialogProps, Modal(), ModalProps, DeleteRoleDialog(), RoleForm() (+45 more)

### Community 8 - "unittest_mock"
Cohesion: 0.16
Nodes (18): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+10 more)

### Community 9 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (69): AdminAuditPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectOverviewPage(), ProjectSettingsPage(), KanbanColumn() (+61 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.08
Nodes (51): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReportResponse, BaseModel, BaseModel (+43 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (27): PortfolioDetailPage(), PortfoliosPage(), DASHBOARD_KEYS, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps, PortfolioForm() (+19 more)

### Community 15 - "NotificationService"
Cohesion: 0.07
Nodes (42): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, NotificationType (+34 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.09
Nodes (39): ProjectMembersPage(), ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, mocks, useAIJob(), useGenerateProject(), portfolioKeys (+31 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (37): DeletePhaseDialog(), taskKeys, useInvalidate(), useTaskActions(), usePhaseImpact(), wbsKeys, taskService, wbsService (+29 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (41): asyncio, chat_ws(), Query, websocket, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra… (+33 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 21 - "test_phase2_task_wbs.py"
Cohesion: 0.13
Nodes (25): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+17 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.17
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "auth_service.py"
Cohesion: 0.08
Nodes (37): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+29 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (19): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac… (+11 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "pydantic"
Cohesion: 0.33
Nodes (5): GanttResponse, GanttTask, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., pydantic

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "security.py"
Cohesion: 0.13
Nodes (32): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+24 more)

### Community 29 - "ChangeRequestDetail.tsx"
Cohesion: 0.12
Nodes (24): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList(), STATUS_CLASSES, StatusBadge(), changeRequestKeys (+16 more)

### Community 30 - "wbs.py"
Cohesion: 0.08
Nodes (47): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+39 more)

### Community 31 - "AuthService"
Cohesion: 0.12
Nodes (12): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+4 more)

### Community 32 - "User"
Cohesion: 0.10
Nodes (16): str, SprintStatus, User, AsyncSession, UserRepository, add_audit(), get_project_context(), json_value() (+8 more)

### Community 33 - "lucide-react"
Cohesion: 0.07
Nodes (39): AuthLayout(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardPage(), DashboardLayout() (+31 more)

### Community 34 - "as_user"
Cohesion: 0.08
Nodes (38): AsyncClient, as_user(), client(), _disable_rate_limiting(), event_loop(), AsyncSession, fixture, Role (+30 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (30): description, name, overrides, postcss, private, version, config, autoprefixer (+22 more)

### Community 36 - "schemas/task.py"
Cohesion: 0.12
Nodes (24): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), AssignmentCreate, AssignmentMutationResponse (+16 more)

### Community 37 - "ResourceService"
Cohesion: 0.14
Nodes (13): Assignment, ConflictException, get_task_context(), get_resource_service(), AsyncSession, date, Depends, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach… (+5 more)

### Community 38 - "TaskService"
Cohesion: 0.12
Nodes (16): str, SubtaskStatus, TaskPriority, TaskDetailResponse, TaskResponse, get_task_service(), AsyncSession, date (+8 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 40 - "get_oauth_service"
Cohesion: 0.50
Nodes (3): get_oauth_service(), AsyncSession, Depends

### Community 41 - "ProjectRepository"
Cohesion: 0.15
Nodes (3): ProjectRepository, AsyncSession, date

### Community 42 - "oauth_service.py"
Cohesion: 0.11
Nodes (30): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+22 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.09
Nodes (41): str, RiskLevel, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Model trả về thứ mà ta sẽ không hành động theo., Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+33 more)

### Community 44 - "timedelta"
Cohesion: 0.16
Nodes (23): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+15 more)

### Community 45 - "main.py"
Cohesion: 0.10
Nodes (26): set_request_id(), close_redis(), get_redis_pubsub(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Client riêng cho `pubsub.listen()` trong ws_manager.py. Không được dùng chung…, Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip() (+18 more)

### Community 46 - "ValueError"
Cohesion: 0.23
Nodes (5): field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator, ValueError

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.31
Nodes (10): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

### Community 48 - "project_service.py"
Cohesion: 0.11
Nodes (35): add_project_member(), change_project_member_role(), create_project(), delete_project(), CurrentVerifiedUser, delete, Depends, patch (+27 more)

### Community 49 - "user_service.py"
Cohesion: 0.12
Nodes (13): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, get_user_service(), AsyncSession, Depends, io, Minio (+5 more)

### Community 50 - "api.ts"
Cohesion: 0.07
Nodes (35): OAuthCallbackContent(), EmailVerificationBanner(), EmailVerificationBannerProps, AvatarSectionProps, LinkedAccountsSectionProps, ProfileDetailsFormProps, connectWebSocket(), connect() (+27 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 52 - "_index_names"
Cohesion: 0.25
Nodes (8): _index_names(), Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model, nên…, Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00., history() lọc theo project_id + id < before_id và ORDER BY id DESC; một index…, test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_the_daily_sweep_query_is_indexed(), test_the_gin_index_on_labels_is_declared_on_the_model()

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.13
Nodes (30): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, ChangePasswordRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase (+22 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "tasks.py"
Cohesion: 0.15
Nodes (24): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+16 more)

### Community 57 - "typing"
Cohesion: 0.05
Nodes (63): ABC, Assignment, ChangeRequest, Leave, LeaveStatus, LeaveType, str, BaseAIProvider (+55 more)

### Community 58 - "task_service.py"
Cohesion: 0.07
Nodes (44): Dependency, DependencyType, str, Project, Task, Worklog, AsyncSession, TaskRepository (+36 more)

### Community 59 - "RoleService"
Cohesion: 0.28
Nodes (15): get_role_service(), AsyncSession, Depends, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role() (+7 more)

### Community 60 - "ProjectService"
Cohesion: 0.16
Nodes (9): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, date, Depends, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec… (+1 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "phase2_common.py"
Cohesion: 0.15
Nodes (18): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+10 more)

### Community 65 - "login/page.tsx"
Cohesion: 0.17
Nodes (6): metadata, LoginPageProps, metadata, metadata, next, ref_next_intl_server

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.22
Nodes (15): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+7 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (20): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+12 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.12
Nodes (34): str, TaskStatus, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, _apply_status_side_effects() (+26 more)

### Community 70 - "AdminUserService"
Cohesion: 0.12
Nodes (35): AdminUserCreate, AdminUserResponse, AdminUserUpdate, IDResponse, PaginatedResponse, BaseModel, AdminUserService, get_admin_user_service() (+27 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (24): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, post (+16 more)

### Community 74 - "FastAPI"
Cohesion: 0.06
Nodes (37): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+29 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "._queue"
Cohesion: 0.36
Nodes (3): AIJobResponse, AIJobResponse, Tao AIRequest + xep hang Celery task — dung chung cho ca 4 loai phan tich AI o…

### Community 78 - "ChatService"
Cohesion: 0.08
Nodes (41): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+33 more)

### Community 79 - "audit_service.py"
Cohesion: 0.22
Nodes (12): AuditLogResponse, AuditService, get_audit_service(), AsyncSession, datetime, Depends, PaginatedResponse, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm. (+4 more)

### Community 80 - "config.py"
Cohesion: 0.17
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+5 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "pytest"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.15
Nodes (24): CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService, get_change_request_service() (+16 more)

### Community 85 - "env.py"
Cohesion: 0.12
Nodes (17): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+9 more)

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

### Community 91 - "rate_limit.py"
Cohesion: 0.16
Nodes (15): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+7 more)

### Community 92 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 93 - "BadRequestException"
Cohesion: 0.09
Nodes (18): BadRequestException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, DeleteAccountRequest, OAuthService (+10 more)

### Community 94 - "sqlalchemy_ext_asyncio"
Cohesion: 0.13
Nodes (9): Các bảng liên kết cho quan hệ nhiều-nhiều., BaseRepository, Any, AsyncSession, datetime, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType (+1 more)

### Community 95 - "epics.py"
Cohesion: 0.24
Nodes (14): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+6 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.20
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 98 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (13): _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->…, Customer bị chặn khỏi danh sách task; subtask và đồ thị phụ thuộc là hai đường…, test_customer_role_cannot_read_project_work_items() (+5 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 101 - "PortfolioUpdate"
Cohesion: 0.22
Nodes (5): PortfolioBase, PortfolioUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate.

### Community 102 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

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
Cohesion: 0.20
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

### Community 110 - "create_change_request"
Cohesion: 0.33
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 111 - "ForbiddenException"
Cohesion: 0.10
Nodes (17): AIResultResponse, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,… (+9 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "app/layout.tsx"
Cohesion: 0.21
Nodes (8): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), themeInitScript, notifyError(), sonner

### Community 115 - "get_redis"
Cohesion: 0.14
Nodes (19): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), get_redis(), health_check() (+11 more)

### Community 116 - "list_projects"
Cohesion: 0.33
Nodes (10): get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser, date, ge, get (+2 more)

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 120 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 122 - "test_large_projects_recalculate_in_the_background"
Cohesion: 0.29
Nodes (7): asyncio, Một lần kéo thả trên dự án vài nghìn task không nên kéo theo hàng nghìn lệnh…, force_sync là đường mà worker dùng; thiếu nó thì nó tự đẩy việc cho chính mình…, Engine da hoan chinh tu Phase 2 nhung chua tung duoc expose: client khong co…, test_large_projects_recalculate_in_the_background(), test_the_cpm_endpoint_reports_float_and_the_critical_chain(), test_the_worker_itself_never_re_enqueues()

### Community 123 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 126 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 129 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

### Community 145 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 146 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 161 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 164 - "test_cpm_scheduling.py"
Cohesion: 0.25
Nodes (18): CPMNode, Thuật toán Kahn cho topological sort. Ném ValueError nếu có chu trình. Dùng…, Chạy toàn bộ phân tích CPM (topological sort + forward pass + backward pass)…, run_cpm(), topological_sort(), _chain(), CPM engine và cách nó được lên lịch chạy. `utils/cpm.py` là 329 dòng số học…, A(3) -> B(2) -> D(4), và A -> C(1) -> D. Đường găng là A,B,D = 9 ngày. (+10 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 169 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 174 - "ThemeProvider.tsx"
Cohesion: 0.18
Nodes (12): apply(), systemPrefersDark(), Status(), ThemeContext, ThemeContextValue, ThemePreference, ThemeProvider(), useTheme() (+4 more)

## Knowledge Gaps
- **355 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+350 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `roles.py`, `portfolio_service.py`, `ai_tasks.py`, `test_ws_hardening.py`, `users.py`, `list_portfolios`, `auth_service.py`, `security.py`, `wbs.py`, `AuthService`, `as_user`, `schemas/task.py`, `ResourceService`, `TaskService`, `ProjectRepository`, `oauth_service.py`, `timedelta`, `test_oauth_account_takeover.py`, `project_service.py`, `user_service.py`, `dashboard_service.py`, `typing`, `task_service.py`, `RoleService`, `ProjectService`, `phase2_common.py`, `AdminUserService`, `endpoints/ai.py`, `FastAPI`, `._queue`, `ChatService`, `test_change_request_service.py`, `BadRequestException`, `sqlalchemy_ext_asyncio`, `ForbiddenException`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `ProjectRepository` to `phase2_common.py`, `User`, `db/base.py`, `TaskStatus`, `ForbiddenException`, `project_service.py`, `task_service.py`, `ProjectService`, `sqlalchemy_ext_asyncio`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `phase2_common.py`, `User`, `endpoints/auth.py`, `ResourceService`, `test_auth_password_recovery.py`, `timedelta`, `ForbiddenException`, `test_user_profile_settings.py`, `auth_service.py`, `security.py`, `BadRequestException`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _355 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06062271062271062 - nodes in this community are weakly interconnected._