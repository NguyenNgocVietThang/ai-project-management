# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-08)

## Corpus Check
- 432 files · ~233,161 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 31 file(s) not represented in the graph (top: (none) 13, .puml 10, .example 3)

## Summary
- 3464 nodes · 10647 edges · 184 communities (134 shown, 50 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 882 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b6bec6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Button
- db/base.py
- post
- formatStatus
- admin.py
- portfolio_service.py
- users/page.tsx
- pytest
- tasks/page.tsx
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- getApiErrorMessage
- ai_tasks.py
- Modal
- NotificationService
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- list_portfolios
- types
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ws_manager.py
- scheduling_service.py
- compilerOptions
- AuthService
- ChangeRequestDetail.tsx
- wbs_service.py
- wrap_user_input
- phase2_common.py
- (dashboard)/layout.tsx
- test_authz_matrix.py
- package.json
- resource_service.py
- UserService
- ForbiddenException
- test_auth_password_recovery.py
- lucide-react
- ProjectRepository
- oauth.py
- run_risk_analysis
- date_utils.py
- main.py
- test_google_profile_carries_the_verified_flag_through
- list_projects
- storage_service.py
- auth.types.ts
- dashboard_service.py
- test_foreign_keys_used_for_project_scoping_are_indexed
- test_user_profile_settings.py
- dependencies
- devDependencies
- tasks.py
- Task
- Project
- test_admin_roles.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- milestones.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- AuditLog
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
- User
- AGENTS.md
- chat_service.py
- AuditService
- Settings
- useNotificationSocket
- test_rate_limit.py
- approvals.py
- test_change_request_service.py
- asyncio
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- rate_limit.py
- system.py
- BadRequestException
- BaseRepository
- conftest.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- skills.py
- test_route_exposure.py
- next.config.js
- Chi tiết các Giai đoạn đã hoàn thành
- PortfolioUpdate
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)
- scripts
- XkiroProvider
- Triển khai bản thử nghiệm trên Oracle Cloud Always Free
- middleware.ts
- my_assignments
- Rà soát code và nâng cấp giao diện — 2026-09-15
- NotificationType
- NotFoundException
- playwright
- typing
- ThemeProvider.tsx
- get_redis
- test_notification_triggers.py
- ApprovalStatus
- endpoints/dependencies.py
- celery_app.py
- EmailStatus
- api.ts
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- .eslintrc.json
- _MessageBudget
- endpoints/auth.py
- useChatSocket.ts
- 1. Tổng quan dự án
- test_dashboard_metrics.py
- Đặc tả yêu cầu phần mềm (SRS)
- 11. Cài đặt và Chạy hệ thống
- ProjectCreate
- get_chat_history
- test_ai_service.py
- dashboards.py
- test_project_scoping.py
- Rà soát 2026-09-06
- .get_user_summary
- TeamBarChart.tsx
- useResourceRecommendation.ts
- list_audit_logs
- useScheduleOptimization.ts
- 10. Đặc tả API và các điểm cuối WebSocket
- BurndownChart.tsx
- run_impact_analysis
- get_critical_path
- resource_leveling
- utils/cpm.py
- 3. Ngăn xếp công nghệ
- _put
- ._reject_insecure_defaults
- LanguageToggle.tsx
- get_dashboard_service
- get_project_service
- DocumentType

## God Nodes (most connected - your core abstractions)
1. `User` - 219 edges
2. `Button` - 95 edges
3. `ForbiddenException` - 84 edges
4. `WBSService` - 73 edges
5. `TaskService` - 71 edges
6. `NotFoundException` - 68 edges
7. `Base` - 68 edges
8. `Task` - 64 edges
9. `Alert()` - 63 edges
10. `BadRequestException` - 60 edges

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

## Communities (184 total, 50 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.15
Nodes (17): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), _validate_and_filter_result(), _db_with(), _fake_provider() (+9 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (71): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+63 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (17): get_client_ip(), AIOutput, Approval, Base, ChatMessage, Comment, Document, EmailLog (+9 more)

### Community 3 - "post"
Cohesion: 0.13
Nodes (13): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+5 more)

### Community 4 - "formatStatus"
Cohesion: 0.08
Nodes (47): Danh mục tính năng đã triển khai, DashboardPage(), ProjectLayout(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), MiniProgressBar(), useChatUnreadCount() (+39 more)

### Community 5 - "admin.py"
Cohesion: 0.12
Nodes (11): create_role(), delete_role(), get_role(), list_roles(), AdminUserResponse, AuditActorSummary, AuditLogResponse, PermissionResponse (+3 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.15
Nodes (10): Portfolio, PortfolioStatus, PortfolioRepository, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+2 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (54): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+46 more)

### Community 8 - "pytest"
Cohesion: 0.15
Nodes (9): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task(), send_password_reset_email_task(), send_project_invitation_email_task(), test_verification_email_uses_html_template_and_link() (+1 more)

### Community 9 - "tasks/page.tsx"
Cohesion: 0.10
Nodes (36): DashboardLoading(), Field(), KanbanColumn(), Select(), SprintView(), STATUSES, TaskCard(), TaskCreateModal() (+28 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 12 - "getApiErrorMessage"
Cohesion: 0.10
Nodes (35): AIInsightsPage(), MiniProgressBarProps, ButtonProps, VARIANT_CLASSES, Spinner(), STATUS_LABEL, ResourceRecommendationPanel(), ResourceRecommendationPanelProps (+27 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.08
Nodes (27): ImpactReportResponse, RiskReportResponse, AITaskType, resolve_model(), generate_project_task(), _generate_with_own_session(), impact_analysis_task(), _impact_analysis_with_own_session() (+19 more)

### Community 14 - "Modal"
Cohesion: 0.13
Nodes (31): Metric(), PortfolioDetailPage(), PortfoliosPage(), Modal(), ModalProps, Form(), ErrorState(), usePortfolioHealth() (+23 more)

### Community 15 - "NotificationService"
Cohesion: 0.17
Nodes (7): publish_many(), MarkReadResponse, NotificationListResponse, NotificationResponse, UnreadCountResponse, get_notification_service(), NotificationService

### Community 16 - "projects/page.tsx"
Cohesion: 0.11
Nodes (39): ProjectMembersPage(), ProjectSettingsPage(), ProjectsPage(), AIGeneratorModal(), usePortfolios(), InviteMemberDialog(), ProjectFields(), ProjectForm() (+31 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (23): chat_ws(), authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws(), redis_listener() (+15 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (16): change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user() (+8 more)

### Community 20 - "list_portfolios"
Cohesion: 0.19
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 21 - "types"
Cohesion: 0.32
Nodes (3): test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket(), fake_flush()

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (13): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip() (+5 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.21
Nodes (13): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), run_resource_recommendation(), runner(), _candidate(), _task(), test_fit_score_outside_range_is_clamped() (+5 more)

### Community 25 - "ws_manager.py"
Cohesion: 0.16
Nodes (8): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel()

### Community 26 - "scheduling_service.py"
Cohesion: 0.10
Nodes (10): CPMResponse, CPMTask, GanttResponse, GanttTask, get_scheduling_service(), recalculate_project(), SchedulingService, offsets_to_dates() (+2 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.06
Nodes (31): create_access_token(), create_refresh_token(), decode_token(), _utcnow(), AuthService, test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works(), test_logout_revokes_both_tokens() (+23 more)

### Community 29 - "ChangeRequestDetail.tsx"
Cohesion: 0.12
Nodes (28): ChangeRequestsPage(), ProjectChatPage(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, RiskBadge(), ChangeRequestForm(), ChangeRequestList() (+20 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.05
Nodes (49): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), create_phase(), delete_phase(), get_phase() (+41 more)

### Community 31 - "wrap_user_input"
Cohesion: 0.09
Nodes (13): model_routing_table(), AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), generate_project_from_prompt(), get_ai_provider(), test_parses_the_wrappers_models_actually_emit() (+5 more)

### Community 32 - "phase2_common.py"
Cohesion: 0.15
Nodes (5): add_audit(), json_value(), require_project_roles(), serialize_model(), rows()

### Community 33 - "(dashboard)/layout.tsx"
Cohesion: 0.20
Nodes (16): AuthLayout(), AdminLayout(), TABS, AdminIndexPage(), DashboardLayout(), FullPageSpinner(), Brand(), LanguageToggle() (+8 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (34): description, name, overrides, postcss, private, version, mocks, config (+26 more)

### Community 36 - "resource_service.py"
Cohesion: 0.07
Nodes (21): delete_subtask(), update_subtask(), set_current_project_id(), AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, ResourceWarning, SubtaskCreate (+13 more)

### Community 37 - "UserService"
Cohesion: 0.11
Nodes (11): validate_password_policy(), ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, UserBase, UserCreate, UserResponse, UserUpdate (+3 more)

### Community 38 - "ForbiddenException"
Cohesion: 0.10
Nodes (14): get_current_active_superuser(), get_current_verified_user(), role_checker(), ForbiddenException, TaskPriority, DependencyCreate, DependencyResponse, get_task_context() (+6 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (15): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message(), test_new_request_invalidates_previous_token() (+7 more)

### Community 40 - "lucide-react"
Cohesion: 0.16
Nodes (17): Metric(), TimesheetPage(), Avatar(), AvatarProps, EmptyState(), UserTable(), ACTION_CLASSES, actionBadgeClass() (+9 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.11
Nodes (3): ProjectMethodology, ProjectStatus, ProjectRepository

### Community 42 - "oauth.py"
Cohesion: 0.21
Nodes (9): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), issue(), state_cookie_kwargs() (+1 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.15
Nodes (17): RiskLevel, _as_list(), _clamp_score(), generate_risk_analysis(), _level_from_score(), _normalize_level(), run_risk_analysis(), runner() (+9 more)

### Community 44 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 45 - "main.py"
Cohesion: 0.08
Nodes (13): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, set_request_id(), close_redis(), resolve_client_ip(), set_client_ip() (+5 more)

### Community 48 - "list_projects"
Cohesion: 0.16
Nodes (10): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+2 more)

### Community 50 - "auth.types.ts"
Cohesion: 0.14
Nodes (23): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), EmailVerificationBannerProps, AvatarSectionProps, LinkedAccountsSectionProps, authService (+15 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.20
Nodes (15): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+7 more)

### Community 52 - "test_foreign_keys_used_for_project_scoping_are_indexed"
Cohesion: 0.20
Nodes (6): _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_foreign_keys_used_for_project_scoping_are_indexed(), test_the_daily_sweep_query_is_indexed(), test_the_gin_index_on_labels_is_declared_on_the_model()

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (17): OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage(), test_change_password_validates_current_password_and_revokes_sessions() (+9 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "tasks.py"
Cohesion: 0.17
Nodes (9): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+1 more)

### Community 57 - "Task"
Cohesion: 0.07
Nodes (20): Assignment, Dependency, DependencyType, Leave, LeaveStatus, LeaveType, Task, TaskRepository (+12 more)

### Community 58 - "Project"
Cohesion: 0.14
Nodes (15): AIRequest, Project, Worklog, recalculate_project_cost(), project_work(), test_ai_broker_failure_does_not_leave_pending_job(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere(), test_owner_can_stop_timer_after_project_access_removed() (+7 more)

### Community 59 - "test_admin_roles.py"
Cohesion: 0.58
Nodes (9): build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role(), test_delete_role_blocks_when_users_still_assigned(), test_delete_role_succeeds_when_unused(), test_update_role_allows_renaming_custom_role() (+1 more)

### Community 60 - "ProjectService"
Cohesion: 0.19
Nodes (13): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+5 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "milestones.py"
Cohesion: 0.24
Nodes (7): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), update_milestone(), Milestone

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (21): 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án, 6. Lược đồ cơ sở dữ liệu (8 Domains & 34 Tables), 7. Hệ thống phân quyền (RBAC) & Quản trị Admin (+13 more)

### Community 64 - "AuditLog"
Cohesion: 0.18
Nodes (9): get_current_project_id(), AuditLog, _captured_where_text(), test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_project_id_default_reads_the_request_context(), test_recent_activity_filters_by_visible_projects(), test_recent_activity_returns_nothing_without_visible_projects() (+1 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.19
Nodes (18): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+10 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (8): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog()

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.20
Nodes (9): 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4) (+1 more)

### Community 69 - "TaskStatus"
Cohesion: 0.19
Nodes (11): TaskStatus, _apply_status_side_effects(), _task(), test_a_task_completed_without_ever_starting_still_gets_a_start_date(), test_epic_story_points_are_rolled_up_from_tasks(), test_finishing_work_records_the_end_date(), test_progress_outside_zero_to_one_hundred_is_rejected(), test_project_cost_is_derived_from_logged_hours_and_rates() (+3 more)

### Community 70 - "AdminUserService"
Cohesion: 0.27
Nodes (19): AdminUserCreate, AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts(), test_create_user_success() (+11 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 72 - "list_notifications"
Cohesion: 0.15
Nodes (5): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read()

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (12): generate_project(), get_ai_job(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest, AIImpactAnalysisRequest (+4 more)

### Community 74 - "FastAPI"
Cohesion: 0.08
Nodes (14): list_permissions(), get_current_user(), get_current_user_media(), require_roles(), _user_from_token(), ServiceUnavailableException, TooManyRequestsException, UnauthorizedException (+6 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "User"
Cohesion: 0.07
Nodes (8): AIRequestType, User, UserRepository, AIJobResponse, AIService, get_ai_service(), get_project_context(), is_admin()

### Community 78 - "chat_service.py"
Cohesion: 0.11
Nodes (19): publish(), ChatReadState, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, ChatService, get_chat_service() (+11 more)

### Community 79 - "AuditService"
Cohesion: 0.29
Nodes (5): AuditService, get_audit_service(), build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page()

### Community 80 - "Settings"
Cohesion: 0.25
Nodes (5): Settings, test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings()

### Community 81 - "useNotificationSocket"
Cohesion: 0.18
Nodes (12): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+4 more)

### Community 82 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (4): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry()

### Community 83 - "approvals.py"
Cohesion: 0.18
Nodes (4): create_approvals(), delete_approvals(), get_approvals(), list_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (20): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), ChangeRequest, CRStatus, ChangeRequestCreate, ChangeRequestResponse (+12 more)

### Community 85 - "asyncio"
Cohesion: 0.11
Nodes (9): do_run_migrations(), run_async_migrations(), run_migrations_online(), main(), seed(), _pending_key(), recalculate_project_task(), _recalculate_with_own_session() (+1 more)

### Community 86 - "documents.py"
Cohesion: 0.18
Nodes (4): create_documents(), delete_documents(), get_documents(), list_documents()

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.17
Nodes (5): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), update_gantt()

### Community 88 - "leaves.py"
Cohesion: 0.17
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 89 - "project_versions.py"
Cohesion: 0.17
Nodes (5): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), update_project_versions()

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (5): create_reports(), delete_reports(), get_reports(), list_reports(), update_reports()

### Community 91 - "rate_limit.py"
Cohesion: 0.16
Nodes (3): client_key(), rate_limit_exceeded_handler(), _retry_after_seconds()

### Community 92 - "system.py"
Cohesion: 0.17
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "BadRequestException"
Cohesion: 0.10
Nodes (10): BadRequestException, code_challenge_for(), new_code_verifier(), TokenResponse, OAuthService, _service_with_existing(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

### Community 95 - "conftest.py"
Cohesion: 0.12
Nodes (11): as_user(), factory(), client(), override_db(), _disable_rate_limiting(), engine(), event_loop(), make_user() (+3 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.22
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "skills.py"
Cohesion: 0.18
Nodes (4): create_skills(), delete_skills(), get_skills(), list_skills()

### Community 98 - "test_route_exposure.py"
Cohesion: 0.17
Nodes (7): UserSearchResult, _mask_email(), test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing(), test_project_role_options_do_not_carry_the_permission_matrix(), test_search_results_are_masked_end_to_end(), test_user_search_result_never_carries_a_usable_address()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001), Hiện trạng & Hạ tầng sẵn có (+2 more)

### Community 102 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 103 - "GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)"
Cohesion: 0.26
Nodes (9): GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject(), aiService, AIJobResponse, AIJobStatus (+1 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "XkiroProvider"
Cohesion: 0.12
Nodes (9): BaseAIProvider, get_ai_provider(), XkiroProvider, Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+1 more)

### Community 106 - "Triển khai bản thử nghiệm trên Oracle Cloud Always Free"
Cohesion: 0.29
Nodes (7): 1. Tạo máy và mạng, 2. Cài Docker và lấy mã nguồn, 3. Cấu hình bí mật và URL, 5. Kiểm tra sau triển khai, Nguồn đối chiếu, Triển khai bản thử nghiệm trên Oracle Cloud Always Free, Điều kiện trước khi bắt đầu

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "NotificationType"
Cohesion: 0.18
Nodes (6): NotificationType, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), test_sweep_is_noop_when_nothing_matches(), test_sweep_notifies_starting_and_due_soon_tasks_and_stamps_idempotency()

### Community 111 - "NotFoundException"
Cohesion: 0.13
Nodes (9): update_role(), _is_still_a_member(), ConflictException, NotFoundException, Permission, Role, RoleUpdate, get_role_service() (+1 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "ThemeProvider.tsx"
Cohesion: 0.16
Nodes (17): metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+9 more)

### Community 115 - "get_redis"
Cohesion: 0.09
Nodes (11): _key(), redeem(), consume(), issue(), _key(), get_redis(), get_redis_pubsub(), is_revoked() (+3 more)

### Community 116 - "test_notification_triggers.py"
Cohesion: 0.26
Nodes (12): TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged(), test_notify_project_team_excludes_given_users(), test_notify_project_team_with_no_exclusions_notifies_everyone() (+4 more)

### Community 119 - "endpoints/dependencies.py"
Cohesion: 0.31
Nodes (3): create_dependency(), delete_dependency(), list_dependencies()

### Community 122 - "api.ts"
Cohesion: 0.16
Nodes (12): IN_PROGRESS, riskAnalysisJobKeys, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, RiskAnalysisJobResponse, RiskAnalysisJobStatus (+4 more)

### Community 123 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 126 - "endpoints/auth.py"
Cohesion: 0.28
Nodes (9): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, RefreshRequest, RegisterRequest, TokenPayload (+1 more)

### Community 128 - "useChatSocket.ts"
Cohesion: 0.20
Nodes (8): connectWebSocket(), connect(), scheduleReconnect(), FakeSocket, flush(), WSClient, WSClientOptions, WS_BASE_URL

### Community 129 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

### Community 145 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 146 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "ProjectCreate"
Cohesion: 0.20
Nodes (3): ProjectCreate, ProjectUpdate, test_portfolio_and_project_schema_validation()

### Community 149 - "get_chat_history"
Cohesion: 0.19
Nodes (4): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message()

### Community 150 - "test_ai_service.py"
Cohesion: 0.41
Nodes (9): AIRequestStatus, ai_request(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 151 - "dashboards.py"
Cohesion: 0.29
Nodes (3): get_dashboard_summary(), get_portfolio_health(), get_project_stats()

### Community 152 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (7): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing(), two_projects()

### Community 153 - "Rà soát 2026-09-06"
Cohesion: 0.20
Nodes (7): Bảo mật, Còn nợ, Giao diện, Hiệu năng, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 155 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 160 - "BurndownChart.tsx"
Cohesion: 0.47
Nodes (5): Danh mục tính năng triển khai theo Phase, BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 161 - "run_impact_analysis"
Cohesion: 0.24
Nodes (14): RiskLevel, run_impact_analysis(), _validate_ai_output(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+6 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.10
Nodes (27): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+19 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "_put"
Cohesion: 0.50
Nodes (4): update_approvals(), update_documents(), update_skills(), _put()

### Community 169 - "LanguageToggle.tsx"
Cohesion: 0.40
Nodes (6): setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

## Knowledge Gaps
- **319 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+314 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1062 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatStatus` to `ChatPanel.tsx`, `resource_service.py`, `portfolio_service.py`, `ForbiddenException`, `lucide-react`, `tasks/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `chat_service.py`, `NotificationService`, `Modal`, `useNotificationSocket`, `projects/page.tsx`, `dashboard_service.py`, `test_notification_triggers.py`, `useNotifications.ts`, `ProjectService`, `wbs_service.py`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `ai_tasks.py`, `test_ws_hardening.py`, `users.py`, `list_portfolios`, `.get_user_summary`, `scheduling_service.py`, `AuthService`, `list_audit_logs`, `wbs_service.py`, `phase2_common.py`, `resource_service.py`, `UserService`, `ForbiddenException`, `ProjectRepository`, `list_projects`, `dashboard_service.py`, `Task`, `Project`, `ProjectService`, `AdminUserService`, `endpoints/ai.py`, `FastAPI`, `chat_service.py`, `test_change_request_service.py`, `asyncio`, `BadRequestException`, `conftest.py`, `NotFoundException`, `typing`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `Chi tiết các Giai đoạn đã hoàn thành`, `UserService`, `users/page.tsx`, `NotFoundException`, `AuditService`, `auth.types.ts`, `AuthService`, `BadRequestException`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _319 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06142643764002987 - nodes in this community are weakly interconnected._