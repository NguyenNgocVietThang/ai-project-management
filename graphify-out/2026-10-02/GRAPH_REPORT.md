# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-01)

## Corpus Check
- 434 files · ~236,816 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3536 nodes · 10298 edges · 153 communities (129 shown, 9 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `52a40863`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- FakeSocket
- react
- db/base.py
- endpoints/auth.py
- lucide-react
- FastAPI
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- getApiErrorMessage
- ws_manager.py
- Chi tiết các Giai đoạn đã hoàn thành
- RiskWidget.tsx
- ai_tasks.py
- portfolios/[id]/page.tsx
- NotificationService
- projects/page.tsx
- tasks/page.tsx
- ws/chat.py
- users.py
- list_portfolios
- dashboard.types.ts
- useNotifications.ts
- get_redis
- test_resource_recommender.py
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- pytest
- PageState.tsx
- wbs.py
- AuthService
- WBSService
- config.ts
- as_user
- package.json
- tasks.py
- ForbiddenException
- TaskService
- test_route_exposure.py
- rate_limit.py
- Role
- BadRequestException
- run_risk_analysis
- auth_service.py
- main.py
- project_service.py
- test_oauth_account_takeover.py
- list_projects
- oauth_exchange.py
- api.ts
- dashboard_service.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- oauth.py
- typing
- Project
- test_admin_roles.py
- User
- Thiết kế kiến trúc hệ thống
- milestones.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- login/page.tsx
- get_chat_history
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- AdminUserService
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- endpoints/ai.py
- AuditLog
- test_resource_warnings.py
- app/layout.tsx
- AGENTS.md
- chat_service.py
- test_ws_hardening.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- Chi tiết các Giai đoạn
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
- ConflictException
- ProjectRepository
- date_utils.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_chat_service.py
- report_tasks.py
- next.config.js
- conftest.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- _persist_plan
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- Triển khai bản thử nghiệm trên Oracle Cloud Always Free
- middleware.ts
- schemas/task.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- change_requests.py
- get_current_active_superuser
- playwright
- alembic
- get_critical_path
- get_redis_pubsub
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- ApprovalStatus
- vitest.config.mts
- resource_leveling
- DocumentType
- EmailStatus
- health_check
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- tailwind.config.ts
- 1. Tổng quan dự án
- next-env.d.ts
- Kết quả rà soát
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- 11. Cài đặt và Chạy hệ thống
- Chi tiết các Giai đoạn đã hoàn thành
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- run_impact_analysis
- utils/cpm.py
- 3. Ngăn xếp công nghệ

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
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `AIService` --uses--> `ForbiddenException`  [INFERRED]
  backend/app/services/ai_service.py → backend/app/core/exceptions.py
- `AIService` --uses--> `NotFoundException`  [INFERRED]
  backend/app/services/ai_service.py → backend/app/core/exceptions.py
- `AIService` --uses--> `ChangeRequest`  [INFERRED]
  backend/app/services/ai_service.py → backend/app/models/change_request.py
- `AIService` --uses--> `Task`  [INFERRED]
  backend/app/services/ai_service.py → backend/app/models/task.py

## Import Cycles
- None detected.

## Communities (153 total, 9 thin omitted)

### Community 1 - "react"
Cohesion: 0.07
Nodes (51): Alert(), AlertProps, VARIANT_CLASSES, Button, ButtonProps, VARIANT_CLASSES, Input, InputProps (+43 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (40): get_client_ip(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Approval, Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment (+32 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.05
Nodes (81): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+73 more)

### Community 4 - "lucide-react"
Cohesion: 0.07
Nodes (40): DashboardPage(), ProjectOverviewPage(), TaskCard(), MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, Spinner() (+32 more)

### Community 5 - "FastAPI"
Cohesion: 0.05
Nodes (61): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, create_role(), delete_role(), get_role() (+53 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.10
Nodes (21): Portfolio, PortfolioStatus, str, PortfolioRepository, AsyncSession, datetime, PortfolioBase, PortfolioCapabilities (+13 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (49): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+41 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.16
Nodes (17): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+9 more)

### Community 9 - "getApiErrorMessage"
Cohesion: 0.08
Nodes (29): VerificationState, VerifyEmailContent(), verify(), AIInsightsPage(), TimesheetPage(), AIGeneratorModal(), STATUS_LABEL, mocks (+21 more)

### Community 10 - "ws_manager.py"
Cohesion: 0.29
Nodes (7): publish(), publish_many(), Any, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, json

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.06
Nodes (60): AIJobResponse, AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, AIJobResponse, ImpactReportResponse (+52 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.09
Nodes (38): PortfolioDetailPage(), PortfoliosPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectSettingsPage(), Modal(), ModalProps (+30 more)

### Community 15 - "NotificationService"
Cohesion: 0.09
Nodes (31): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+23 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.11
Nodes (33): ProjectMembersPage(), ProjectsPage(), portfolioKeys, InviteMemberDialog(), InitialProjectMember, ProjectWizard(), useAddProjectMember(), useAssignableRoles() (+25 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.06
Nodes (61): KanbanColumn(), SprintView(), STATUSES, TasksPage(), TaskTable(), ViewMode, DeletePhaseDialog(), Editor (+53 more)

### Community 18 - "ws/chat.py"
Cohesion: 0.11
Nodes (25): asyncio, chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu… (+17 more)

### Community 19 - "users.py"
Cohesion: 0.09
Nodes (43): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+35 more)

### Community 20 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 21 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (31): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+23 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (20): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+12 more)

### Community 23 - "get_redis"
Cohesion: 0.06
Nodes (43): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+35 more)

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

### Community 28 - "pytest"
Cohesion: 0.09
Nodes (44): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+36 more)

### Community 29 - "PageState.tsx"
Cohesion: 0.11
Nodes (25): EmptyState(), LoadingState(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList(), STATUS_CLASSES (+17 more)

### Community 30 - "wbs.py"
Cohesion: 0.07
Nodes (59): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+51 more)

### Community 31 - "AuthService"
Cohesion: 0.13
Nodes (10): AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đổi một refresh token lấy một cặp token mới, xoay vòng token cũ ra. Mỗi refresh… (+2 more)

### Community 32 - "WBSService"
Cohesion: 0.11
Nodes (14): str, SprintStatus, MilestoneCreate, MilestoneUpdate, get_project_context(), AsyncSession, require_project_roles(), get_wbs_service() (+6 more)

### Community 33 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (26): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+18 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, axios (+21 more)

### Community 36 - "tasks.py"
Cohesion: 0.15
Nodes (24): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+16 more)

### Community 37 - "ForbiddenException"
Cohesion: 0.10
Nodes (25): AIResultResponse, Assignment, get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException, NotFoundException, ResourceWarning, WorklogProjectSummary (+17 more)

### Community 38 - "TaskService"
Cohesion: 0.07
Nodes (43): NotificationType, str, str, TaskPriority, DependencyResponse, TaskDetailResponse, TaskResponse, TaskStatusUpdate (+35 more)

### Community 39 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 40 - "rate_limit.py"
Cohesion: 0.15
Nodes (16): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+8 more)

### Community 41 - "Role"
Cohesion: 0.14
Nodes (9): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission, Role, AsyncSession, Role, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là… (+1 more)

### Community 42 - "BadRequestException"
Cohesion: 0.08
Nodes (30): BadRequestException, code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt… (+22 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.13
Nodes (31): str, RiskLevel, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score(), _normalize_level() (+23 more)

### Community 44 - "auth_service.py"
Cohesion: 0.16
Nodes (30): hash_password(), verify_password(), build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified() (+22 more)

### Community 45 - "main.py"
Cohesion: 0.14
Nodes (20): set_request_id(), close_redis(), Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), Task nền chạy dài (được khởi động trong lifespan của FastAPI): subscribe mọi…, redis_listener() (+12 more)

### Community 46 - "project_service.py"
Cohesion: 0.17
Nodes (21): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate (+13 more)

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "oauth_exchange.py"
Cohesion: 0.50
Nodes (4): _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem()

### Community 50 - "api.ts"
Cohesion: 0.05
Nodes (71): AuthLayout(), OAuthCallbackContent(), AdminLayout(), TABS, DashboardLayout(), ProfilePageContent(), FullPageSpinner(), Brand() (+63 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 52 - "Task"
Cohesion: 0.12
Nodes (19): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.27
Nodes (20): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+12 more)

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
Nodes (63): ABC, Leave, LeaveStatus, LeaveType, str, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider. (+55 more)

### Community 58 - "Project"
Cohesion: 0.09
Nodes (36): set_current_project_id(), Dependency, Project, Worklog, datetime, CPMResponse, CPMTask, BaseModel (+28 more)

### Community 59 - "test_admin_roles.py"
Cohesion: 0.53
Nodes (11): RoleUpdate, build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role(), test_delete_role_blocks_when_users_still_assigned() (+3 more)

### Community 60 - "User"
Cohesion: 0.11
Nodes (11): User, AsyncSession, UserRepository, ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, Depends (+3 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.23
Nodes (11): apply(), systemPrefersDark(), Status(), ThemeContext, ThemeContextValue, themeInitScript, ThemePreference, ThemeProvider() (+3 more)

### Community 65 - "login/page.tsx"
Cohesion: 0.17
Nodes (6): metadata, LoginPageProps, metadata, metadata, next, ref_next_intl_server

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
Cohesion: 0.11
Nodes (30): TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.… (+22 more)

### Community 70 - "AdminUserService"
Cohesion: 0.07
Nodes (47): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, AdminUserCreate, AdminUserUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate. (+39 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (24): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, post (+16 more)

### Community 74 - "AuditLog"
Cohesion: 0.18
Nodes (14): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới. (+6 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "app/layout.tsx"
Cohesion: 0.23
Nodes (7): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), notifyError(), sonner

### Community 78 - "chat_service.py"
Cohesion: 0.14
Nodes (19): ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án. (+11 more)

### Community 79 - "test_ws_hardening.py"
Cohesion: 0.13
Nodes (20): issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis (+12 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.16
Nodes (24): ChangeRequest, CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService (+16 more)

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

### Community 93 - "ConflictException"
Cohesion: 0.07
Nodes (28): ConflictException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, UnprocessableException, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), ChangePasswordRequest (+20 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.11
Nodes (8): BaseRepository, Any, AsyncSession, ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 95 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_chat_service.py"
Cohesion: 0.45
Nodes (10): build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes(), test_history_no_more_pages_when_under_limit(), test_history_rejects_non_member(), test_history_returns_items_in_chronological_order_and_flags_more(), test_mark_read_creates_state_when_absent() (+2 more)

### Community 98 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "conftest.py"
Cohesion: 0.15
Nodes (18): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+10 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "_persist_plan"
Cohesion: 0.23
Nodes (11): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+3 more)

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

### Community 108 - "schemas/task.py"
Cohesion: 0.06
Nodes (38): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+30 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "change_requests.py"
Cohesion: 0.36
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 111 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 115 - "get_redis_pubsub"
Cohesion: 0.67
Nodes (3): get_redis_pubsub(), Client riêng cho `pubsub.listen()` trong ws_manager.py. Không được dùng chung…, Redis

### Community 116 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 122 - "health_check"
Cohesion: 0.67
Nodes (3): health_check(), get, Tình trạng sẵn sàng, bao gồm cả các phụ thuộc. Kiểm tra thật sự chạm tới…

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 126 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

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

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 161 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.06
Nodes (73): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+65 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

## Knowledge Gaps
- **382 isolated node(s):** `mocks`, `Props`, `WSClientOptions`, `LoginPageProps`, `AlertProps` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `ai_tasks.py`, `ws/chat.py`, `users.py`, `list_portfolios`, `pytest`, `AuthService`, `WBSService`, `as_user`, `utils/cpm.py`, `ForbiddenException`, `TaskService`, `Role`, `BadRequestException`, `auth_service.py`, `project_service.py`, `test_oauth_account_takeover.py`, `list_projects`, `dashboard_service.py`, `typing`, `Project`, `AdminUserService`, `endpoints/ai.py`, `chat_service.py`, `test_change_request_service.py`, `ConflictException`, `ProjectRepository`, `conftest.py`, `schemas/task.py`, `get_current_active_superuser`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `BadRequestException` connect `BadRequestException` to `WBSService`, `db/base.py`, `utils/cpm.py`, `FastAPI`, `AdminUserService`, `portfolio_service.py`, `ForbiddenException`, `TaskService`, `_persist_plan`, `auth_service.py`, `ai_tasks.py`, `project_service.py`, `oauth.py`, `User`, `ConflictException`, `AuthService`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Task` connect `Task` to `WBSService`, `run_impact_analysis`, `db/base.py`, `utils/cpm.py`, `ForbiddenException`, `TaskService`, `TaskStatus`, `run_risk_analysis`, `schemas/task.py`, `ai_tasks.py`, `dashboard_service.py`, `test_resource_recommender.py`, `typing`, `Project`, `ProjectRepository`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `mocks`, `Props`, `WSClientOptions` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07332421340629275 - nodes in this community are weakly interconnected._