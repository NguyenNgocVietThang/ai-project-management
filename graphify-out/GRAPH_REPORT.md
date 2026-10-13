# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-13)

## Corpus Check
- 584 files · ~353,506 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5161 nodes · 16369 edges · 197 communities (178 shown, 7 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1543 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `880ebaa2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- schemas/requirement_brief.py
- react
- sqlalchemy
- process_model_service.py
- lucide-react
- versions/page.tsx
- ProjectRepository
- security.py
- email.py
- requirement_brief_service.py
- test_auth_cookies.py
- ForbiddenException
- test_xlsx_renderer.py
- worklogs.py
- test_bpmn_schema.py
- document_service.py
- test_requirement_brief_schema.py
- generate_project
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- swimlaneLayout.ts
- projects/page.tsx
- test_login_lockout.py
- process_png.py
- ConnectionManager
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- ResourceService
- test_docx_renderer.py
- User
- documents/page.tsx
- as_user
- ProjectService
- Chi tiết các Giai đoạn
- list_projects
- typing
- diff_snapshots
- ConflictException
- getApiErrorMessage
- requirement_briefs.py
- auth_service.py
- StorageService
- test_requirement_clarifier_parse.py
- RoleService
- test_cpm_scheduling.py
- ThemeProvider.tsx
- make_user
- @tanstack/react-query
- dashboard_service.py
- devDependencies
- test_user_profile_settings.py
- Settings
- bpmn.py
- AIResponseError
- package.json
- durable_jobs.py
- system.py
- next-intl
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- project_service.py
- test_process_png.py
- ChatPanel.tsx
- task_service.py
- schemas/process_model.py
- list_notifications
- AuditService
- DocumentTemplate
- PortfolioRepository
- admin.py
- UserService
- scheduling_service.py
- SecurityState
- AGENTS.md
- AdminUserService
- Chi tiết các Giai đoạn đã hoàn thành
- useNotifications.ts
- Chi tiết kế hoạch triển khai
- ApprovalTimeline.tsx
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- test_reported_metrics_are_real.py
- schemas/user.py
- leaves.py
- my_assignments
- json
- test_document_writer.py
- templates.py
- security_state_service.py
- Document
- env.py
- test_security_state.py
- fixture
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- list_portfolios
- FakeStorage
- next.config.js
- Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)
- test_auth_email_verification.py
- get_current_user
- AuditLog
- project_versions.py
- scripts
- useCPM.test.tsx
- middleware.ts
- RequirementItems
- Rà soát code và nâng cấp giao diện — 2026-09-15
- run_impact_analysis
- layout.ts
- playwright
- test_auth_password_recovery.py
- test_oauth_account_takeover.py
- main.py
- Kế hoạch: Render Free + Supabase Free
- config.ts
- .start_flow
- test_resource_warnings.py
- OAuthService
- DocumentRenderError
- Đặc tả yêu cầu phần mềm (SRS)
- Email and private storage adapters
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- next-env.d.ts
- Rà soát cuối: Render Free + Supabase Free
- documents.py
- date_utils.py
- field_validator
- AuthService
- test_project_from_brief_job.py
- Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)
- 11. Cài đặt và Chạy hệ thống
- Backend local verification — 2026-10-09
- Durable jobs verification
- list_audit_logs
- Redis Free và trạng thái bảo mật
- BurndownChart.tsx
- test_portfolio_project_core.py
- pydantic
- skills.py
- AIGenerateProjectFromBriefRequest
- tailwind.config.ts
- Nhật ký tiến độ Phase 4
- sprints.py
- alembic
- test_resource_recommender.py
- 12. Cấu hình & Biến môi trường
- RequirementClarifier.tsx
- .__init__
- README.md
- AIService
- test_rate_limit.py
- docx_renderer.py
- vitest.config.mts
- list_roles
- change_requests.py
- get_critical_path
- approvals.py
- Frontend durable jobs verification
- PortfolioService
- Tiến độ — tasks/plan.md
- resource-recommendation.service.ts
- unittest_mock
- ChatService
- create_dependency
- wbs.py
- phases.py
- Prompt điều phối subagent — Phase 4
- storage_service.py
- test_route_exposure.py
- Chi tiết các Giai đoạn đã hoàn thành
- Job
- list_jobs
- TeamBarChart.tsx
- resource_leveling
- list_briefs
- Project
- test_version_rollback.py
- 3. Ngăn xếp công nghệ
- request_xlsx_report
- 1. Tổng quan dự án

## God Nodes (most connected - your core abstractions)
1. `User` - 295 edges
2. `Project` - 104 edges
3. `Task` - 103 edges
4. `ForbiddenException` - 99 edges
5. `Job` - 99 edges
6. `NotFoundException` - 96 edges
7. `Base` - 89 edges
8. `ConflictException` - 86 edges
9. `react` - 75 edges
10. `BadRequestException` - 73 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `generate_project()` --uses--> `AIGenerateProjectRequest`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/schemas/ai.py
- `generate_project_from_brief()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `request_impact_analysis()` --uses--> `AIImpactAnalysisRequest`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/schemas/ai.py

## Import Cycles
- None detected.

## Communities (197 total, 7 thin omitted)

### Community 0 - "schemas/requirement_brief.py"
Cohesion: 0.13
Nodes (22): _build_item(), _clean(), ItemUpdateResult, BaseModel, model_validator, ValueError, QAEntry, Schema và hàm thuần cho hồ sơ yêu cầu (requirement brief). Cấu trúc cột `items`… (+14 more)

### Community 1 - "react"
Cohesion: 0.05
Nodes (75): metadata, LoginPageProps, metadata, metadata, ProfilePageContent(), Alert(), AlertProps, VARIANT_CLASSES (+67 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.09
Nodes (38): Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, Comment, DocumentType (+30 more)

### Community 3 - "process_model_service.py"
Cohesion: 0.10
Nodes (38): AIRequest, ProcessModelRecord, insufficient_items(), Trả (mục missing, mục skipped) đang chặn việc vẽ quy trình. Quy tắc: -…, _authorize_roles(), find_project_brief(), get_latest_process(), get_latest_process_model() (+30 more)

### Community 4 - "lucide-react"
Cohesion: 0.04
Nodes (84): DashboardPage(), PortfolioDetailPage(), ChangeRequestDetailPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectOverviewCharts, ProjectOverviewPage() (+76 more)

### Community 5 - "versions/page.tsx"
Cohesion: 0.07
Nodes (41): formatDateTime(), KNOWN_KINDS, diff, emptyGroup, messages, mocks, setup(), version() (+33 more)

### Community 6 - "ProjectRepository"
Cohesion: 0.08
Nodes (9): BaseRepository, Any, AsyncSession, datetime, ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+1 more)

### Community 7 - "security.py"
Cohesion: 0.12
Nodes (33): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+25 more)

### Community 8 - "email.py"
Cohesion: 0.12
Nodes (23): EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email() (+15 more)

### Community 9 - "requirement_brief_service.py"
Cohesion: 0.21
Nodes (21): PendingTurn, Người dùng sửa/xác nhận một mục (nguồn `user`); `key` chỉ dùng trong answer., RequirementItemPatch, accept_assumption(), answer(), _apply_user_updates(), finalize(), get_owned() (+13 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "ForbiddenException"
Cohesion: 0.08
Nodes (33): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException, DependencyType, str (+25 more)

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.07
Nodes (57): Các renderer báo cáo thuần (không truy cập DB). Tầng job/endpoint (X2) chịu…, build_report_data(), date, Dựng ProjectReportData. Ném Forbidden/NotFound/Unprocessable như API tương ứng., burndown_header_row(), BurndownRow, ChangeRequestRow, _coerce_date() (+49 more)

### Community 13 - "worklogs.py"
Cohesion: 0.18
Nodes (20): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+12 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.11
Nodes (46): lint_process_model(), process_steps_table(), ProcessModel, Toàn bộ quy trình: làn, nút và luồng, đã kiểm tra tính toàn vẹn đồ thị., Các cảnh báo không chặn (mô hình vẫn hợp lệ và vẽ được). - Exclusive gateway có…, Bảng các bước tuần tự, dùng làm dự phòng trong DOCX khi vẽ sơ đồ lỗi. Duyệt BFS…, process_model_steps(), Bảng các bước từ quy trình (B1) theo định dạng `process_steps` của renderer… (+38 more)

### Community 15 - "document_service.py"
Cohesion: 0.06
Nodes (74): TooManyRequestsException, JobError, JobResult, PermanentJobError, Exception, GeneratedDocument, build_process_steps(), plan_section_groups() (+66 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.13
Nodes (35): apply_item_updates(), empty_items(), Danh sách mục ban đầu: mọi mục `missing`, chưa có nguồn., Kiểm tra dữ liệu `items` đọc từ DB hoặc từ bên ngoài., Áp danh sách cập nhật lên các mục, trả về bản mới (không sửa đầu vào). Nguyên…, Cập nhật mục vi phạm quy tắc nghiệp vụ; không mục nào được áp., RequirementBriefUpdateError, validate_items() (+27 more)

### Community 17 - "generate_project"
Cohesion: 0.18
Nodes (22): AIServiceDep, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), CurrentUser, CurrentVerifiedUser, Depends (+14 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (40): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+32 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.21
Nodes (23): client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize, storage_settings(), test_email_idempotency_conflict_is_classified() (+15 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.07
Nodes (40): mocks, record, clip(), NodeShape(), ProcessDiagram(), model, wrap(), ZOOM_STEPS (+32 more)

### Community 22 - "projects/page.tsx"
Cohesion: 0.07
Nodes (56): PortfoliosPage(), ProjectMembersPage(), ProjectSettingsPage(), ProjectsPage(), PortfolioCardProps, PortfolioFormProps, PortfolioList(), portfolioKeys (+48 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "process_png.py"
Cohesion: 0.12
Nodes (21): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+13 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "Lát 1: AI hỏi làm rõ rồi SRS/BRD"
Cohesion: 0.06
Nodes (31): A1: Tạo chuỗi duyệt khi submit CR, A2: Quyết định bước duyệt, A3: UI dòng thời gian duyệt, C1: Model và migration hồ sơ yêu cầu, C2: Job hỏi làm rõ (`ai.clarify`), C3: API hồ sơ yêu cầu, C4: Project Generator dùng hồ sơ đã chốt, C5: UI hỏi làm rõ (+23 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 29 - "users/page.tsx"
Cohesion: 0.06
Nodes (54): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+46 more)

### Community 30 - "ResourceService"
Cohesion: 0.13
Nodes (11): Assignment, WorklogProjectSummary, WorklogResponse, AsyncSession, date, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach…, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc… (+3 more)

### Community 31 - "test_docx_renderer.py"
Cohesion: 0.25
Nodes (22): _headings(), _open(), _png_bytes(), D1: mẫu SRS/BRD và bộ dựng DOCX thuần. Đọc lại DOCX bằng python-docx để kiểm…, Tạo ảnh PNG RGB nhỏ hợp lệ tại chỗ (không cần thư viện ảnh)., Tìm bảng đứng ngay sau tiêu đề có chứa ``heading_text`` trong thân tài liệu., _render(), _rows() (+14 more)

### Community 32 - "User"
Cohesion: 0.05
Nodes (41): AIJobResponse, AIResultResponse, BadRequestException, EpicStatus, str, MilestoneStatus, str, PhaseStatus (+33 more)

### Community 33 - "documents/page.tsx"
Cohesion: 0.10
Nodes (34): apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_STYLE, documentFilename(), documentService, saveBlob() (+26 more)

### Community 34 - "as_user"
Cohesion: 0.10
Nodes (41): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+33 more)

### Community 35 - "ProjectService"
Cohesion: 0.20
Nodes (6): ProjectMemberResponse, ProjectService, date, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 36 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 37 - "list_projects"
Cohesion: 0.16
Nodes (22): add_project_member(), change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser (+14 more)

### Community 38 - "typing"
Cohesion: 0.06
Nodes (57): JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., B2: API quy trình nghiệp vụ (BPMN rút gọn) do AI sinh từ hồ sơ yêu cầu. - POST…, X2: xuất báo cáo XLSX của dự án (job bền `report.xlsx`) và tải qua proxy có…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), NotFoundException (+49 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (22): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), Any, So sánh hai snapshot phiên bản dự án (V2). Hàm thuần, không truy cập DB. - Thực… (+14 more)

### Community 40 - "ConflictException"
Cohesion: 0.06
Nodes (78): ConflictException, Approval, ApprovalStatus, str, ChangeRequest, CRStatus, str, Notification (+70 more)

### Community 41 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (62): VerifyEmailContent(), verify(), AIInsightsPage(), KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage() (+54 more)

### Community 42 - "requirement_briefs.py"
Cohesion: 0.18
Nodes (24): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), patch_item(), CurrentVerifiedUser, DB (+16 more)

### Community 43 - "auth_service.py"
Cohesion: 0.11
Nodes (26): get_redis(), claim_revocation(), _key(), Danh sách thu hồi token, dùng Redis hoặc Postgres theo chế độ triển khai.…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Revoke idempotently; database failures raise 503, legacy Redis failures return…, Atomically rotate a refresh token once; False means missing/already used.…, revoke() (+18 more)

### Community 44 - "StorageService"
Cohesion: 0.25
Nodes (9): Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError, StorageNotFoundError (+1 more)

### Community 45 - "test_requirement_clarifier_parse.py"
Cohesion: 0.13
Nodes (16): build_clarify_prompt(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), BaseModel, model_validator, Kiểm tra output của model; mọi sai lệch đều thành `AIResponseError`. (+8 more)

### Community 46 - "RoleService"
Cohesion: 0.24
Nodes (16): RoleCreate, RoleUpdate, AsyncSession, Role, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db() (+8 more)

### Community 47 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (77): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+69 more)

### Community 48 - "ThemeProvider.tsx"
Cohesion: 0.13
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 49 - "make_user"
Cohesion: 0.12
Nodes (44): AIRequestStatus, AIRequestType, str, Hồ sơ yêu cầu: ý tưởng gốc được AI hỏi làm rõ từng mục trước khi sinh dự án.…, RequirementBrief, Server-only, expiring auth state; Redis loss cannot restore revoked credentials., enqueue_clarify_turn(), C2: AI hỏi làm rõ hồ sơ yêu cầu, chạy như một job AI bền… (+36 more)

### Community 50 - "@tanstack/react-query"
Cohesion: 0.05
Nodes (63): aiJobKeys, useAIJob(), useImpactAnalysisJob(), JobConnectionNotice(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow() (+55 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.05
Nodes (65): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+57 more)

### Community 52 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.30
Nodes (19): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "Settings"
Cohesion: 0.14
Nodes (18): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize (+10 more)

### Community 55 - "bpmn.py"
Cohesion: 0.14
Nodes (15): _adjacency(), ProcessFlow, ProcessLane, ProcessNode, Any, BaseModel, field_validator, model_validator (+7 more)

### Community 56 - "AIResponseError"
Cohesion: 0.11
Nodes (32): parse_process_model(), Parse output của model thành `ProcessModel`, mọi lỗi quy về `AIResponseError`.…, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, ValueError, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng… (+24 more)

### Community 57 - "package.json"
Cohesion: 0.07
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, axios (+21 more)

### Community 58 - "durable_jobs.py"
Cohesion: 0.05
Nodes (73): AIOutput, ImpactReport, str, RiskLevel, RiskReport, ImpactReportResponse, BaseModel, BaseModel (+65 more)

### Community 59 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 60 - "next-intl"
Cohesion: 0.04
Nodes (56): frontend_messages_en, AuthLayout(), OAuthCallbackContent(), VerificationState, AdminLayout(), TABS, DashboardLayout(), mocks (+48 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (45): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), get_me(), login(), logout(), CurrentUser, Depends (+37 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.09
Nodes (23): 10. Đặc tả API và các điểm cuối WebSocket, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+15 more)

### Community 64 - "project_service.py"
Cohesion: 0.14
Nodes (23): create_project(), Depends, ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary (+15 more)

### Community 65 - "test_process_png.py"
Cohesion: 0.23
Nodes (16): ProcessRenderError, RuntimeError, Vẽ quy trình thành PNG (bytes). Ném `ProcessRenderError` nếu không vẽ được., Không vẽ được sơ đồ quy trình; nơi gọi chuyển sang bảng các bước., render_process_png(), _strip_diacritics(), build_model(), open_png() (+8 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (22): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+14 more)

### Community 67 - "task_service.py"
Cohesion: 0.07
Nodes (58): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), bulk_update_tasks(), change_task_status() (+50 more)

### Community 68 - "schemas/process_model.py"
Cohesion: 0.16
Nodes (15): generate_process_model(), get_process_model(), CurrentUser, CurrentVerifiedUser, DB, get, post, Quy trình mới nhất kèm cảnh báo lint và bảng các bước. (+7 more)

### Community 69 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 70 - "AuditService"
Cohesion: 0.20
Nodes (12): AuditLogResponse, AuditService, get_audit_service(), AsyncSession, datetime, Depends, PaginatedResponse, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm. (+4 more)

### Community 71 - "DocumentTemplate"
Cohesion: 0.14
Nodes (8): build_system_prompt(), _section_spec(), DocumentTemplate, Key các mục mà AI được phép cung cấp nội dung., Ánh xạ "mục bắt buộc -> các key hồ sơ cần thiết"., Một mục của mẫu tài liệu., Mẫu tài liệu: loại tài liệu và danh sách mục theo thứ tự hiển thị., Section

### Community 72 - "PortfolioRepository"
Cohesion: 0.16
Nodes (6): PortfolioRepository, AsyncSession, AsyncSession, get_project_service(), AsyncSession, Depends

### Community 73 - "admin.py"
Cohesion: 0.19
Nodes (12): AdminUserCreate, AdminUserResponse, AuditActorSummary, PermissionResponse, BaseModel, Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log., Chỉ đủ để đổ vào một bộ chọn vai trò dự án. Cố tình bỏ `permissions`:…, RoleDetailResponse (+4 more)

### Community 74 - "UserService"
Cohesion: 0.08
Nodes (18): AsyncSession, Depends, Header, post, schedule_jobs(), ServiceUnavailableException, UnauthorizedException, DeleteAccountRequest (+10 more)

### Community 75 - "scheduling_service.py"
Cohesion: 0.12
Nodes (27): UnprocessableException, Worklog, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession (+19 more)

### Community 76 - "SecurityState"
Cohesion: 0.11
Nodes (21): ABC, AmbiguousJobError, RetryableJobError, SecurityState, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., Durable checkpoint around exactly one provider call per AI job. (+13 more)

### Community 78 - "AdminUserService"
Cohesion: 0.28
Nodes (24): AdminUserUpdate, AdminUserService, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 79 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 80 - "useNotifications.ts"
Cohesion: 0.17
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 81 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 82 - "ApprovalTimeline.tsx"
Cohesion: 0.19
Nodes (15): ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, parseMissingRoles(), readApiError(), ApprovalTimeline() (+7 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 84 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (19): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+11 more)

### Community 85 - "schemas/user.py"
Cohesion: 0.17
Nodes (10): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate (+2 more)

### Community 86 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 87 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 88 - "json"
Cohesion: 0.23
Nodes (9): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, json (+1 more)

### Community 89 - "test_document_writer.py"
Cohesion: 0.12
Nodes (26): alembic_migration, alembic_operations, build_assumption_items(), build_brief_context(), build_user_prompt(), _cut(), parse_group_response(), Any (+18 more)

### Community 90 - "templates.py"
Cohesion: 0.20
Nodes (10): _brief_item_usable(), Column, missing_brief_items(), Any, Mẫu tài liệu SRS và BRD có cấu trúc cố định. Mẫu là nguồn sự thật duy nhất về…, Mục hồ sơ có dữ liệu khi trạng thái là ``clear`` hoặc ``assumed``., Trả về các key hồ sơ còn thiếu mà các mục bắt buộc của mẫu cần. ``brief_items``…, Một cột của mục dạng bảng. (+2 more)

### Community 91 - "security_state_service.py"
Cohesion: 0.27
Nodes (21): claim(), clear(), _clock(), contains(), _hash(), increment(), _increment(), _insert() (+13 more)

### Community 92 - "Document"
Cohesion: 0.29
Nodes (10): Document, _add_note(), _add_table(), _add_toc(), Chèn field TOC của Word (cấp 1-2) và bật cập nhật field khi mở tệp., Ghi chú in nghiêng, dùng khi mục chưa có thông tin., Bảng có hàng tiêu đề in đậm, lặp lại khi sang trang., _render_assumptions() (+2 more)

### Community 93 - "env.py"
Cohesion: 0.13
Nodes (16): do_run_migrations(), run_async_migrations(), run_migrations_online(), list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người… (+8 more)

### Community 94 - "test_security_state.py"
Cohesion: 0.08
Nodes (48): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), consume(), issue() (+40 more)

### Community 95 - "fixture"
Cohesion: 0.25
Nodes (9): _disable_rate_limiting(), event_loop(), AsyncSession, fixture, Role, Tắt rate limit theo TỪNG test, rồi khôi phục. `test_auth_password_recovery.py`…, Các vai trò dự án cùng một permission tối thiểu để kiểm tra RBAC., seed_roles() (+1 more)

### Community 96 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.12
Nodes (15): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001) (+7 more)

### Community 97 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 98 - "FakeStorage"
Cohesion: 0.33
Nodes (3): FakeStorage, fixture, storage()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)"
Cohesion: 0.33
Nodes (5): Hiện trạng theo tính năng, Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.29
Nodes (14): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure() (+6 more)

### Community 102 - "get_current_user"
Cohesion: 0.29
Nodes (8): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các…, oauth2_scheme

### Community 103 - "AuditLog"
Cohesion: 0.23
Nodes (11): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed() (+3 more)

### Community 104 - "project_versions.py"
Cohesion: 0.16
Nodes (21): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+13 more)

### Community 105 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 106 - "useCPM.test.tsx"
Cohesion: 0.15
Nodes (17): ProjectGanttPage(), CPM_JOB_KIND, cpmKeys, shouldRetry(), schedule, useCPM(), UseCPMResult, useReloadWhenCPMJobSucceeds() (+9 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "RequirementItems"
Cohesion: 0.38
Nodes (4): Any, Đúng bảy mục cố định; khóa lạ hoặc thiếu khóa đều bị từ chối., Dạng lưu vào cột JSON, giữ thứ tự khóa cố định., RequirementItems

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "run_impact_analysis"
Cohesion: 0.28
Nodes (17): AsyncSession, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+9 more)

### Community 111 - "layout.ts"
Cohesion: 0.11
Nodes (30): formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small, task() (+22 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "test_auth_password_recovery.py"
Cohesion: 0.21
Nodes (19): forgot_password(), Đưa email đặt lại mật khẩu vào hàng đợi đồng thời ngăn chặn kỹ thuật dò quét…, verify_password(), build_request(), build_service(), extract_token(), asyncio, parametrize (+11 more)

### Community 114 - "test_oauth_account_takeover.py"
Cohesion: 0.31
Nodes (10): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

### Community 115 - "main.py"
Cohesion: 0.05
Nodes (55): set_request_id(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, Preserve Slowapi decorators, with an async durable path in database mode.… (+47 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 118 - ".start_flow"
Cohesion: 0.33
Nodes (5): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Bắt đầu một luồng OAuth. Trả về `(state, browser_secret, code_challenge)`.…

### Community 119 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 120 - "OAuthService"
Cohesion: 0.18
Nodes (9): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, AsyncSession, User, Phân giải identity của provider thành một User. `email_provider_verified` là… (+1 more)

### Community 121 - "DocumentRenderError"
Cohesion: 0.33
Nodes (6): DocumentRenderError, _ensure_language(), labels(), ValueError, Nhãn cố định theo ngôn ngữ (ngôn ngữ lạ gây DocumentRenderError)., Tham số dựng tài liệu không hợp lệ (ngôn ngữ, mẫu...).

### Community 122 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 123 - "Email and private storage adapters"
Cohesion: 0.33
Nodes (5): Email and private storage adapters, Email setup, Existing file flow and scope, Local verification, Supabase Storage setup

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.25
Nodes (7): Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "run_risk_analysis"
Cohesion: 0.15
Nodes (27): str, RiskLevel, _as_list(), _clamp_score(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+19 more)

### Community 128 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 129 - "documents.py"
Cohesion: 0.11
Nodes (35): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), CurrentUser (+27 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 139 - "AuthService"
Cohesion: 0.15
Nodes (8): AuthService, AsyncSession, datetime, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây…, Ghi lại một sự kiện xác thực. ip_address được điền tự động từ ngữ cảnh request…

### Community 145 - "test_project_from_brief_job.py"
Cohesion: 0.25
Nodes (14): FakeProvider, job_for(), make_brief(), make_runner(), asyncio, Integration test C4: sinh dự án từ hồ sơ yêu cầu đã chốt với provider giả., Provider giả theo giao thức checkpoint; ghi lại prompt đã nhận., test_brief_not_ready_or_foreign_is_rejected() (+6 more)

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.12
Nodes (16): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hiện trạng đã xác minh, Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở) (+8 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 149 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 150 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 151 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 152 - "BurndownChart.tsx"
Cohesion: 0.60
Nodes (4): BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 153 - "test_portfolio_project_core.py"
Cohesion: 0.41
Nodes (14): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_and_project_schema_validation() (+6 more)

### Community 154 - "pydantic"
Cohesion: 0.35
Nodes (9): AIGenerateProjectRequest, AIImpactAnalysisRequest, AIResourceRecommendationRequest, AIResultResponse, AIRiskAnalysisRequest, AIScheduleOptimizeRequest, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI). (+1 more)

### Community 155 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 156 - "AIGenerateProjectFromBriefRequest"
Cohesion: 0.67
Nodes (3): AIGenerateProjectFromBriefRequest, BaseModel, Body sinh dự án từ hồ sơ yêu cầu đã chốt (C4).

### Community 158 - "Nhật ký tiến độ Phase 4"
Cohesion: 0.50
Nodes (3): Môi trường kiểm thử, Nhật ký, Nhật ký tiến độ Phase 4

### Community 159 - "sprints.py"
Cohesion: 0.27
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 161 - "test_resource_recommender.py"
Cohesion: 0.18
Nodes (23): _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay… (+15 more)

### Community 162 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Môi trường phía giao diện (`frontend/.env.local`), Môi trường phía máy chủ (`backend/.env`)

### Community 163 - "RequirementClarifier.tsx"
Cohesion: 0.06
Nodes (55): apiDetail(), formatDateTime(), KNOWN_ERRORS, ProcessPage(), AIGeneratorModal(), empty, jobState, mocks (+47 more)

### Community 166 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 169 - "AIService"
Cohesion: 0.16
Nodes (24): AIService, get_ai_service(), AsyncSession, Depends, AI requests and durable outbox are inserted in the request transaction., asyncio, parametrize, test_ai_and_outbox_rollback_together() (+16 more)

### Community 170 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 172 - "docx_renderer.py"
Cohesion: 0.14
Nodes (30): _add_title_page(), _cell_text(), _clean_text(), ContentValidation, missing_required_sections(), _normalize_assumptions(), _normalize_bullets(), _normalize_paragraph() (+22 more)

### Community 175 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 176 - "list_roles"
Cohesion: 0.16
Nodes (16): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+8 more)

### Community 180 - "change_requests.py"
Cohesion: 0.36
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 181 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 182 - "approvals.py"
Cohesion: 0.18
Nodes (14): ApprovalServiceDep, approve_step(), list_approvals(), CurrentUser, CurrentVerifiedUser, get, post, Quyết định từng bước duyệt CR (A2), lồng dưới /change-… (+6 more)

### Community 183 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 184 - "PortfolioService"
Cohesion: 0.13
Nodes (16): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+8 more)

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.33
Nodes (5): Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 190 - "unittest_mock"
Cohesion: 0.10
Nodes (30): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, NotificationType, str, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse (+22 more)

### Community 191 - "ChatService"
Cohesion: 0.09
Nodes (36): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+28 more)

### Community 192 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 194 - "wbs.py"
Cohesion: 0.08
Nodes (41): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+33 more)

### Community 195 - "phases.py"
Cohesion: 0.22
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.15
Nodes (12): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm) (+4 more)

### Community 197 - "storage_service.py"
Cohesion: 0.16
Nodes (12): AsyncClient, asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), base64, io, Minio (+4 more)

### Community 199 - "test_route_exposure.py"
Cohesion: 0.23
Nodes (10): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing() (+2 more)

### Community 200 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 204 - "Job"
Cohesion: 0.07
Nodes (63): ApplyResult, async_sessionmaker, JobContext, JobRunner, AsyncSession, Bounded durable job execution, with short transactions around external work., Recover and claim only free execution slots; useful for deterministic tests., Persist dispatch intent before sending; optional quota reservation is atomic. (+55 more)

### Community 215 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, DB, ge, get, le, Query (+1 more)

### Community 221 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 224 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 226 - "list_briefs"
Cohesion: 0.13
Nodes (15): list_briefs(), ge, get, le, Query, Hồ sơ của tôi, mới nhất trước., ItemCounts, RequirementBriefSummary (+7 more)

### Community 227 - "Project"
Cohesion: 0.04
Nodes (73): Project, Task, TaskStatus, datetime, AsyncSession, TaskRepository, build_project_context(), D2: AI viết nội dung tài liệu SRS/BRD theo từng nhóm mục của mẫu. Mỗi nhóm (2-4… (+65 more)

### Community 231 - "test_version_rollback.py"
Cohesion: 0.06
Nodes (75): Dependency, Phase, ProjectVersion, _apply_fields(), build_snapshot(), create_snapshot(), _enforce_cap(), _from_json() (+67 more)

### Community 235 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 247 - "request_xlsx_report"
Cohesion: 0.20
Nodes (11): download_xlsx_report(), BaseModel, CurrentUser, CurrentVerifiedUser, DB, get, post, Xếp job xuất XLSX; nếu đã có job đang chạy cùng ngôn ngữ thì trả lại job đó. (+3 more)

### Community 257 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

## Knowledge Gaps
- **524 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+519 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1665 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `sqlalchemy`, `process_model_service.py`, `ProjectRepository`, `security.py`, `requirement_brief_service.py`, `ForbiddenException`, `AuthService`, `test_xlsx_renderer.py`, `test_bpmn_schema.py`, `document_service.py`, `generate_project`, `test_ws_hardening.py`, `users.py`, `list_audit_logs`, `pydantic`, `ResourceService`, `test_resource_recommender.py`, `as_user`, `ProjectService`, `typing`, `ConflictException`, `AIService`, `auth_service.py`, `RoleService`, `make_user`, `dashboard_service.py`, `PortfolioService`, `durable_jobs.py`, `ChatService`, `project_service.py`, `wbs.py`, `task_service.py`, `UserService`, `scheduling_service.py`, `Job`, `AdminUserService`, `env.py`, `test_security_state.py`, `list_portfolios`, `list_briefs`, `Project`, `test_auth_email_verification.py`, `get_current_user`, `test_version_rollback.py`, `test_oauth_account_takeover.py`, `OAuthService`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Project` connect `Project` to `sqlalchemy`, `process_model_service.py`, `ProjectRepository`, `ForbiddenException`, `document_service.py`, `test_project_from_brief_job.py`, `ResourceService`, `User`, `as_user`, `ProjectService`, `typing`, `ConflictException`, `AIService`, `test_cpm_scheduling.py`, `dashboard_service.py`, `durable_jobs.py`, `unittest_mock`, `project_service.py`, `PortfolioRepository`, `scheduling_service.py`, `Job`, `list_jobs`, `test_version_rollback.py`, `run_impact_analysis`, `run_risk_analysis`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Task` connect `Project` to `sqlalchemy`, `ProjectRepository`, `ForbiddenException`, `test_xlsx_renderer.py`, `document_service.py`, `ResourceService`, `User`, `test_resource_recommender.py`, `as_user`, `typing`, `AIService`, `test_cpm_scheduling.py`, `dashboard_service.py`, `durable_jobs.py`, `task_service.py`, `scheduling_service.py`, `Job`, `test_version_rollback.py`, `run_impact_analysis`, `run_risk_analysis`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **Are the 46 inferred relationships involving `Project` (e.g. with `visible_jobs()` and `PortfolioRepository`) actually correct?**
  _`Project` has 46 INFERRED edges - model-reasoned connections that need verification._
- **Are the 48 inferred relationships involving `Task` (e.g. with `ProjectRepository` and `TaskRepository`) actually correct?**
  _`Task` has 48 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _524 weakly-connected nodes found - possible documentation gaps or missing edges._