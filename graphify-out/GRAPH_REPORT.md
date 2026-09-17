# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-17)

## Corpus Check
- 434 files · ~157,515 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3456 nodes · 9664 edges · 166 communities (131 shown, 6 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d962de85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- react
- db/base.py
- refresh_token
- api.ts
- generate_resource_recommendation
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- projects/page.tsx
- get_redis
- Chi tiết các Giai đoạn đã hoàn thành
- resource_service.py
- resource_recommender.py
- getApiErrorMessage
- WBSService
- wbs_service.py
- useTasks.ts
- api.types.ts
- require_permissions
- NotificationService
- tasks/page.tsx
- test_auth_password_recovery.py
- test_login_lockout.py
- models/task.py
- test_route_exposure.py
- ai_tasks.py
- compilerOptions
- milestones.py
- AdminUserService
- auth_service.py
- endpoints/ai.py
- ForbiddenException
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- tasks.py
- list_portfolios
- FastAPI
- AuthService
- ProjectService
- BadRequestException
- AuditService
- timedelta
- conftest.py
- User
- WBSServiceDep
- list_projects
- schedule_optimizer.py
- ChatPanel.tsx
- Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- Task
- users.py
- dependencies
- devDependencies
- PageState.tsx
- test_audit_regressions.py
- ws_manager.py
- RoleService
- get_current_user
- System Architecture Design
- WBSServiceDep
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- wrap_user_input
- logging_config.py
- worklogs.py
- lucide-react
- phase2_common.py
- Chi tiết các Giai đoạn đã hoàn thành
- endpoints/auth.py
- Software Requirements Specification (SRS)
- ResourceService
- AuditLog
- test_resource_warnings.py
- BurndownChart.tsx
- AGENTS.md
- chat_service.py
- Chi tiết kế hoạch triển khai
- 3. Yêu cầu chức năng (Functional Requirements)
- create_epic
- Chi tiết các Giai đoạn
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
- Chi tiết các Giai đoạn
- Project
- list_notifications
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- config.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- LanguageToggle.tsx
- PortfolioRepository
- scripts
- useAIGenerator.ts
- subtasks.py
- middleware.ts
- schemas/gantt.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- get_chat_history
- ChatService
- playwright
- .eslintrc.json
- Findings
- next-env.d.ts
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- get_wbs_service
- 11. Cài đặt và Chạy hệ thống
- FakeSocket
- scheduling_service.py
- 3. Technology Stack
- risk_analyzer.py
- tailwind.config.ts
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- get_critical_path
- CLAUDE.md
- test_cpm_scheduling.py
- test_ai_service.py
- ws/chat.py
- StorageService
- forgot-password/page.tsx
- resource_leveling

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
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py
- `register()` --uses--> `RegisterRequest`  [INFERRED]
  backend/app/api/v1/endpoints/auth.py → backend/app/schemas/auth.py
- `login()` --uses--> `AccessTokenResponse`  [INFERRED]
  backend/app/api/v1/endpoints/auth.py → backend/app/schemas/auth.py

## Import Cycles
- None detected.

## Communities (166 total, 6 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (63): LoginPageProps, metadata, MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps, VARIANT_CLASSES, Avatar() (+55 more)

### Community 2 - "db/base.py"
Cohesion: 0.08
Nodes (26): Approval, ApprovalStatus, str, Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment (+18 more)

### Community 3 - "refresh_token"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "api.ts"
Cohesion: 0.08
Nodes (35): VerificationState, ProfilePageContent(), EmailVerificationBanner(), EmailVerificationBannerProps, AvatarSectionProps, DangerZoneSection(), LinkedAccountsSection(), LinkedAccountsSectionProps (+27 more)

### Community 5 - "generate_resource_recommendation"
Cohesion: 0.21
Nodes (21): _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.… (+13 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.14
Nodes (17): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+9 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (57): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+49 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.11
Nodes (22): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+14 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.08
Nodes (48): ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectMembersPage(), ProjectSettingsPage(), TimesheetPage(), ProjectsPage(), useChatUnreadCount() (+40 more)

### Community 10 - "get_redis"
Cohesion: 0.08
Nodes (44): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+36 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "resource_service.py"
Cohesion: 0.08
Nodes (41): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+33 more)

### Community 13 - "resource_recommender.py"
Cohesion: 0.09
Nodes (28): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+20 more)

### Community 14 - "getApiErrorMessage"
Cohesion: 0.13
Nodes (29): VerifyEmailContent(), verify(), PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps (+21 more)

### Community 15 - "WBSService"
Cohesion: 0.11
Nodes (13): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, str, SprintStatus (+5 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.23
Nodes (19): DateRangeMixin, EpicCreate, EpicResponse, EpicUpdate, MilestoneResponse, PhaseCreate, PhaseDeleteImpact, PhaseNode (+11 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "api.types.ts"
Cohesion: 0.10
Nodes (26): AIInsightsPage(), ResourceRecommendationPanel(), ResourceRecommendationPanelProps, useRequestResourceRecommendation(), useResourceRecommendationJob(), isRiskLevel(), parseRiskResult(), RiskWidget() (+18 more)

### Community 19 - "require_permissions"
Cohesion: 0.08
Nodes (43): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+35 more)

### Community 20 - "NotificationService"
Cohesion: 0.11
Nodes (28): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, NotificationType (+20 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.04
Nodes (66): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage() (+58 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.24
Nodes (16): build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật…, test_expired_token_uses_same_error_as_unknown_token() (+8 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (24): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+16 more)

### Community 24 - "models/task.py"
Cohesion: 0.16
Nodes (6): Portfolio, BaseRepository, Any, AsyncSession, datetime, ModelType

### Community 25 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.08
Nodes (38): AIJobResponse, AIOutput, AIRequest, AIRequestType, AIJobResponse, ImpactReportResponse, BaseModel, BaseModel (+30 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 29 - "AdminUserService"
Cohesion: 0.06
Nodes (51): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), AdminUserCreate, AdminUserUpdate, field_validator (+43 more)

### Community 30 - "auth_service.py"
Cohesion: 0.09
Nodes (41): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+33 more)

### Community 31 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (24): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, post (+16 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.10
Nodes (35): AIResultResponse, ConflictException, ForbiddenException, NotFoundException, DependencyType, str, str, SubtaskStatus (+27 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.13
Nodes (19): issue(), _key(), Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., FakeRedis, asyncio, Ba lỗi ở tầng WebSocket, kiểm tra cùng nhau vì chúng nằm chung một đường. * JWT…, Một bản dump key Redis không được trao ra những vé còn dùng được. (+11 more)

### Community 34 - "as_user"
Cohesion: 0.15
Nodes (24): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, asyncio, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin., CurrentVerifiedUser chi duoc dung o 2/40+ route truoc day, nen luong xac minh… (+16 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, clsx (+21 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 37 - "tasks.py"
Cohesion: 0.15
Nodes (24): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+16 more)

### Community 38 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 39 - "FastAPI"
Cohesion: 0.06
Nodes (52): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, create_role(), delete_role(), get_role() (+44 more)

### Community 40 - "AuthService"
Cohesion: 0.15
Nodes (9): TooManyRequestsException, AuthService, AsyncSession, datetime, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+1 more)

### Community 41 - "ProjectService"
Cohesion: 0.16
Nodes (24): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+16 more)

### Community 42 - "BadRequestException"
Cohesion: 0.08
Nodes (22): BadRequestException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`. (+14 more)

### Community 43 - "AuditService"
Cohesion: 0.29
Nodes (9): AuditService, get_audit_service(), AsyncSession, Depends, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio, test_list_maps_rows_with_actor() (+1 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "conftest.py"
Cohesion: 0.20
Nodes (14): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+6 more)

### Community 46 - "User"
Cohesion: 0.09
Nodes (10): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., User, AsyncSession, UserRepository, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec… (+2 more)

### Community 47 - "WBSServiceDep"
Cohesion: 0.19
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "schedule_optimizer.py"
Cohesion: 0.16
Nodes (28): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, SOP-AI-003: Đề xuất tối ưu lịch trình bằng AI (fast-track / crash / cân bằng… (+20 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.08
Nodes (32): AuthLayout(), OAuthCallbackContent(), AIGeneratorModal(), STATUS_LABEL, mocks, useAIJob(), useGenerateProject(), Props (+24 more)

### Community 51 - "Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Checkpoint: 4 trụ cột backend/frontend cô lập xong, Checkpoint: Tích hợp hoàn chỉnh, Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 52 - "Task"
Cohesion: 0.11
Nodes (19): Epic, Subtask, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 53 - "users.py"
Cohesion: 0.15
Nodes (31): # NOTE: các route này dùng path converter tường minh "{user_id:int}" (không phải, hash_password(), verify_password(), ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator (+23 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "PageState.tsx"
Cohesion: 0.11
Nodes (27): EmptyState(), LoadingState(), Spinner(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList() (+19 more)

### Community 57 - "test_audit_regressions.py"
Cohesion: 0.15
Nodes (23): set_current_project_id(), Worklog, AsyncSession, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., project_work() (+15 more)

### Community 58 - "ws_manager.py"
Cohesion: 0.18
Nodes (14): ConnectionManager, WebSocket, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio (+6 more)

### Community 59 - "RoleService"
Cohesion: 0.25
Nodes (16): RoleCreate, RoleUpdate, AsyncSession, Role, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db() (+8 more)

### Community 60 - "get_current_user"
Cohesion: 0.29
Nodes (8): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các…, oauth2_scheme

### Community 61 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 62 - "WBSServiceDep"
Cohesion: 0.23
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (17): metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status(), ThemeContext (+9 more)

### Community 65 - "wrap_user_input"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "lucide-react"
Cohesion: 0.09
Nodes (32): AdminLayout(), TABS, DashboardLayout(), NotificationsPage(), FullPageSpinner(), Brand(), LINKS, MainNav() (+24 more)

### Community 69 - "phase2_common.py"
Cohesion: 0.08
Nodes (45): str, TaskStatus, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, _apply_status_side_effects() (+37 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "endpoints/auth.py"
Cohesion: 0.28
Nodes (14): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+6 more)

### Community 72 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "ResourceService"
Cohesion: 0.14
Nodes (11): Assignment, get_resource_service(), AsyncSession, date, Depends, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc…, ResourceService (+3 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (16): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy… (+8 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 78 - "chat_service.py"
Cohesion: 0.13
Nodes (20): mark_chat_read(), post_chat_message(), CurrentVerifiedUser, limit, post, Request, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một… (+12 more)

### Community 79 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 80 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "create_epic"
Cohesion: 0.23
Nodes (12): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+4 more)

### Community 82 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.11
Nodes (34): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+26 more)

### Community 85 - "test_portfolio_project_core.py"
Cohesion: 0.41
Nodes (14): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_and_project_schema_validation() (+6 more)

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

### Community 93 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 94 - "Project"
Cohesion: 0.08
Nodes (13): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission, Project, Role, ProjectRepository, AsyncSession (+5 more)

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
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "config.py"
Cohesion: 0.10
Nodes (28): set_request_id(), client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực… (+20 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song), Task 1: Change Request CRUD tối giản, Task 2: AI Impact Analysis (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Risk Analysis (SOP-AI-005) — song song, sau Task 1 (+2 more)

### Community 102 - "LanguageToggle.tsx"
Cohesion: 0.36
Nodes (7): LanguageToggle(), setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 103 - "PortfolioRepository"
Cohesion: 0.24
Nodes (3): PortfolioRepository, AsyncSession, AsyncSession

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 106 - "subtasks.py"
Cohesion: 0.36
Nodes (7): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), SubtaskUpdate

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "get_chat_history"
Cohesion: 0.33
Nodes (7): get_chat_history(), get_chat_unread_count(), CurrentUser, ge, get, le, Query

### Community 111 - "ChatService"
Cohesion: 0.20
Nodes (17): ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatService, get_chat_service(), AsyncSession, Depends, build_actor(), build_message() (+9 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 125 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 149 - "scheduling_service.py"
Cohesion: 0.12
Nodes (32): Dependency, str, RiskLevel, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession (+24 more)

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "risk_analyzer.py"
Cohesion: 0.12
Nodes (33): str, RiskLevel, RiskReport, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score() (+25 more)

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
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 161 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 164 - "test_cpm_scheduling.py"
Cohesion: 0.08
Nodes (53): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService, backward_pass(), build_graph() (+45 more)

### Community 166 - "test_ai_service.py"
Cohesion: 0.41
Nodes (12): AIRequestStatus, str, ai_request(), db(), asyncio, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 167 - "ws/chat.py"
Cohesion: 0.11
Nodes (24): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+16 more)

### Community 168 - "StorageService"
Cohesion: 0.15
Nodes (8): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, get_user_service(), AsyncSession, Depends, Minio, StorageServiceDep

### Community 169 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 172 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

## Knowledge Gaps
- **376 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1162 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `generate_resource_recommendation`, `portfolio_service.py`, `resource_service.py`, `resource_recommender.py`, `WBSService`, `wbs_service.py`, `require_permissions`, `scheduling_service.py`, `models/task.py`, `ai_tasks.py`, `AdminUserService`, `auth_service.py`, `endpoints/ai.py`, `ForbiddenException`, `as_user`, `dashboard_service.py`, `test_cpm_scheduling.py`, `list_portfolios`, `FastAPI`, `ws/chat.py`, `ProjectService`, `AuthService`, `BadRequestException`, `timedelta`, `conftest.py`, `list_projects`, `users.py`, `test_audit_regressions.py`, `RoleService`, `get_current_user`, `phase2_common.py`, `ResourceService`, `chat_service.py`, `test_change_request_service.py`, `Project`, `test_oauth_account_takeover.py`, `ChatService`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `BadRequestException` connect `BadRequestException` to `ForbiddenException`, `portfolio_service.py`, `FastAPI`, `AuthService`, `ProjectService`, `get_redis`, `ResourceService`, `resource_service.py`, `User`, `WBSService`, `wbs_service.py`, `users.py`, `ai_tasks.py`, `AdminUserService`, `auth_service.py`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `portfolio_service.py`, `resource_service.py`, `WBSService`, `require_permissions`, `NotificationService`, `test_route_exposure.py`, `ai_tasks.py`, `AdminUserService`, `auth_service.py`, `dashboard_service.py`, `test_ai_service.py`, `ws/chat.py`, `FastAPI`, `AuthService`, `BadRequestException`, `ProjectService`, `User`, `RoleService`, `phase2_common.py`, `ResourceService`, `test_change_request_service.py`, `ChatService`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 38 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `NotFoundException` (e.g. with `_is_still_a_member()` and `AdminUserService`) actually correct?**
  _`NotFoundException` has 16 INFERRED edges - model-reasoned connections that need verification._