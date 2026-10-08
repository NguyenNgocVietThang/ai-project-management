# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-09)

## Corpus Check
- 483 files · ~261,863 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 3880 nodes · 12304 edges · 192 communities (140 shown, 52 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1137 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48f2a441`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Button
- db/base.py
- post
- lucide-react
- Job
- portfolio_service.py
- users/page.tsx
- pytest
- tasks/page.tsx
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- react
- AIService
- types
- TaskStatus
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- list_portfolios
- ai_tasks.py
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- get_critical_path
- compilerOptions
- AuthService
- useChangeRequests.ts
- WBSService
- portfolios/[id]/page.tsx
- ForbiddenException
- (dashboard)/layout.tsx
- test_authz_matrix.py
- package.json
- schemas/task.py
- UserService
- TaskService
- test_auth_password_recovery.py
- getApiErrorMessage
- ProjectRepository
- oauth_service.py
- run_risk_analysis
- date_utils.py
- main.py
- schemas/auth.py
- test_oauth_account_takeover.py
- projects.py
- storage_service.py
- api.ts
- dashboard.py
- test_auth_email_verification.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- JobRunner
- Task
- test_audit_regressions.py
- scheduling_tasks.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- sprints.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- AuditLog
- useAuthStore
- worklogs.py
- dashboard.types.ts
- test_reported_metrics_are_real.py
- AdminUserService
- test_portfolio_project_core.py
- User
- endpoints/ai.py
- typing
- test_resource_warnings.py
- durable_jobs.py
- AGENTS.md
- ChatService
- enqueue
- Settings
- sweep_task_dates_task
- test_security_state.py
- approvals.py
- test_change_request_service.py
- logging_config.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- security_state_service.py
- system.py
- BadRequestException
- BaseRepository
- client
- Tài liệu yêu cầu nghiệp vụ (BRD)
- skills.py
- list_notifications
- next.config.js
- Chi tiết các Giai đoạn đã hoàn thành
- cron_service.py
- @tanstack/react-query
- milestones.py
- Project
- epics.py
- middleware.ts
- AuditService
- Rà soát code và nâng cấp giao diện — 2026-09-15
- BurndownChart.tsx
- NotFoundException
- playwright
- Chi tiết các Giai đoạn
- auth_service.py
- Kế hoạch: Render Free + Supabase Free
- LanguageToggle.tsx
- list_permissions
- .__init__
- Lộ trình: Auth & User Onboarding Module (Phase 1)
- schemas/gantt.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- BaseAIProvider
- list_jobs
- XkiroProvider
- report_tasks.py
- test_cloud_adapters.py
- test_dashboard_metrics.py
- 11. Cài đặt và Chạy hệ thống
- ProjectCreate
- test_ai_service.py
- dashboards.py
- test_project_scoping.py
- Rà soát 2026-09-06
- DashboardService
- resource-recommendation.service.ts
- list_audit_logs
- schedule-optimization.types.ts
- 10. Đặc tả API và các điểm cuối WebSocket
- run_impact_analysis
- resource_leveling
- test_cpm_scheduling.py
- env.py
- README.md
- StorageService
- Demo Render Free + Supabase Free
- Rà soát cuối: Render Free + Supabase Free
- Backend local verification — 2026-10-09
- Tiến độ — tasks/plan.md
- 12. Cấu hình & Biến môi trường
- Email and private storage adapters
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time

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
- `GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001)` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `Hiện trạng & Hạ tầng sẵn có` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py

## Import Cycles
- None detected.

## Communities (192 total, 52 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.15
Nodes (17): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), _validate_and_filter_result(), _db_with(), _fake_provider() (+9 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (87): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+79 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (20): Approval, ApprovalStatus, Base, ChangeRequest, ChatReadState, Comment, Document, DocumentType (+12 more)

### Community 3 - "post"
Cohesion: 0.14
Nodes (13): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+5 more)

### Community 4 - "lucide-react"
Cohesion: 0.08
Nodes (45): Danh mục tính năng đã triển khai, DashboardPage(), DashboardError(), ProjectsPage(), GlobalError(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES (+37 more)

### Community 5 - "Job"
Cohesion: 0.12
Nodes (16): Job, aware(), JobService, LeaseLostError, safe_error_code(), utcnow(), test_rejected_provider_request_has_known_outcome_and_closes_client(), postgres_factory() (+8 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.12
Nodes (12): create_portfolio(), PortfolioStatus, PortfolioRepository, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary (+4 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (45): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+37 more)

### Community 8 - "pytest"
Cohesion: 0.08
Nodes (17): run_email(), EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task() (+9 more)

### Community 9 - "tasks/page.tsx"
Cohesion: 0.10
Nodes (38): Field(), KanbanColumn(), Select(), SprintView(), STATUSES, TaskCard(), TaskCreateModal(), TasksPage() (+30 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 12 - "react"
Cohesion: 0.07
Nodes (38): ResetPasswordContent(), ResetPasswordPage(), AdminLayout(), TABS, AdminIndexPage(), MiniProgressBar(), MiniProgressBarProps, Avatar() (+30 more)

### Community 13 - "AIService"
Cohesion: 0.10
Nodes (22): AIRequest, generate_project_from_prompt(), AIService, get_ai_service(), generate_project_task(), _generate_with_own_session(), _run_generation(), test_ai_broker_outage_still_enqueues_transactional_durable_job() (+14 more)

### Community 14 - "types"
Cohesion: 0.09
Nodes (21): get_current_user(), get_current_user_media(), _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one() (+13 more)

### Community 15 - "TaskStatus"
Cohesion: 0.07
Nodes (25): Notification, NotificationType, TaskStatus, MarkReadResponse, NotificationListResponse, NotificationResponse, UnreadCountResponse, sweep_task_dates() (+17 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.15
Nodes (24): AIGeneratorModal(), STATUS_LABEL, useGenerateProject(), portfolioKeys, InitialProjectMember, projectKeys, useCreateProject(), useProjects() (+16 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (27): chat_ws(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws() (+19 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (16): change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user() (+8 more)

### Community 20 - "list_portfolios"
Cohesion: 0.17
Nodes (4): delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 21 - "ai_tasks.py"
Cohesion: 0.09
Nodes (19): ImpactReportResponse, RiskReportResponse, run_resource_recommendation(), impact_analysis_task(), _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task() (+11 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (12): _lock_seconds(), record_failure(), seconds_until_unlocked(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip(), test_authenticate_refuses_while_locked_without_hashing_a_password(), test_lockout_backs_off_further_with_each_extra_failure() (+4 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.10
Nodes (21): AIResponseError, _extract_balanced_object(), parse_json_object(), _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), test_parses_the_wrappers_models_actually_emit() (+13 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.06
Nodes (35): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel() (+27 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.10
Nodes (8): TooManyRequestsException, SecurityLimiter, decorator(), wrapper(), AuthService, Chuyển mode và nghiệm thu, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 29 - "useChangeRequests.ts"
Cohesion: 0.16
Nodes (14): changeRequestKeys, api, ChangeRequestCreateInput, changeRequestService, RiskAnalysisJobResponse, RiskAnalysisJobStatus, RiskAnalysisResultResponse, ChangeRequest (+6 more)

### Community 30 - "WBSService"
Cohesion: 0.06
Nodes (29): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), update_phase(), EpicStatus (+21 more)

### Community 31 - "portfolios/[id]/page.tsx"
Cohesion: 0.17
Nodes (25): Metric(), PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioForm(), PortfolioFormProps, PortfolioList() (+17 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.11
Nodes (9): require_roles(), role_checker(), ForbiddenException, SubtaskStatus, add_audit(), get_task_context(), json_value(), serialize_model() (+1 more)

### Community 33 - "(dashboard)/layout.tsx"
Cohesion: 0.11
Nodes (29): AuthLayout(), DashboardLayout(), metadata, RootLayout(), viewport, Providers(), ThemedToaster(), Brand() (+21 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (42): description, name, overrides, postcss, private, scripts, build, dev (+34 more)

### Community 36 - "schemas/task.py"
Cohesion: 0.05
Nodes (43): create_assignment(), delete_assignment(), my_assignments(), create_dependency(), delete_dependency(), list_dependencies(), delete_subtask(), update_subtask() (+35 more)

### Community 37 - "UserService"
Cohesion: 0.13
Nodes (9): ServiceUnavailableException, DeleteAccountRequest, OAuthConnectResponse, UserBase, UserCreate, UserResponse, UserUpdate, get_user_service() (+1 more)

### Community 38 - "TaskService"
Cohesion: 0.14
Nodes (8): TaskPriority, TaskDetailResponse, TaskResponse, get_task_service(), _require_task_reader(), TaskService, test_customer_role_cannot_read_project_work_items(), GIAI ĐOẠN 2.8 – Task Notification Triggers & Celery Beat Daily Sweep (SOP-NOTI-001)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.20
Nodes (16): hash_password(), verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message() (+8 more)

### Community 40 - "getApiErrorMessage"
Cohesion: 0.10
Nodes (44): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), AdminAuditPage(), DashboardLoading(), AIInsightsPage(), ChangeRequestsPage() (+36 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.11
Nodes (4): ProjectMethodology, ProjectStatus, ProjectRepository, get_project_service()

### Community 42 - "oauth_service.py"
Cohesion: 0.11
Nodes (14): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), code_challenge_for(), consume() (+6 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.23
Nodes (14): RiskLevel, _level_from_score(), _normalize_level(), run_risk_analysis(), runner(), fake_db(), project(), _scalars_result() (+6 more)

### Community 44 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 45 - "main.py"
Cohesion: 0.07
Nodes (13): set_request_id(), client_key(), rate_limit_exceeded_handler(), _retry_after_seconds(), close_redis(), resolve_client_ip(), set_client_ip(), attach_request_id() (+5 more)

### Community 46 - "schemas/auth.py"
Cohesion: 0.18
Nodes (10): validate_password_policy(), AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, RefreshRequest, RegisterRequest (+2 more)

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (6): _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 48 - "projects.py"
Cohesion: 0.17
Nodes (10): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+2 more)

### Community 49 - "storage_service.py"
Cohesion: 0.14
Nodes (6): get_storage_service(), provider(), test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 50 - "api.ts"
Cohesion: 0.11
Nodes (25): EmailVerificationBannerProps, AvatarSectionProps, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, WS_BASE_URL, userService (+17 more)

### Community 51 - "dashboard.py"
Cohesion: 0.18
Nodes (10): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, ProjectDashboardStats, ProjectStats, TaskStatusCount, TeamMemberUtilization (+2 more)

### Community 52 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (18): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage() (+10 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "JobRunner"
Cohesion: 0.09
Nodes (8): JobContext, JobRunner, test_old_reset_link_not_sent_after_new_request(), test_registration_outbox_rollback_and_no_precommit_delivery(), Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 57 - "Task"
Cohesion: 0.10
Nodes (13): ChatMessage, Epic, Subtask, Task, TaskRepository, _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in() (+5 more)

### Community 58 - "test_audit_regressions.py"
Cohesion: 0.12
Nodes (17): Worklog, get_scheduling_service(), recalculate_project(), recalculate_project_cost(), recalculate_task_hours(), SchedulingService, project_work(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere() (+9 more)

### Community 59 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 60 - "ProjectService"
Cohesion: 0.17
Nodes (13): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+5 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "sprints.py"
Cohesion: 0.27
Nodes (7): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint()

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.11
Nodes (19): 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 3. Ngăn xếp công nghệ, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án, 6. Lược đồ cơ sở dữ liệu (8 Domains & 34 Tables) (+11 more)

### Community 64 - "AuditLog"
Cohesion: 0.16
Nodes (11): get_client_ip(), get_current_project_id(), set_current_project_id(), AuditLog, _captured_where_text(), test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_project_id_default_reads_the_request_context() (+3 more)

### Community 66 - "useAuthStore"
Cohesion: 0.11
Nodes (24): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+16 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (9): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog() (+1 more)

### Community 68 - "dashboard.types.ts"
Cohesion: 0.20
Nodes (10): TeamBarChartProps, dashboardService, BudgetSummary, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats, TaskStatusCount, TeamMemberUtilization (+2 more)

### Community 69 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (11): _apply_status_side_effects(), _task(), test_a_task_completed_without_ever_starting_still_gets_a_start_date(), test_epic_story_points_are_rolled_up_from_tasks(), test_finishing_work_records_the_end_date(), test_progress_can_be_reported_between_the_extremes(), test_progress_outside_zero_to_one_hundred_is_rejected(), test_project_cost_is_derived_from_logged_hours_and_rates() (+3 more)

### Community 70 - "AdminUserService"
Cohesion: 0.09
Nodes (31): AdminUserCreate, AdminUserResponse, AdminUserUpdate, AuditActorSummary, AuditLogResponse, PermissionResponse, RoleOptionResponse, UserSearchResult (+23 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 72 - "User"
Cohesion: 0.08
Nodes (9): _is_still_a_member(), get_current_active_superuser(), get_current_verified_user(), User, UserRepository, AIJobResponse, ChangeRequestResponse, get_project_context() (+1 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (13): generate_project(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest (+5 more)

### Community 74 - "typing"
Cohesion: 0.08
Nodes (15): JobResponse, get_db(), DependencyType, IDResponse, PaginatedResponse, CPMResponse, CPMTask, get_admin_user_service() (+7 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "durable_jobs.py"
Cohesion: 0.14
Nodes (16): AIOutput, AIRequestStatus, AIRequestType, ImpactReport, RiskReport, authorize_request(), mirror_ai_status(), run_ai() (+8 more)

### Community 78 - "ChatService"
Cohesion: 0.10
Nodes (19): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+11 more)

### Community 79 - "enqueue"
Cohesion: 0.17
Nodes (19): JobResult, run_daily_batch(), apply(), enqueue(), test_cpm_latest_edit_survives_old_generation_exhausting_retries(), test_external_dispatch_without_checkpoint_requires_manual_review(), test_obsolete_cpm_generation_does_not_apply_stale_schedule(), handler() (+11 more)

### Community 80 - "Settings"
Cohesion: 0.18
Nodes (10): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+2 more)

### Community 81 - "sweep_task_dates_task"
Cohesion: 0.12
Nodes (13): parse_document_task(), sweep_task_dates_task(), 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View) (+5 more)

### Community 82 - "test_security_state.py"
Cohesion: 0.12
Nodes (17): durable_store(), _request(), test_actual_refresh_concurrency_issues_at_most_one_token_pair(), rotate(), test_arbitrary_bearer_headers_cannot_change_the_throttle_identity(), test_concurrent_refresh_claim_has_exactly_one_winner(), test_concurrent_throttle_updates_preserve_every_failure(), broken_factory() (+9 more)

### Community 83 - "approvals.py"
Cohesion: 0.15
Nodes (5): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), update_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.15
Nodes (17): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), CRStatus, ChangeRequestCreate, ChangeRequestService, fake_db() (+9 more)

### Community 85 - "logging_config.py"
Cohesion: 0.14
Nodes (6): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, main(), seed()

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
Cohesion: 0.27
Nodes (18): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+10 more)

### Community 92 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "BadRequestException"
Cohesion: 0.17
Nodes (6): BadRequestException, UnauthorizedException, TokenResponse, get_oauth_service(), OAuthService, OAuthState

### Community 95 - "client"
Cohesion: 0.15
Nodes (9): as_user(), factory(), client(), override_db(), _disable_rate_limiting(), event_loop(), make_user(), factory() (+1 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.20
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "skills.py"
Cohesion: 0.15
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 98 - "list_notifications"
Cohesion: 0.15
Nodes (5): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.33
Nodes (6): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001)

### Community 102 - "cron_service.py"
Cohesion: 0.16
Nodes (4): schedule_jobs(), enqueue_due_schedules(), test_cron_auth_and_duplicate_requests(), test_schedule_vietnam_time_and_limited_catchup()

### Community 103 - "@tanstack/react-query"
Cohesion: 0.09
Nodes (37): aiJobKeys, useAIJob(), useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow(), JobsPanel() (+29 more)

### Community 104 - "milestones.py"
Cohesion: 0.28
Nodes (6): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), update_milestone()

### Community 105 - "Project"
Cohesion: 0.06
Nodes (25): visible_jobs(), Assignment, Dependency, Leave, LeaveStatus, LeaveType, Project, _build_prompt() (+17 more)

### Community 106 - "epics.py"
Cohesion: 0.29
Nodes (5): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic()

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "AuditService"
Cohesion: 0.27
Nodes (4): AuditService, build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page()

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "BurndownChart.tsx"
Cohesion: 0.22
Nodes (8): Danh mục tính năng triển khai theo Phase, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, BurndownPoint, recharts

### Community 111 - "NotFoundException"
Cohesion: 0.10
Nodes (22): create_role(), delete_role(), get_role(), list_roles(), update_role(), ConflictException, NotFoundException, Role (+14 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "Chi tiết các Giai đoạn"
Cohesion: 0.20
Nodes (9): 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4) (+1 more)

### Community 115 - "auth_service.py"
Cohesion: 0.09
Nodes (15): clear(), _identity_key(), issue(), _key(), redeem(), get_redis(), get_redis_pubsub(), claim_revocation() (+7 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "LanguageToggle.tsx"
Cohesion: 0.40
Nodes (6): setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 121 - "Lộ trình: Auth & User Onboarding Module (Phase 1)"
Cohesion: 0.22
Nodes (5): 6 Trụ cột chính:, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Auth & User Onboarding Module (Phase 1), Rà soát bảo mật 2026-09-06, Tổng quan Module

### Community 123 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 137 - "XkiroProvider"
Cohesion: 0.16
Nodes (11): AmbiguousJobError, JobError, PermanentJobError, RetryableJobError, reserve_ai_call(), XkiroProvider, apply(), test_budget_resets_at_vietnam_midnight() (+3 more)

### Community 139 - "test_cloud_adapters.py"
Cohesion: 0.17
Nodes (18): email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified(), test_email_transport_timeout_hides_secrets_and_retains_retry_key(), test_minio_compatibility_releases_download_connection(), test_resend_errors_are_sanitized_and_classified(), test_resend_missing_key_fails_explicitly(), test_resend_retries_keep_key_and_escape_template() (+10 more)

### Community 145 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "ProjectCreate"
Cohesion: 0.20
Nodes (3): ProjectCreate, ProjectUpdate, test_portfolio_and_project_schema_validation()

### Community 150 - "test_ai_service.py"
Cohesion: 0.38
Nodes (9): ai_request(), authorized_project_context(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 151 - "dashboards.py"
Cohesion: 0.23
Nodes (4): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), PortfolioHealthResponse

### Community 152 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (7): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing(), two_projects()

### Community 153 - "Rà soát 2026-09-06"
Cohesion: 0.25
Nodes (7): RecentActivityItem, Bảo mật, Còn nợ, Giao diện, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 154 - "DashboardService"
Cohesion: 0.20
Nodes (5): MyTaskItem, PortfolioProjectHealth, UserDashboardStats, DashboardService, _iso_week_bounds()

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 158 - "schedule-optimization.types.ts"
Cohesion: 0.32
Nodes (6): ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 159 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 161 - "run_impact_analysis"
Cohesion: 0.24
Nodes (14): RiskLevel, run_impact_analysis(), _validate_ai_output(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+6 more)

### Community 164 - "test_cpm_scheduling.py"
Cohesion: 0.10
Nodes (31): run_cpm(), backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+23 more)

### Community 165 - "env.py"
Cohesion: 0.38
Nodes (3): do_run_migrations(), run_async_migrations(), run_migrations_online()

### Community 167 - "StorageService"
Cohesion: 0.22
Nodes (5): StorageError, StorageNotFoundError, StorageService, _put(), Supabase Storage setup

### Community 170 - "Demo Render Free + Supabase Free"
Cohesion: 0.33
Nodes (6): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume

### Community 172 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 184 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.40
Nodes (4): Kiểm thử, Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Môi trường phía giao diện (`frontend/.env.local`), Môi trường phía máy chủ (`backend/.env`)

### Community 187 - "Email and private storage adapters"
Cohesion: 0.50
Nodes (3): Email and private storage adapters, Existing file flow and scope, Local verification

### Community 190 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 191 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

## Knowledge Gaps
- **348 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+343 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1177 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `lucide-react` to `ForbiddenException`, `(dashboard)/layout.tsx`, `useAuthStore`, `Button`, `portfolio_service.py`, `TaskService`, `tasks/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `react`, `ChatService`, `TaskStatus`, `useNotifications.ts`, `DashboardService`, `ProjectService`, `WBSService`, `portfolios/[id]/page.tsx`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `pytest`, `AIService`, `types`, `test_ws_hardening.py`, `users.py`, `list_portfolios`, `ai_tasks.py`, `DashboardService`, `AuthService`, `list_audit_logs`, `WBSService`, `ForbiddenException`, `UserService`, `TaskService`, `ProjectRepository`, `oauth_service.py`, `test_oauth_account_takeover.py`, `projects.py`, `dashboard.py`, `test_auth_email_verification.py`, `JobRunner`, `test_audit_regressions.py`, `ProjectService`, `AdminUserService`, `endpoints/ai.py`, `typing`, `durable_jobs.py`, `ChatService`, `enqueue`, `test_security_state.py`, `test_change_request_service.py`, `logging_config.py`, `BadRequestException`, `client`, `cron_service.py`, `Project`, `NotFoundException`, `auth_service.py`, `list_permissions`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `UserService`, `test_auth_password_recovery.py`, `getApiErrorMessage`, `users/page.tsx`, `AuditService`, `NotFoundException`, `Lộ trình: Auth & User Onboarding Module (Phase 1)`, `AuthService`, `BadRequestException`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _348 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05798319327731093 - nodes in this community are weakly interconnected._