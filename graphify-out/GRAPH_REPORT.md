# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-13)

## Corpus Check
- 391 files · ~134,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3127 nodes · 8429 edges · 173 communities (134 shown, 10 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 649 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca85be49`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getApiErrorMessage
- Button.tsx
- db/base.py
- endpoints/auth.py
- api.ts
- FastAPI
- portfolio_service.py
- users/page.tsx
- TaskStatus
- test_cpm_scheduling.py
- oauth_service.py
- main.py
- task_service.py
- ValueError
- portfolios/[id]/page.tsx
- User
- wbs_service.py
- useTasks.ts
- react
- users.py
- NotificationService
- tasks/page.tsx
- models/project.py
- test_login_lockout.py
- lucide-react
- UserService
- AITaskType
- compilerOptions
- milestones.py
- AdminUserService
- test_access_token_revocation.py
- ProjectService
- TaskService
- test_ws_hardening.py
- conftest.py
- package.json
- dashboard_service.py
- tasks.py
- Settings
- roles.py
- AuthService
- list_projects
- BadRequestException
- PaginatedResponse
- timedelta
- ProjectRepository
- utils/cpm.py
- useAIGenerator.ts
- project_service.py
- parse_json_object
- ChatPanel.tsx
- list_portfolios
- .create_worklog
- test_user_profile_settings.py
- dependencies
- devDependencies
- get_wbs_service
- get_critical_path
- ConnectionManager
- Role
- create_dependency
- SchedulingService
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- endpoints/ai.py
- logging_config.py
- worklogs.py
- oauth.py
- ai_tasks.py
- test_route_exposure.py
- notification_tasks.py
- System Architecture Design
- ForbiddenException
- phase2_common.py
- test_resource_warnings.py
- dashboard.types.ts
- epics.py
- get_chat_history
- create_refresh_token
- test_notification_triggers.py
- my_assignments
- Software Requirements Specification (SRS)
- approvals.py
- change_requests.py
- test_portfolio_project_core.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Chi tiết các Giai đoạn đã hoàn thành
- Task
- LanguageToggle.tsx
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- search_users
- 3. Yêu cầu chức năng (Functional Requirements)
- rate_limit_exceeded_handler
- token_revocation.py
- scripts
- Chi tiết kế hoạch triển khai
- require_permissions
- middleware.ts
- schemas/gantt.py
- Chi tiết các Giai đoạn
- Chi tiết các Giai đoạn
- chat_service.py
- playwright
- .eslintrc.json
- tailwind.config.ts
- next-env.d.ts
- get_redis
- Findings
- 11. Cài đặt và Chạy hệ thống
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- resource_leveling
- 3. Technology Stack
- ProjectCreate
- generate_project_from_prompt
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- list_audit_logs
- get_current_user
- add_working_days
- BaseAIProvider
- test_large_projects_recalculate_in_the_background
- forgot-password/page.tsx
- CLAUDE.md
- env.py
- validate_password_policy
- .broadcast_local
- ai_request.py
- health_check
- BaseModel
- Any
- AsyncSession
- Depends
- asyncio

## God Nodes (most connected - your core abstractions)
1. `User` - 201 edges
2. `ForbiddenException` - 71 edges
3. `Base` - 68 edges
4. `WBSService` - 67 edges
5. `TaskService` - 65 edges
6. `BadRequestException` - 60 edges
7. `NotFoundException` - 52 edges
8. `ProjectService` - 52 edges
9. `react` - 49 edges
10. `lucide-react` - 48 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `generate_project_from_prompt()` --calls--> `wrap_user_input()`  [INFERRED]
  backend/app/services/ai/project_generator.py → backend/app/services/ai/parsing.py
- `_run_generation()` --calls--> `AIOutput`  [INFERRED]
  backend/app/workers/ai_tasks.py → backend/app/models/ai_output.py
- `_run_generation()` --calls--> `resolve_model()`  [INFERRED]
  backend/app/workers/ai_tasks.py → backend/app/services/ai/model_router.py
- `_persist_plan()` --calls--> `BadRequestException`  [INFERRED]
  backend/app/workers/ai_tasks.py → backend/app/core/exceptions.py

## Import Cycles
- None detected.

## Communities (173 total, 10 thin omitted)

### Community 0 - "getApiErrorMessage"
Cohesion: 0.09
Nodes (28): VerificationState, VerifyEmailContent(), verify(), AdminAuditPage(), TimesheetPage(), ErrorState(), AIGeneratorModal(), STATUS_LABEL (+20 more)

### Community 1 - "Button.tsx"
Cohesion: 0.06
Nodes (63): LoginPageProps, metadata, MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps, VARIANT_CLASSES, Button (+55 more)

### Community 2 - "db/base.py"
Cohesion: 0.07
Nodes (31): AIOutput, AIRequest, Approval, ApprovalStatus, str, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,… (+23 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.05
Nodes (89): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+81 more)

### Community 4 - "api.ts"
Cohesion: 0.06
Nodes (48): AuthLayout(), OAuthCallbackContent(), AdminLayout(), TABS, DashboardLayout(), ProfilePageContent(), FullPageSpinner(), LINKS (+40 more)

### Community 5 - "FastAPI"
Cohesion: 0.08
Nodes (27): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles() (+19 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.11
Nodes (20): Portfolio, PortfolioStatus, str, PortfolioRepository, AsyncSession, PortfolioBase, PortfolioCapabilities, PortfolioCreate (+12 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (45): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+37 more)

### Community 8 - "TaskStatus"
Cohesion: 0.07
Nodes (41): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email() (+33 more)

### Community 9 - "test_cpm_scheduling.py"
Cohesion: 0.23
Nodes (21): compute_cpm(), CPMEdge, CPMNode, Thuật toán Kahn cho topological sort. Ném ValueError nếu có chu trình. Dùng…, Chạy toàn bộ phân tích CPM (topological sort + forward pass + backward pass)…, Điểm vào tương thích ngược: chạy CPM chỉ dùng các quan hệ FS (Finish-to-Start,…, run_cpm(), topological_sort() (+13 more)

### Community 10 - "oauth_service.py"
Cohesion: 0.13
Nodes (18): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt. `lax` chứ không… (+10 more)

### Community 11 - "main.py"
Cohesion: 0.15
Nodes (18): set_request_id(), close_redis(), Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Task nền chạy dài (được khởi động trong lifespan của FastAPI): subscribe mọi… (+10 more)

### Community 12 - "task_service.py"
Cohesion: 0.09
Nodes (38): Assignment, delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), Assignment (+30 more)

### Community 13 - "ValueError"
Cohesion: 0.13
Nodes (8): field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator, model_validator, ValueError

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.14
Nodes (26): PortfolioDetailPage(), PortfoliosPage(), Modal(), ModalProps, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioForm(), PortfolioFormProps (+18 more)

### Community 15 - "User"
Cohesion: 0.08
Nodes (21): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, str, SprintStatus (+13 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.09
Nodes (49): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+41 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (36): DeletePhaseDialog(), taskKeys, useInvalidate(), usePhaseImpact(), wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "react"
Cohesion: 0.12
Nodes (21): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+13 more)

### Community 19 - "users.py"
Cohesion: 0.23
Nodes (14): change_password(), connect_social_account(), deactivate_account(), disconnect_social_account(), get_avatar(), CurrentUser, delete, OAuthServiceDep (+6 more)

### Community 20 - "NotificationService"
Cohesion: 0.07
Nodes (46): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+38 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.05
Nodes (56): ProjectChatPage(), ProjectLayout(), ProjectMembersPage(), ProjectSettingsPage(), KanbanColumn(), SprintView(), STATUSES, TaskCard() (+48 more)

### Community 22 - "models/project.py"
Cohesion: 0.10
Nodes (23): ChangeRequest, CRStatus, str, Document, DocumentType, str, Epic, Milestone (+15 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (24): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+16 more)

### Community 24 - "lucide-react"
Cohesion: 0.08
Nodes (39): DashboardPage(), greeting(), ProjectOverviewPage(), TaskTable(), ProjectsPage(), Avatar(), AvatarProps, EmptyState() (+31 more)

### Community 25 - "UserService"
Cohesion: 0.18
Nodes (11): ServiceUnavailableException, ChangePasswordRequest, DeleteAccountRequest, BaseModel, field_validator, UserBase, UserCreate, UserResponse (+3 more)

### Community 26 - "AITaskType"
Cohesion: 0.20
Nodes (11): AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm…, Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI., Trả về tên model xKiro (dạng "vendor/model") được cấu hình cho một loại tác vụ., Trả về toàn bộ bảng định tuyến task -> model hiện hành, dùng để log/kiểm tra., resolve_model() (+3 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 29 - "AdminUserService"
Cohesion: 0.16
Nodes (29): AdminUserCreate, AdminUserResponse, AdminUserUpdate, AdminUserService, PaginatedResponse, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài… (+21 more)

### Community 30 - "test_access_token_revocation.py"
Cohesion: 0.19
Nodes (17): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết…, _utcnow() (+9 more)

### Community 31 - "ProjectService"
Cohesion: 0.20
Nodes (6): ProjectMemberResponse, ProjectService, date, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 32 - "TaskService"
Cohesion: 0.09
Nodes (24): DependencyType, str, str, SubtaskStatus, TaskPriority, TaskDetailResponse, TaskResponse, get_project_context() (+16 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (41): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+33 more)

### Community 34 - "conftest.py"
Cohesion: 0.08
Nodes (43): AsyncClient, as_user(), client(), _disable_rate_limiting(), engine(), event_loop(), make_user(), AsyncSession (+35 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, clsx (+21 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 37 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "Settings"
Cohesion: 0.19
Nodes (12): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+4 more)

### Community 39 - "roles.py"
Cohesion: 0.17
Nodes (19): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+11 more)

### Community 40 - "AuthService"
Cohesion: 0.15
Nodes (9): TooManyRequestsException, AuthService, AsyncSession, datetime, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+1 more)

### Community 41 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 42 - "BadRequestException"
Cohesion: 0.20
Nodes (10): BadRequestException, UnauthorizedException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, User (+2 more)

### Community 43 - "PaginatedResponse"
Cohesion: 0.18
Nodes (15): AuditLogResponse, IDResponse, PaginatedResponse, BaseModel, AuditService, get_audit_service(), AsyncSession, datetime (+7 more)

### Community 44 - "timedelta"
Cohesion: 0.30
Nodes (15): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+7 more)

### Community 45 - "ProjectRepository"
Cohesion: 0.11
Nodes (7): ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., get_project_service(), AsyncSession, Depends

### Community 46 - "utils/cpm.py"
Cohesion: 0.15
Nodes (19): backward_pass(), build_graph(), compute_cpm_for_project(), CPMResult, _edges_by_predecessor(), _edges_by_successor(), forward_pass(), _normalize_type() (+11 more)

### Community 47 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 48 - "project_service.py"
Cohesion: 0.32
Nodes (15): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse (+7 more)

### Community 49 - "parse_json_object"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (22): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+14 more)

### Community 51 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 52 - ".create_worklog"
Cohesion: 0.17
Nodes (7): Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc…, AsyncSession, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), recalculate_task_hours(), Worklog

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 57 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 58 - "ConnectionManager"
Cohesion: 0.30
Nodes (11): ConnectionManager, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:…, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel() (+3 more)

### Community 59 - "Role"
Cohesion: 0.13
Nodes (27): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission, Role, AuditActorSummary, PermissionResponse, BaseModel (+19 more)

### Community 60 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 61 - "SchedulingService"
Cohesion: 0.25
Nodes (8): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), Depends, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService

### Community 62 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.17
Nodes (12): metadata, viewport, Providers(), apply(), systemPrefersDark(), ThemeContext, ThemeContextValue, themeInitScript (+4 more)

### Community 65 - "endpoints/ai.py"
Cohesion: 0.10
Nodes (34): AIJobResponse, AIResultResponse, AIServiceDep, asyncio, AsyncSession, generate_project(), get_ai_job(), CurrentUser (+26 more)

### Community 66 - "logging_config.py"
Cohesion: 0.25
Nodes (8): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, LogRecord

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (20): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+12 more)

### Community 68 - "oauth.py"
Cohesion: 0.19
Nodes (21): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+13 more)

### Community 69 - "ai_tasks.py"
Cohesion: 0.13
Nodes (19): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), optimize_schedule_task(), parse_document_task(), Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho…, SOP-AI-001: Tạo kế hoạch dự án (Project + Phase + Task + Dependency) từ prompt…, SOP-AI-002: Phân tích tác động của một change request. (+11 more)

### Community 70 - "test_route_exposure.py"
Cohesion: 0.14
Nodes (16): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+8 more)

### Community 71 - "notification_tasks.py"
Cohesion: 0.26
Nodes (10): AsyncSession, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), asyncio (+2 more)

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 73 - "ForbiddenException"
Cohesion: 0.12
Nodes (12): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException (+4 more)

### Community 74 - "phase2_common.py"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (26): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, MyTasksListProps (+18 more)

### Community 77 - "epics.py"
Cohesion: 0.24
Nodes (14): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+6 more)

### Community 78 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 79 - "create_refresh_token"
Cohesion: 0.34
Nodes (13): create_refresh_token(), build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token. (+5 more)

### Community 80 - "test_notification_triggers.py"
Cohesion: 0.32
Nodes (13): TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged() (+5 more)

### Community 81 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 82 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "change_requests.py"
Cohesion: 0.14
Nodes (14): create_change_requests(), delete_change_requests(), get_change_requests(), list_change_requests(), delete, get, post, put (+6 more)

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

### Community 94 - "Task"
Cohesion: 0.08
Nodes (15): Project, Task, BaseRepository, Any, AsyncSession, datetime, datetime, AsyncSession (+7 more)

### Community 95 - "LanguageToggle.tsx"
Cohesion: 0.36
Nodes (7): LanguageToggle(), setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

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

### Community 100 - "search_users"
Cohesion: 0.23
Nodes (12): list_users(), ge, get, le, limit, Query, Request, UploadFile (+4 more)

### Community 101 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 102 - "rate_limit_exceeded_handler"
Cohesion: 0.28
Nodes (9): client_key(), Request, Response, rate_limit_exceeded_handler(), Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, _retry_after_seconds() (+1 more)

### Community 103 - "token_revocation.py"
Cohesion: 0.23
Nodes (9): is_revoked(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke(), _ttl_seconds() (+1 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "require_permissions"
Cohesion: 0.35
Nodes (11): AdminUserServiceDep, create_user(), deactivate_user(), get_user(), Depends, patch, post, reactivate_user() (+3 more)

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
Cohesion: 0.16
Nodes (24): ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án., ChatService, get_chat_service() (+16 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 145 - "get_redis"
Cohesion: 0.24
Nodes (10): get_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, _pending_key(), Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session() (+2 more)

### Community 146 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 149 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 152 - "generate_project_from_prompt"
Cohesion: 0.29
Nodes (7): Any, generate_project_from_prompt(), get_ai_provider(), SOP-AI-001: Bộ sinh dự án bằng AI, xKiro là provider AI duy nhất được hỗ trợ (gộp nhiều model miễn phí sau 1 API…, Sinh cấu trúc dự án đầy đủ từ một prompt ngôn ngữ tự nhiên. Bên gọi vẫn phải…, XkiroProvider

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-03)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 157 - "get_current_user"
Cohesion: 0.29
Nodes (8): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các…, oauth2_scheme

### Community 158 - "add_working_days"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 159 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 160 - "test_large_projects_recalculate_in_the_background"
Cohesion: 0.29
Nodes (7): asyncio, Một lần kéo thả trên dự án vài nghìn task không nên kéo theo hàng nghìn lệnh…, force_sync là đường mà worker dùng; thiếu nó thì nó tự đẩy việc cho chính mình…, Engine da hoan chinh tu Phase 2 nhung chua tung duoc expose: client khong co…, test_large_projects_recalculate_in_the_background(), test_the_cpm_endpoint_reports_float_and_the_critical_chain(), test_the_worker_itself_never_re_enqueues()

### Community 161 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 163 - "env.py"
Cohesion: 0.47
Nodes (4): do_run_migrations(), run_async_migrations(), run_migrations_online(), Connection

### Community 164 - "validate_password_policy"
Cohesion: 0.40
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 166 - "ai_request.py"
Cohesion: 0.67
Nodes (3): AIRequestStatus, AIRequestType, str

### Community 167 - "health_check"
Cohesion: 0.67
Nodes (3): health_check(), get, Tình trạng sẵn sàng, bao gồm cả các phụ thuộc. Kiểm tra thật sự chạm tới…

## Knowledge Gaps
- **323 isolated node(s):** `5 Trụ cột AI chính:`, `Hiện trạng & Hạ tầng sẵn có`, `Danh mục tính năng triển khai theo Phase`, `GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure`, `GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001)` (+318 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1063 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `oauth_service.py`, `task_service.py`, `wbs_service.py`, `users.py`, `models/project.py`, `UserService`, `list_audit_logs`, `get_current_user`, `test_access_token_revocation.py`, `AdminUserService`, `TaskService`, `test_ws_hardening.py`, `ProjectService`, `conftest.py`, `dashboard_service.py`, `roles.py`, `AuthService`, `list_projects`, `BadRequestException`, `PaginatedResponse`, `timedelta`, `ProjectRepository`, `project_service.py`, `list_portfolios`, `.create_worklog`, `Role`, `SchedulingService`, `endpoints/ai.py`, `ForbiddenException`, `phase2_common.py`, `Task`, `test_oauth_account_takeover.py`, `search_users`, `token_revocation.py`, `require_permissions`, `chat_service.py`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `task_service.py`, `User`, `NotificationService`, `AdminUserService`, `test_access_token_revocation.py`, `ProjectService`, `TaskService`, `test_ws_hardening.py`, `dashboard_service.py`, `roles.py`, `AuthService`, `project_service.py`, `.create_worklog`, `Role`, `endpoints/ai.py`, `test_route_exposure.py`, `phase2_common.py`, `require_permissions`, `chat_service.py`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `dashboard_service.py` to `db/base.py`, `portfolio_service.py`, `TaskStatus`, `ForbiddenException`, `phase2_common.py`, `task_service.py`, `User`, `project_service.py`, `Task`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 46 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 46 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `5 Trụ cột AI chính:`, `Hiện trạng & Hạ tầng sẵn có`, `Danh mục tính năng triển khai theo Phase` to the rest of the system?**
  _323 weakly-connected nodes found - possible documentation gaps or missing edges._