# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-12)

## Corpus Check
- 485 files · ~277,037 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 3949 nodes · 12379 edges · 189 communities (139 shown, 50 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1143 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `62d55d52`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Button
- db/base.py
- endpoints/auth.py
- formatDate
- (dashboard)/layout.tsx
- PortfolioService
- users/page.tsx
- durable_handlers.py
- ConflictException
- test_auth_cookies.py
- ForbiddenException
- getApiErrorMessage
- test_ai_service.py
- AuthService
- XkiroProvider
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- tasks/page.tsx
- next-intl
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- devDependencies
- api.ts
- wbs.py
- useAuthStore
- User
- ThemeProvider.tsx
- test_authz_matrix.py
- package.json
- test_auth_password_recovery.py
- UserService
- core/dependencies.py
- Job
- project_service.py
- ProjectRepository
- oauth.py
- AdminUserService
- Modal
- test_security_state.py
- admin.py
- oauth_state_store.py
- list_projects
- test_impact_analyzer.py
- @tanstack/react-query
- dashboard.py
- TaskStatus
- test_user_profile_settings.py
- dependencies
- _index_names
- JobRunner
- run_risk_analysis
- Task
- AuditService
- StorageService
- Thiết kế kiến trúc hệ thống
- AIService
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- storage_service.py
- RoleService
- ChatPanel.tsx
- worklogs.py
- post
- NotificationService
- Project
- schemas/user.py
- NotificationType
- endpoints/ai.py
- typing
- test_resource_warnings.py
- scheduling_tasks.py
- AGENTS.md
- ChatService
- BadRequestException
- Settings
- sweep_task_dates_task
- auth_service.py
- approvals.py
- test_change_request_service.py
- main.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- security_state_service.py
- system.py
- OAuthService
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- my_assignments
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- skills.py
- DashboardService
- next.config.js
- risk_analyzer.py
- test_auth_email_verification.py
- list_portfolios
- Chi tiết các Giai đoạn đã hoàn thành
- list_audit_logs
- test_cpm_scheduling.py
- test_dashboard_activity_scope.py
- middleware.ts
- test_oauth_account_takeover.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- conftest.py
- ProjectCreate
- playwright
- test_route_exposure.py
- audit/page.tsx
- Kế hoạch: Render Free + Supabase Free
- test_dashboard_metrics.py
- Prompt điều phối subagent — Phase 4
- test_portfolio_project_core.py
- dashboards.py
- connectWebSocket
- test_project_scoping.py
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- pytest
- Frontend durable jobs verification
- list_jobs
- date_utils.py
- report_tasks.py
- Chi tiết các Giai đoạn đã hoàn thành
- PortfolioRepository
- Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)
- 11. Cài đặt và Chạy hệ thống
- AdminUserCreate
- 3. Ngăn xếp công nghệ
- Rà soát 2026-09-06
- pydantic
- env.py
- .start_flow
- resource-recommendation.service.ts
- security.py
- Chi tiết kế hoạch triển khai
- validate_password_policy
- ai_tasks.py
- resource_leveling
- Đặc tả yêu cầu phần mềm (SRS)
- README.md
- Rà soát cuối: Render Free + Supabase Free
- Backend local verification — 2026-10-09
- Tiến độ — tasks/plan.md

## God Nodes (most connected - your core abstractions)
1. `User` - 231 edges
2. `Button` - 95 edges
3. `ForbiddenException` - 84 edges
4. `Task` - 78 edges
5. `Base` - 75 edges
6. `WBSService` - 75 edges
7. `TaskService` - 73 edges
8. `NotFoundException` - 70 edges
9. `Project` - 68 edges
10. `BadRequestException` - 66 edges

## Surprising Connections (you probably didn't know these)
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `Chuyển mode và nghiệm thu` --references--> `AuthService`  [INFERRED]
  docs/security-state-audit.md → backend/app/services/auth_service.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py
- `GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py

## Import Cycles
- None detected.

## Communities (189 total, 50 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.14
Nodes (19): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), run_schedule_optimization(), _validate_and_filter_result(), runner() (+11 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (100): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+92 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (22): Approval, ApprovalStatus, Base, ChatMessage, ChatReadState, Comment, DependencyType, Document (+14 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (20): create_websocket_ticket(), exchange_oauth_code(), get_me(), login(), logout(), refresh_token(), register(), resend_verification() (+12 more)

### Community 4 - "formatDate"
Cohesion: 0.07
Nodes (49): Danh mục tính năng đã triển khai, DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), TaskTable(), MiniProgressBar(), MiniProgressBarProps (+41 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.18
Nodes (16): AuthLayout(), DashboardLayout(), Brand(), LanguageToggle(), LINKS, MainNav(), MobileNav(), useNotificationSocket() (+8 more)

### Community 6 - "PortfolioService"
Cohesion: 0.15
Nodes (9): PortfolioStatus, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate (+1 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.12
Nodes (32): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys, useAdminRoles() (+24 more)

### Community 8 - "durable_handlers.py"
Cohesion: 0.12
Nodes (13): run_email(), EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task() (+5 more)

### Community 9 - "ConflictException"
Cohesion: 0.15
Nodes (4): ConflictException, WorklogProjectSummary, WorklogResponse, ResourceService

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "ForbiddenException"
Cohesion: 0.10
Nodes (13): get_current_active_superuser(), require_roles(), role_checker(), ForbiddenException, TaskPriority, DependencyResponse, TaskDetailResponse, TaskResponse (+5 more)

### Community 12 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (58): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), DashboardLoading(), AIInsightsPage(), ChangeRequestsPage(), Metric() (+50 more)

### Community 13 - "test_ai_service.py"
Cohesion: 0.38
Nodes (9): ai_request(), authorized_project_context(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 14 - "AuthService"
Cohesion: 0.11
Nodes (6): TooManyRequestsException, SecurityLimiter, decorator(), wrapper(), AuthService, get_auth_service()

### Community 15 - "XkiroProvider"
Cohesion: 0.09
Nodes (16): AmbiguousJobError, JobError, PermanentJobError, RetryableJobError, BaseAIProvider, authorize_request(), run_ai(), apply() (+8 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.12
Nodes (31): ProjectMembersPage(), ProjectsPage(), Avatar(), portfolioKeys, ProjectMembersTable(), InitialProjectMember, useAddProjectMember(), useProjectMembers() (+23 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.12
Nodes (33): taskKeys, wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate, Dependency (+25 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (24): chat_ws(), _is_still_a_member(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError (+16 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (16): change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user() (+8 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.15
Nodes (19): client(), email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified(), test_email_transport_timeout_hides_secrets_and_retains_retry_key(), test_minio_compatibility_releases_download_connection(), test_resend_errors_are_sanitized_and_classified(), test_resend_missing_key_fails_explicitly() (+11 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.08
Nodes (46): ProjectChatPage(), ProjectLayout(), ProjectSettingsPage(), Field(), KanbanColumn(), Select(), SprintView(), STATUSES (+38 more)

### Community 22 - "next-intl"
Cohesion: 0.17
Nodes (20): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+12 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (12): _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip(), test_authenticate_refuses_while_locked_without_hashing_a_password() (+4 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.09
Nodes (24): AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider() (+16 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (8): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel()

### Community 26 - "Lát 1: AI hỏi làm rõ rồi SRS/BRD"
Cohesion: 0.06
Nodes (31): A1: Tạo chuỗi duyệt khi submit CR, A2: Quyết định bước duyệt, A3: UI dòng thời gian duyệt, C1: Model và migration hồ sơ yêu cầu, C2: Job hỏi làm rõ (`ai.clarify`), C3: API hồ sơ yêu cầu, C4: Project Generator dùng hồ sơ đã chốt, C5: UI hỏi làm rõ (+23 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 29 - "api.ts"
Cohesion: 0.08
Nodes (26): aiService, api, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, WS_BASE_URL, jobsService (+18 more)

### Community 30 - "wbs.py"
Cohesion: 0.06
Nodes (35): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), complete_milestone(), create_milestone(), delete_milestone() (+27 more)

### Community 31 - "useAuthStore"
Cohesion: 0.11
Nodes (24): mocks, mocks, EmailVerificationBannerProps, mocks, AvatarSectionProps, userService, AuthState, useAuthStore (+16 more)

### Community 32 - "User"
Cohesion: 0.07
Nodes (13): NotFoundException, EpicStatus, PhaseStatus, User, UserRepository, AIJobResponse, add_audit(), get_project_context() (+5 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.15
Nodes (19): metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+11 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (38): description, name, overrides, postcss, private, scripts, build, dev (+30 more)

### Community 36 - "test_auth_password_recovery.py"
Cohesion: 0.18
Nodes (17): forgot_password(), hash_password(), verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token() (+9 more)

### Community 37 - "UserService"
Cohesion: 0.11
Nodes (6): ServiceUnavailableException, UnauthorizedException, UnprocessableException, get_user_service(), UserService, test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data()

### Community 38 - "core/dependencies.py"
Cohesion: 0.06
Nodes (32): create_dependency(), delete_dependency(), list_dependencies(), delete_subtask(), update_subtask(), bulk_update_tasks(), change_task_status(), create_subtask() (+24 more)

### Community 39 - "Job"
Cohesion: 0.10
Nodes (33): JobResult, Job, aware(), enqueue(), JobService, LeaseLostError, safe_error_code(), utcnow() (+25 more)

### Community 40 - "project_service.py"
Cohesion: 0.26
Nodes (14): ProjectMethodology, ProjectStatus, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate (+6 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.08
Nodes (3): Portfolio, BaseRepository, ProjectRepository

### Community 42 - "oauth.py"
Cohesion: 0.20
Nodes (8): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), state_cookie_kwargs(), state_cookie_path()

### Community 43 - "AdminUserService"
Cohesion: 0.25
Nodes (18): AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts(), test_create_user_success(), test_deactivate_user_blocks_last_active_admin() (+10 more)

### Community 44 - "Modal"
Cohesion: 0.15
Nodes (28): Metric(), PortfolioDetailPage(), PortfoliosPage(), Modal(), ModalProps, Form(), usePortfolioHealth(), DeletePortfolioDialog() (+20 more)

### Community 45 - "test_security_state.py"
Cohesion: 0.11
Nodes (11): _request(), test_account_lock_is_durable_and_success_clears_it(), test_arbitrary_bearer_headers_cannot_change_the_throttle_identity(), test_concurrent_throttle_updates_preserve_every_failure(), broken_factory(), test_rate_limit_db_failure_blocks_the_endpoint(), test_rate_limit_persists_across_decorator_recreation(), test_revocation_ttl_cannot_end_before_the_token_expiry() (+3 more)

### Community 46 - "admin.py"
Cohesion: 0.13
Nodes (10): create_role(), delete_role(), get_role(), list_roles(), update_role(), AuditActorSummary, AuditLogResponse, PermissionResponse (+2 more)

### Community 47 - "oauth_state_store.py"
Cohesion: 0.06
Nodes (11): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, _key(), redeem(), get_redis_pubsub(), publish() (+3 more)

### Community 48 - "list_projects"
Cohesion: 0.17
Nodes (9): add_project_member(), change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), remove_project_member() (+1 more)

### Community 49 - "test_impact_analyzer.py"
Cohesion: 0.32
Nodes (12): RiskLevel, change_request(), FakeScalars, make_db(), patched_ai(), project(), task(), test_affected_task_ids_outside_project_are_filtered_out() (+4 more)

### Community 50 - "@tanstack/react-query"
Cohesion: 0.11
Nodes (37): aiJobKeys, useAIJob(), changeRequestKeys, useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow() (+29 more)

### Community 51 - "dashboard.py"
Cohesion: 0.18
Nodes (10): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, ProjectDashboardStats, ProjectStats, TaskStatusCount, TeamMemberUtilization (+2 more)

### Community 52 - "TaskStatus"
Cohesion: 0.12
Nodes (14): TaskStatus, _apply_status_side_effects(), sweep_task_dates(), _sweep_with_own_session(), test_sweep_is_noop_when_nothing_matches(), test_sweep_notifies_starting_and_due_soon_tasks_and_stamps_idempotency(), _task(), test_a_task_completed_without_ever_starting_still_gets_a_start_date() (+6 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.23
Nodes (16): avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage(), test_change_password_validates_current_password_and_revokes_sessions(), test_deactivate_anonymizes_profile_but_preserves_identity_and_relations() (+8 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "_index_names"
Cohesion: 0.25
Nodes (5): _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_the_daily_sweep_query_is_indexed(), test_the_gin_index_on_labels_is_declared_on_the_model()

### Community 56 - "JobRunner"
Cohesion: 0.09
Nodes (8): JobContext, JobRunner, test_old_reset_link_not_sent_after_new_request(), test_registration_outbox_rollback_and_no_precommit_delivery(), Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 57 - "run_risk_analysis"
Cohesion: 0.26
Nodes (12): RiskLevel, run_risk_analysis(), runner(), fake_db(), project(), _scalars_result(), test_invalid_risk_level_falls_back_to_score_derived_level(), test_missing_project_raises_value_error() (+4 more)

### Community 58 - "Task"
Cohesion: 0.10
Nodes (21): set_current_project_id(), Task, Worklog, TaskRepository, get_scheduling_service(), recalculate_project_cost(), recalculate_task_hours(), project_work() (+13 more)

### Community 59 - "AuditService"
Cohesion: 0.08
Nodes (23): AuditService, build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page(), 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001) (+15 more)

### Community 60 - "StorageService"
Cohesion: 0.15
Nodes (8): StorageError, StorageNotFoundError, StorageService, _put(), Email and private storage adapters, Existing file flow and scope, Local verification, Supabase Storage setup

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "AIService"
Cohesion: 0.13
Nodes (20): AIOutput, AIRequest, AIRequestStatus, AIRequestType, ImpactReport, RiskReport, mirror_ai_status(), AIService (+12 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.07
Nodes (27): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+19 more)

### Community 64 - "storage_service.py"
Cohesion: 0.16
Nodes (6): get_storage_service(), provider(), test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 65 - "RoleService"
Cohesion: 0.25
Nodes (12): RoleCreate, RoleUpdate, RoleService, build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role() (+4 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.19
Nodes (17): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+9 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (9): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog() (+1 more)

### Community 68 - "post"
Cohesion: 0.24
Nodes (9): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint(), SprintStatus (+1 more)

### Community 69 - "NotificationService"
Cohesion: 0.09
Nodes (13): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), MarkReadResponse, NotificationListResponse, NotificationResponse (+5 more)

### Community 70 - "Project"
Cohesion: 0.08
Nodes (18): schedule_jobs(), visible_jobs(), ChangeRequest, Dependency, Project, _build_prompt(), generate_impact_analysis(), get_ai_provider() (+10 more)

### Community 71 - "schemas/user.py"
Cohesion: 0.21
Nodes (8): AdminUserResponse, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, UserBase, UserCreate, UserResponse, UserUpdate

### Community 72 - "NotificationType"
Cohesion: 0.24
Nodes (11): NotificationType, TaskStatusUpdate, notify_project_team(), ProjectContext, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged(), test_notify_project_team_excludes_given_users(), test_notify_project_team_with_no_exclusions_notifies_everyone() (+3 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (13): generate_project(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest (+5 more)

### Community 74 - "typing"
Cohesion: 0.07
Nodes (19): JobResponse, get_client_ip(), get_db(), AuditLog, IDResponse, PaginatedResponse, get_admin_user_service(), get_audit_service() (+11 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 78 - "ChatService"
Cohesion: 0.10
Nodes (19): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+11 more)

### Community 79 - "BadRequestException"
Cohesion: 0.17
Nodes (6): BadRequestException, ProjectMemberResponse, _persist_plan(), get_project_service(), ProjectService, _persist_plan()

### Community 80 - "Settings"
Cohesion: 0.18
Nodes (10): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+2 more)

### Community 81 - "sweep_task_dates_task"
Cohesion: 0.14
Nodes (11): sweep_task_dates_task(), 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "auth_service.py"
Cohesion: 0.11
Nodes (20): clear(), issue(), consume(), issue(), _key(), get_redis(), claim_revocation(), is_revoked() (+12 more)

### Community 83 - "approvals.py"
Cohesion: 0.15
Nodes (5): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), update_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.13
Nodes (18): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), CRStatus, ChangeRequestCreate, ChangeRequestResponse, ChangeRequestService (+10 more)

### Community 85 - "main.py"
Cohesion: 0.06
Nodes (15): set_request_id(), client_key(), rate_limit_exceeded_handler(), _retry_after_seconds(), close_redis(), resolve_client_ip(), set_client_ip(), redis_listener() (+7 more)

### Community 86 - "documents.py"
Cohesion: 0.15
Nodes (5): create_documents(), delete_documents(), get_documents(), list_documents(), update_documents()

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.15
Nodes (5): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), update_gantt()

### Community 88 - "leaves.py"
Cohesion: 0.15
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 89 - "project_versions.py"
Cohesion: 0.15
Nodes (5): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), update_project_versions()

### Community 90 - "reports.py"
Cohesion: 0.15
Nodes (5): create_reports(), delete_reports(), get_reports(), list_reports(), update_reports()

### Community 91 - "security_state_service.py"
Cohesion: 0.25
Nodes (18): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+10 more)

### Community 92 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "OAuthService"
Cohesion: 0.19
Nodes (3): TokenResponse, OAuthService, OAuthState

### Community 94 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 95 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 96 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.12
Nodes (15): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001) (+7 more)

### Community 97 - "skills.py"
Cohesion: 0.15
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 98 - "DashboardService"
Cohesion: 0.20
Nodes (5): MyTaskItem, PortfolioProjectHealth, UserDashboardStats, DashboardService, _iso_week_bounds()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "risk_analyzer.py"
Cohesion: 0.10
Nodes (12): Assignment, Leave, LeaveStatus, LeaveType, _candidate_stats(), _as_list(), _clamp_score(), _compute_signals() (+4 more)

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 102 - "list_portfolios"
Cohesion: 0.17
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 103 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.13
Nodes (11): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001), Hiện trạng & Hạ tầng sẵn có (+3 more)

### Community 105 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (43): get_critical_path(), CPMResponse, CPMTask, run_cpm(), apply(), recalculate_project(), SchedulingService, backward_pass() (+35 more)

### Community 106 - "test_dashboard_activity_scope.py"
Cohesion: 0.18
Nodes (8): get_current_project_id(), _captured_where_text(), test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_project_id_default_reads_the_request_context(), test_recent_activity_filters_by_visible_projects(), test_recent_activity_returns_nothing_without_visible_projects(), test_select_over_audit_logs_still_compiles()

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (6): _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "conftest.py"
Cohesion: 0.09
Nodes (14): list_permissions(), seed(), Permission, Role, as_user(), factory(), override_db(), _disable_rate_limiting() (+6 more)

### Community 111 - "ProjectCreate"
Cohesion: 0.15
Nodes (3): create_project(), ProjectCreate, test_portfolio_and_project_schema_validation()

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "test_route_exposure.py"
Cohesion: 0.17
Nodes (7): UserSearchResult, _mask_email(), test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing(), test_project_role_options_do_not_carry_the_permission_matrix(), test_search_results_are_masked_end_to_end(), test_user_search_result_never_carries_a_usable_address()

### Community 115 - "audit/page.tsx"
Cohesion: 0.24
Nodes (11): AdminAuditPage(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs() (+3 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 118 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 119 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.14
Nodes (13): main(), Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent) (+5 more)

### Community 120 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 121 - "dashboards.py"
Cohesion: 0.23
Nodes (4): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), PortfolioHealthResponse

### Community 122 - "connectWebSocket"
Cohesion: 0.21
Nodes (7): connectWebSocket(), connect(), scheduleReconnect(), FakeSocket, flush(), WSClient, WSClientOptions

### Community 123 - "test_project_scoping.py"
Cohesion: 0.36
Nodes (6): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "pytest"
Cohesion: 0.14
Nodes (7): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry(), _paths_for(), test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 128 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 139 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.20
Nodes (9): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Hồ sơ yêu cầu và AI hỏi làm rõ, Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở), Quyết định kiến trúc, Rủi ro và giảm thiểu, Tài liệu SRS/BRD (+1 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 151 - "Rà soát 2026-09-06"
Cohesion: 0.25
Nodes (7): RecentActivityItem, Bảo mật, Còn nợ, Giao diện, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 154 - "env.py"
Cohesion: 0.38
Nodes (3): do_run_migrations(), run_async_migrations(), run_migrations_online()

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 157 - "security.py"
Cohesion: 0.08
Nodes (24): get_current_user(), get_current_user_media(), _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one() (+16 more)

### Community 158 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.33
Nodes (6): Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004), GIAI ĐOẠN 3.6 – AI Phân tích rủi ro (SOP-AI-005)

### Community 161 - "ai_tasks.py"
Cohesion: 0.07
Nodes (29): ImpactReportResponse, RiskReportResponse, AITaskType, generate_project_from_prompt(), get_ai_provider(), generate_project_task(), _generate_with_own_session(), impact_analysis_task() (+21 more)

### Community 166 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 170 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 172 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 184 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.33
Nodes (5): Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

## Knowledge Gaps
- **395 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+390 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1229 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatDate` to `User`, `Button`, `DashboardService`, `ChatPanel.tsx`, `NotificationService`, `PortfolioService`, `(dashboard)/layout.tsx`, `NotificationType`, `ConflictException`, `ForbiddenException`, `Modal`, `Chi tiết các Giai đoạn đã hoàn thành`, `ChatService`, `BadRequestException`, `projects/page.tsx`, `tasks/page.tsx`, `next-intl`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `PortfolioService`, `durable_handlers.py`, `ConflictException`, `ForbiddenException`, `AuthService`, `XkiroProvider`, `test_ws_hardening.py`, `users.py`, `AdminUserCreate`, `security.py`, `wbs.py`, `ai_tasks.py`, `UserService`, `core/dependencies.py`, `project_service.py`, `ProjectRepository`, `AdminUserService`, `test_security_state.py`, `oauth_state_store.py`, `dashboard.py`, `JobRunner`, `Task`, `AIService`, `RoleService`, `Project`, `endpoints/ai.py`, `typing`, `ChatService`, `BadRequestException`, `auth_service.py`, `test_change_request_service.py`, `OAuthService`, `DashboardService`, `risk_analyzer.py`, `test_auth_email_verification.py`, `list_portfolios`, `list_audit_logs`, `test_cpm_scheduling.py`, `test_oauth_account_takeover.py`, `conftest.py`, `ProjectCreate`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `RoleService`, `test_auth_password_recovery.py`, `UserService`, `Chi tiết các Giai đoạn đã hoàn thành`, `getApiErrorMessage`, `AuthService`, `AuditService`, `OAuthService`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _395 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_schedule_optimizer.py` be split into smaller, more focused modules?**
  _Cohesion score 0.14022988505747128 - nodes in this community are weakly interconnected._