# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-12)

## Corpus Check
- 482 files · ~271,905 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 3892 nodes · 12320 edges · 179 communities (134 shown, 45 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1138 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07fe9167`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Alert
- db/base.py
- post
- formatStatus
- (dashboard)/layout.tsx
- test_portfolio_project_core.py
- users/page.tsx
- durable_handlers.py
- ForbiddenException
- test_auth_cookies.py
- TaskService
- react
- test_ai_service.py
- auth_service.py
- XkiroProvider
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- tasks/page.tsx
- useNotifications.ts
- test_login_lockout.py
- test_risk_analyzer.py
- ConnectionManager
- get_critical_path
- compilerOptions
- devDependencies
- api.ts
- wbs.py
- useAuthStore
- User
- ThemeProvider.tsx
- test_authz_matrix.py
- package.json
- tasks.py
- user_service.py
- schemas/task.py
- enqueue
- LoadingState
- ProjectRepository
- oauth.py
- AdminUserService
- Button
- test_durable_jobs_postgres.py
- admin.py
- env.py
- list_projects
- test_impact_analyzer.py
- @tanstack/react-query
- DashboardService
- test_reported_metrics_are_real.py
- test_user_profile_settings.py
- dependencies
- ChatMessage
- JobRunner
- FastAPI
- Task
- Chi tiết các Giai đoạn
- StorageService
- Thiết kế kiến trúc hệ thống
- Job
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- storage_service.py
- RoleService
- ChatPanel.tsx
- worklogs.py
- TeamBarChart.tsx
- NotificationService
- impact_analyzer.py
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
- test_security_state.py
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
- oauth_service.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- my_assignments
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- skills.py
- list_notifications
- next.config.js
- risk_analyzer.py
- pytest
- test_durable_cron.py
- Chi tiết các Giai đoạn đã hoàn thành
- PaginatedResponse
- test_cpm_scheduling.py
- test_dashboard_activity_scope.py
- middleware.ts
- job_runner.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- fixture
- scripts
- playwright
- BurndownChart.tsx
- audit/page.tsx
- Kế hoạch: Render Free + Supabase Free
- vitest.config.mts
- DependencyCreate
- .__init__
- Email and private storage adapters
- AuditService
- test_project_scoping.py
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- test_route_trailing_slash.py
- Frontend durable jobs verification
- list_jobs
- date_utils.py
- report_tasks.py
- sweep_task_dates
- useNotificationSocket
- Durable jobs verification
- 11. Cài đặt và Chạy hệ thống
- 3. Ngăn xếp công nghệ
- tailwind.config.ts
- get_current_active_superuser
- ApprovalStatus
- DocumentType
- resource-recommendation.service.ts
- security.py
- schedule-optimization.types.ts
- EmailStatus
- AIService
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
- `Implemented contract` --references--> `JobRunner`  [INFERRED]
  docs/job-core-verification.md → backend/app/core/job_runner.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001)` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `Hiện trạng & Hạ tầng sẵn có` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `Chuyển mode và nghiệm thu` --references--> `AuthService`  [INFERRED]
  docs/security-state-audit.md → backend/app/services/auth_service.py

## Import Cycles
- None detected.

## Communities (179 total, 45 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.15
Nodes (17): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), _validate_and_filter_result(), _db_with(), _fake_provider() (+9 more)

### Community 1 - "Alert"
Cohesion: 0.06
Nodes (69): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, metadata (+61 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (21): Approval, Assignment, Base, ChatReadState, Comment, DependencyType, Document, EmailLog (+13 more)

### Community 3 - "post"
Cohesion: 0.11
Nodes (23): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+15 more)

### Community 4 - "formatStatus"
Cohesion: 0.08
Nodes (44): Danh mục tính năng đã triển khai, DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), MiniProgressBar(), ActiveProjectsGrid(), ActiveProjectsGridProps (+36 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.15
Nodes (21): AuthLayout(), AdminLayout(), TABS, AdminIndexPage(), DashboardLayout(), FullPageSpinner(), Brand(), LanguageToggle() (+13 more)

### Community 6 - "test_portfolio_project_core.py"
Cohesion: 0.06
Nodes (30): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio(), Portfolio, PortfolioStatus, PortfolioRepository (+22 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.09
Nodes (43): AdminRolesPage(), AdminUsersPage(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys, useAdminRoles(), useCreateRole() (+35 more)

### Community 8 - "durable_handlers.py"
Cohesion: 0.12
Nodes (13): run_email(), EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task() (+5 more)

### Community 9 - "ForbiddenException"
Cohesion: 0.08
Nodes (13): _is_still_a_member(), get_current_verified_user(), require_roles(), role_checker(), ConflictException, ForbiddenException, NotFoundException, add_audit() (+5 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "TaskService"
Cohesion: 0.13
Nodes (12): TaskPriority, TaskDetailResponse, TaskResponse, TaskService, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+4 more)

### Community 12 - "react"
Cohesion: 0.07
Nodes (47): OAuthCallbackContent(), OAuthCallbackPage(), VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), DashboardError(), AIInsightsPage() (+39 more)

### Community 13 - "test_ai_service.py"
Cohesion: 0.38
Nodes (9): ai_request(), authorized_project_context(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 14 - "auth_service.py"
Cohesion: 0.09
Nodes (20): ServiceUnavailableException, TooManyRequestsException, hash_password(), verify_password(), ResetPasswordRequest, AuthService, get_auth_service(), build_request() (+12 more)

### Community 15 - "XkiroProvider"
Cohesion: 0.10
Nodes (13): AmbiguousJobError, JobError, PermanentJobError, RetryableJobError, BaseAIProvider, reserve_ai_call(), get_ai_provider(), XkiroProvider (+5 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.15
Nodes (29): ProjectMembersPage(), ProjectsPage(), InviteMemberDialog(), InitialProjectMember, ProjectWizard(), useAddProjectMember(), useAssignableRoles(), useProjectMembers() (+21 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (28): chat_ws(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws() (+20 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (15): connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user(), list_users() (+7 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.15
Nodes (19): client(), email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified(), test_email_transport_timeout_hides_secrets_and_retains_retry_key(), test_minio_compatibility_releases_download_connection(), test_resend_errors_are_sanitized_and_classified(), test_resend_missing_key_fails_explicitly() (+11 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.15
Nodes (23): Field(), KanbanColumn(), Select(), SprintView(), STATUSES, TaskCard(), TaskCreateModal(), TasksPage() (+15 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (14): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip() (+6 more)

### Community 24 - "test_risk_analyzer.py"
Cohesion: 0.07
Nodes (31): AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider() (+23 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (8): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel()

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 29 - "api.ts"
Cohesion: 0.08
Nodes (25): aiService, api, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, WS_BASE_URL, ChangeRequestCreateInput (+17 more)

### Community 30 - "wbs.py"
Cohesion: 0.05
Nodes (43): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), complete_milestone(), create_milestone(), delete_milestone() (+35 more)

### Community 31 - "useAuthStore"
Cohesion: 0.12
Nodes (23): mocks, mocks, EmailVerificationBannerProps, mocks, authService, userService, AuthState, useAuthStore (+15 more)

### Community 32 - "User"
Cohesion: 0.08
Nodes (9): EpicStatus, PhaseStatus, User, UserRepository, AIJobResponse, get_project_context(), require_project_roles(), WBSService (+1 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.16
Nodes (17): metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+9 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (27): description, name, overrides, postcss, private, version, autoprefixer, clsx (+19 more)

### Community 36 - "tasks.py"
Cohesion: 0.16
Nodes (10): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+2 more)

### Community 37 - "user_service.py"
Cohesion: 0.08
Nodes (15): UnauthorizedException, AuditLog, UserSearchResult, DeleteAccountRequest, _require_task_reader(), get_user_service(), _mask_email(), UserService (+7 more)

### Community 38 - "schemas/task.py"
Cohesion: 0.09
Nodes (22): delete_subtask(), update_subtask(), GanttResponse, GanttTask, AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyResponse (+14 more)

### Community 39 - "enqueue"
Cohesion: 0.18
Nodes (19): JobResult, run_daily_batch(), apply(), enqueue(), test_cpm_latest_edit_survives_old_generation_exhausting_retries(), test_external_dispatch_without_checkpoint_requires_manual_review(), test_obsolete_cpm_generation_does_not_apply_stale_schedule(), handler() (+11 more)

### Community 40 - "LoadingState"
Cohesion: 0.10
Nodes (40): DashboardLoading(), ChangeRequestsPage(), ProjectLayout(), Metric(), TimesheetPage(), Badge(), DeletePhaseDialog(), Editor (+32 more)

### Community 42 - "oauth.py"
Cohesion: 0.23
Nodes (7): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), state_cookie_path()

### Community 43 - "AdminUserService"
Cohesion: 0.27
Nodes (19): AdminUserCreate, AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts(), test_create_user_success() (+11 more)

### Community 44 - "Button"
Cohesion: 0.09
Nodes (45): Metric(), PortfolioDetailPage(), PortfoliosPage(), ProjectSettingsPage(), Button, ConfirmDialog(), ConfirmDialogProps, Modal() (+37 more)

### Community 45 - "test_durable_jobs_postgres.py"
Cohesion: 0.15
Nodes (5): postgres_factory(), test_postgres_concurrent_ai_dispatch_reservations_enforce_daily_cap(), reserve(), test_postgres_concurrent_dedupe_and_skip_locked_claims(), test_postgres_jobs_migration_upgrade_downgrade()

### Community 46 - "admin.py"
Cohesion: 0.11
Nodes (12): create_role(), delete_role(), get_role(), list_roles(), update_role(), AuditActorSummary, AuditLogResponse, PermissionResponse (+4 more)

### Community 47 - "env.py"
Cohesion: 0.10
Nodes (9): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, main() (+1 more)

### Community 48 - "list_projects"
Cohesion: 0.17
Nodes (9): add_project_member(), change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), remove_project_member() (+1 more)

### Community 49 - "test_impact_analyzer.py"
Cohesion: 0.38
Nodes (11): change_request(), FakeScalars, make_db(), patched_ai(), project(), task(), test_affected_task_ids_outside_project_are_filtered_out(), test_existing_impact_report_is_updated_in_place_not_duplicated() (+3 more)

### Community 50 - "@tanstack/react-query"
Cohesion: 0.13
Nodes (31): aiJobKeys, useAIJob(), changeRequestKeys, useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow() (+23 more)

### Community 51 - "DashboardService"
Cohesion: 0.05
Nodes (36): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem (+28 more)

### Community 52 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (11): _apply_status_side_effects(), _task(), test_a_task_completed_without_ever_starting_still_gets_a_start_date(), test_epic_story_points_are_rolled_up_from_tasks(), test_finishing_work_records_the_end_date(), test_progress_can_be_reported_between_the_extremes(), test_progress_outside_zero_to_one_hundred_is_rejected(), test_project_cost_is_derived_from_logged_hours_and_rates() (+3 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (18): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage() (+10 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "ChatMessage"
Cohesion: 0.18
Nodes (6): ChatMessage, _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_the_daily_sweep_query_is_indexed(), test_the_gin_index_on_labels_is_declared_on_the_model()

### Community 56 - "JobRunner"
Cohesion: 0.14
Nodes (3): JobContext, JobRunner, test_old_reset_link_not_sent_after_new_request()

### Community 57 - "FastAPI"
Cohesion: 0.13
Nodes (6): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), get_current_user(), get_current_user_media()

### Community 58 - "Task"
Cohesion: 0.06
Nodes (31): set_current_project_id(), Dependency, Project, Task, Worklog, TaskRepository, CPMResponse, CPMTask (+23 more)

### Community 59 - "Chi tiết các Giai đoạn"
Cohesion: 0.20
Nodes (9): 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4) (+1 more)

### Community 60 - "StorageService"
Cohesion: 0.22
Nodes (5): StorageError, StorageNotFoundError, StorageService, _put(), Supabase Storage setup

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "Job"
Cohesion: 0.27
Nodes (10): Job, aware(), JobService, utcnow(), test_staged_provider_response_resumes_after_restart(), test_postgres_recovers_after_worker_process_dies(), test_postgres_restart_recovery_fences_abandoned_worker(), test_cpm_edits_while_running_force_another_generation() (+2 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.07
Nodes (27): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+19 more)

### Community 64 - "storage_service.py"
Cohesion: 0.14
Nodes (6): get_storage_service(), provider(), test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 65 - "RoleService"
Cohesion: 0.29
Nodes (11): RoleUpdate, RoleService, build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role(), test_delete_role_blocks_when_users_still_assigned() (+3 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (24): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys (+16 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (9): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog() (+1 more)

### Community 68 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 69 - "NotificationService"
Cohesion: 0.15
Nodes (9): MarkReadResponse, NotificationListResponse, NotificationResponse, UnreadCountResponse, get_notification_service(), NotificationService, test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket() (+1 more)

### Community 70 - "impact_analyzer.py"
Cohesion: 0.19
Nodes (8): ChangeRequest, _build_prompt(), generate_impact_analysis(), get_ai_provider(), run_impact_analysis(), _summarize_cpm(), _truncate(), _validate_ai_output()

### Community 71 - "schemas/user.py"
Cohesion: 0.12
Nodes (6): validate_password_policy(), OAuthConnectResponse, UserBase, UserCreate, UserResponse, UserUpdate

### Community 72 - "NotificationType"
Cohesion: 0.25
Nodes (12): NotificationType, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged(), test_notify_project_team_excludes_given_users() (+4 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (13): generate_project(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest (+5 more)

### Community 74 - "typing"
Cohesion: 0.04
Nodes (17): JobResponse, visible_jobs(), list_permissions(), get_db(), Permission, Role, get_admin_user_service(), get_audit_service() (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 78 - "ChatService"
Cohesion: 0.09
Nodes (19): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+11 more)

### Community 79 - "BadRequestException"
Cohesion: 0.10
Nodes (22): create_project(), BadRequestException, ProjectMethodology, ProjectStatus, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+14 more)

### Community 80 - "Settings"
Cohesion: 0.10
Nodes (15): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+7 more)

### Community 81 - "sweep_task_dates_task"
Cohesion: 0.22
Nodes (7): sweep_task_dates_task(), Chi tiết các Giai đoạn, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness

### Community 82 - "test_security_state.py"
Cohesion: 0.06
Nodes (35): issue(), _key(), redeem(), consume(), issue(), _key(), state_cookie_kwargs(), get_redis() (+27 more)

### Community 83 - "approvals.py"
Cohesion: 0.15
Nodes (5): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), update_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.18
Nodes (14): CRStatus, ChangeRequestCreate, ChangeRequestResponse, ChangeRequestService, fake_db(), project_context(), _simulate_db_defaults(), test_member_cannot_create_change_request() (+6 more)

### Community 85 - "main.py"
Cohesion: 0.06
Nodes (16): set_request_id(), client_key(), rate_limit_exceeded_handler(), _retry_after_seconds(), SecurityLimiter, decorator(), wrapper(), close_redis() (+8 more)

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
Cohesion: 0.29
Nodes (18): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+10 more)

### Community 92 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "oauth_service.py"
Cohesion: 0.08
Nodes (13): code_challenge_for(), new_code_verifier(), TokenResponse, get_oauth_service(), OAuthService, OAuthState, test_oauth_merges_into_local_account_when_provider_verified_the_email(), _service_with_existing() (+5 more)

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

### Community 98 - "list_notifications"
Cohesion: 0.15
Nodes (5): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "risk_analyzer.py"
Cohesion: 0.11
Nodes (14): LeaveStatus, LeaveType, RiskLevel, _candidate_stats(), _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days() (+6 more)

### Community 101 - "pytest"
Cohesion: 0.10
Nodes (17): test_registration_outbox_rollback_and_no_precommit_delivery(), _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry(), build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error() (+9 more)

### Community 102 - "test_durable_cron.py"
Cohesion: 0.28
Nodes (4): schedule_jobs(), enqueue_due_schedules(), test_cron_auth_and_duplicate_requests(), test_schedule_vietnam_time_and_limited_catchup()

### Community 103 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.33
Nodes (6): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001)

### Community 104 - "PaginatedResponse"
Cohesion: 0.16
Nodes (4): list_audit_logs(), AdminUserResponse, IDResponse, PaginatedResponse

### Community 105 - "test_cpm_scheduling.py"
Cohesion: 0.09
Nodes (32): run_cpm(), backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+24 more)

### Community 106 - "test_dashboard_activity_scope.py"
Cohesion: 0.19
Nodes (7): get_client_ip(), get_current_project_id(), _captured_where_text(), test_audit_log_is_indexed_for_the_activity_feed(), test_project_id_default_reads_the_request_context(), test_recent_activity_filters_by_visible_projects(), test_recent_activity_returns_nothing_without_visible_projects()

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "fixture"
Cohesion: 0.18
Nodes (8): as_user(), factory(), override_db(), _disable_rate_limiting(), event_loop(), make_user(), factory(), session()

### Community 111 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "BurndownChart.tsx"
Cohesion: 0.47
Nodes (5): Danh mục tính năng triển khai theo Phase, BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 115 - "audit/page.tsx"
Cohesion: 0.25
Nodes (10): AdminAuditPage(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs(), auditService (+2 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 119 - "DependencyCreate"
Cohesion: 0.29
Nodes (4): create_dependency(), delete_dependency(), list_dependencies(), DependencyCreate

### Community 121 - "Email and private storage adapters"
Cohesion: 0.50
Nodes (3): Email and private storage adapters, Existing file flow and scope, Local verification

### Community 122 - "AuditService"
Cohesion: 0.27
Nodes (4): AuditService, build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page()

### Community 123 - "test_project_scoping.py"
Cohesion: 0.36
Nodes (6): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "test_route_trailing_slash.py"
Cohesion: 0.53
Nodes (3): _paths_for(), test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 128 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 139 - "sweep_task_dates"
Cohesion: 0.29
Nodes (4): sweep_task_dates(), _sweep_with_own_session(), test_sweep_is_noop_when_nothing_matches(), test_sweep_notifies_starting_and_due_soon_tasks_and_stamps_idempotency()

### Community 145 - "useNotificationSocket"
Cohesion: 0.33
Nodes (6): 5 Trụ cột chính:, Danh mục tính năng triển khai theo Phase, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun AI tài liệu và hoàn thiện (Phase 5), Tổng quan Module, useNotificationSocket()

### Community 146 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 157 - "security.py"
Cohesion: 0.10
Nodes (21): _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works(), test_logout_revokes_both_tokens() (+13 more)

### Community 158 - "schedule-optimization.types.ts"
Cohesion: 0.28
Nodes (7): scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 161 - "AIService"
Cohesion: 0.04
Nodes (59): AIOutput, AIRequest, AIRequestStatus, AIRequestType, ImpactReport, RiskLevel, RiskReport, ImpactReportResponse (+51 more)

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
Cohesion: 0.40
Nodes (4): Kiểm thử, Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

## Knowledge Gaps
- **351 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+346 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatStatus` to `User`, `ChatPanel.tsx`, `NotificationService`, `test_portfolio_project_core.py`, `NotificationType`, `ForbiddenException`, `LoadingState`, `TaskService`, `Button`, `ChatService`, `BadRequestException`, `projects/page.tsx`, `useNotificationSocket`, `DashboardService`, `tasks/page.tsx`, `useNotifications.ts`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `test_portfolio_project_core.py`, `durable_handlers.py`, `ForbiddenException`, `TaskService`, `auth_service.py`, `test_ws_hardening.py`, `users.py`, `get_current_active_superuser`, `security.py`, `wbs.py`, `AIService`, `user_service.py`, `enqueue`, `ProjectRepository`, `AdminUserService`, `env.py`, `DashboardService`, `FastAPI`, `Task`, `RoleService`, `endpoints/ai.py`, `typing`, `ChatService`, `BadRequestException`, `test_security_state.py`, `test_change_request_service.py`, `oauth_service.py`, `risk_analyzer.py`, `pytest`, `PaginatedResponse`, `fixture`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Alert` to `RoleService`, `user_service.py`, `react`, `auth_service.py`, `Settings`, `AuditService`, `oauth_service.py`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _351 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Alert` be split into smaller, more focused modules?**
  _Cohesion score 0.05916305916305916 - nodes in this community are weakly interconnected._