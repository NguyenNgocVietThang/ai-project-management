# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-08)

## Corpus Check
- 434 files · ~234,501 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 3482 nodes · 10663 edges · 188 communities (128 shown, 60 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 882 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48f2a441`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- schedule_optimizer.py
- Button
- db/base.py
- endpoints/auth.py
- formatStatus
- admin.py
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- getApiErrorMessage
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- cn
- generate_project_task
- test_access_token_revocation.py
- NotificationService
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
- scheduling_service.py
- compilerOptions
- AuthService
- ChangeRequestDetail.tsx
- wbs_service.py
- wrap_user_input
- User
- react
- test_authz_matrix.py
- package.json
- task_service.py
- AuditLog
- ForbiddenException
- test_auth_password_recovery.py
- audit/page.tsx
- ProjectRepository
- oauth.py
- risk_analyzer.py
- date_utils.py
- FastAPI
- validate_password_policy
- test_oauth_account_takeover.py
- list_projects
- auth_service.py
- api.ts
- dashboard_service.py
- test_auth_email_verification.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- TaskServiceDep
- Task
- test_audit_regressions.py
- get_redis
- ProjectService
- Thiết kế kiến trúc hệ thống
- sprints.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- pytest
- ChatPanel.tsx
- worklogs.py
- dashboard.types.ts
- TaskStatus
- AdminUserService
- test_portfolio_project_core.py
- UserRepository
- post
- typing
- test_resource_warnings.py
- AIService
- AGENTS.md
- chat_service.py
- ResourceService
- Settings
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
- rate_limit.py
- system.py
- BadRequestException
- BaseRepository
- conftest.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- skills.py
- _mask_email
- next.config.js
- Chi tiết các Giai đoạn đã hoàn thành
- PortfolioBase
- test_token_revocation.py
- GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)
- scripts
- AITaskType
- Triển khai Production trên Render + Supabase (Bản Free)
- middleware.ts
- my_assignments
- Rà soát code và nâng cấp giao diện — 2026-09-15
- ThemeProvider.tsx
- Role
- playwright
- providers.tsx
- token_revocation.py
- Kế hoạch: Render Free + Supabase Free
- ApprovalStatus
- list_permissions
- .__init__
- EmailStatus
- schemas/gantt.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- .eslintrc.json
- get_task_service
- get_wbs_service
- 1. Tổng quan dự án
- test_dashboard_metrics.py
- 11. Cài đặt và Chạy hệ thống
- ProjectCreate
- test_ai_service.py
- get_dashboard_summary
- test_project_scoping.py
- .get_project_stats
- DashboardService
- useResourceRecommendation.ts
- list_audit_logs
- useScheduleOptimization.ts
- 10. Đặc tả API và các điểm cuối WebSocket
- Project
- resource_leveling
- utils/cpm.py
- 3. Ngăn xếp công nghệ
- _put
- get_dashboard_service
- DocumentType
- tailwind.config.ts
- vitest.config.mts
- 12. Cấu hình & Biến môi trường
- todo.md

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
- `6. Chạy Migration` --references--> `seed()`  [INFERRED]
  docs/deploy-render-supabase.md → backend/app/db/seed.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001)` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `Hiện trạng & Hạ tầng sẵn có` --references--> `AuditService`  [INFERRED]
  docs/roadmap/PHASE_4_WORKFLOW_REPORTING_MODULE.md → backend/app/services/audit_service.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py

## Import Cycles
- None detected.

## Communities (188 total, 60 thin omitted)

### Community 0 - "schedule_optimizer.py"
Cohesion: 0.09
Nodes (25): Assignment, Leave, LeaveStatus, LeaveType, _candidate_stats(), _count_overloaded_user_days(), _build_prompt(), _format_leaves_for_prompt() (+17 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (82): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+74 more)

### Community 2 - "db/base.py"
Cohesion: 0.13
Nodes (13): AIOutput, Approval, Base, ChatReadState, Comment, Document, EmailLog, Epic (+5 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (21): create_websocket_ticket(), exchange_oauth_code(), get_me(), login(), logout(), refresh_token(), register(), resend_verification() (+13 more)

### Community 4 - "formatStatus"
Cohesion: 0.10
Nodes (32): Danh mục tính năng đã triển khai, DashboardPage(), ActiveProjectsGrid(), ProjectCard(), STATUS_BADGE, MyTasksList(), MyTasksListProps, PRIORITY_COLOR (+24 more)

### Community 5 - "admin.py"
Cohesion: 0.13
Nodes (10): create_role(), delete_role(), get_role(), list_roles(), update_role(), AuditActorSummary, AuditLogResponse, PermissionResponse (+2 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.15
Nodes (11): Portfolio, PortfolioStatus, PortfolioRepository, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+3 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.10
Nodes (37): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+29 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.09
Nodes (11): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task(), send_password_reset_email_task(), send_project_invitation_email_task(), generate_docx_task() (+3 more)

### Community 9 - "getApiErrorMessage"
Cohesion: 0.08
Nodes (70): DashboardLoading(), Metric(), PortfolioDetailPage(), PortfoliosPage(), AIInsightsPage(), ProjectLayout(), ProjectOverviewCharts, ProjectOverviewPage() (+62 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 12 - "cn"
Cohesion: 0.06
Nodes (43): MiniProgressBar(), MiniProgressBarProps, AvatarProps, ModalProps, Form(), Spinner(), AIGeneratorModal(), STATUS_LABEL (+35 more)

### Community 13 - "generate_project_task"
Cohesion: 0.13
Nodes (14): generate_project_task(), impact_analysis_task(), optimize_schedule_task(), parse_document_task(), resource_recommendation_task(), risk_analysis_task(), sweep_active_projects_for_risk(), 5 Trụ cột AI chính: (+6 more)

### Community 14 - "test_access_token_revocation.py"
Cohesion: 0.13
Nodes (10): get_current_user(), get_current_user_media(), _user_from_token(), create_access_token(), decode_token(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works(), test_logout_revokes_both_tokens() (+2 more)

### Community 15 - "NotificationService"
Cohesion: 0.09
Nodes (11): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), MarkReadResponse, NotificationListResponse, NotificationResponse (+3 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.08
Nodes (46): ProjectMembersPage(), ProjectsPage(), Avatar(), PortfolioFormProps, portfolioKeys, usePortfolios(), InviteMemberDialog(), ProjectMembersTable() (+38 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (22): chat_ws(), _is_still_a_member(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError (+14 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (17): change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user() (+9 more)

### Community 20 - "list_portfolios"
Cohesion: 0.19
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 21 - "ai_tasks.py"
Cohesion: 0.13
Nodes (12): ImpactReportResponse, RiskReportResponse, _impact_analysis_with_own_session(), runner(), to_output_json(), _optimize_schedule_with_own_session(), runner(), _resource_recommendation_with_own_session() (+4 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.10
Nodes (27): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+19 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (13): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip() (+5 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.20
Nodes (13): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), run_resource_recommendation(), _candidate(), _task(), test_fit_score_outside_range_is_clamped() (+5 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.06
Nodes (35): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel() (+27 more)

### Community 26 - "scheduling_service.py"
Cohesion: 0.19
Nodes (5): get_critical_path(), Dependency, CPMResponse, CPMTask, SchedulingService

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.13
Nodes (3): TooManyRequestsException, AuthService, get_auth_service()

### Community 29 - "ChangeRequestDetail.tsx"
Cohesion: 0.14
Nodes (25): ChangeRequestsPage(), EmptyState(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, RiskBadge(), ChangeRequestList(), STATUS_CLASSES (+17 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.07
Nodes (35): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), complete_milestone(), create_milestone(), delete_milestone() (+27 more)

### Community 31 - "wrap_user_input"
Cohesion: 0.16
Nodes (10): AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), test_parses_the_wrappers_models_actually_emit(), test_rejects_an_oversized_prompt(), test_rejects_an_oversized_response(), test_rejects_anything_that_is_not_one_json_object() (+2 more)

### Community 32 - "User"
Cohesion: 0.09
Nodes (13): EpicStatus, MilestoneStatus, PhaseStatus, User, ChangeRequestResponse, add_audit(), get_project_context(), json_value() (+5 more)

### Community 33 - "react"
Cohesion: 0.09
Nodes (34): AuthLayout(), ResetPasswordContent(), ResetPasswordPage(), VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), AdminLayout() (+26 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "task_service.py"
Cohesion: 0.08
Nodes (30): create_dependency(), delete_dependency(), list_dependencies(), delete_subtask(), update_subtask(), DependencyType, AssignmentCreate, AssignmentMutationResponse (+22 more)

### Community 37 - "AuditLog"
Cohesion: 0.14
Nodes (10): ServiceUnavailableException, AuditLog, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, UserBase, UserCreate, UserResponse (+2 more)

### Community 38 - "ForbiddenException"
Cohesion: 0.08
Nodes (14): get_current_active_superuser(), get_current_verified_user(), ForbiddenException, SubtaskStatus, TaskPriority, get_task_context(), recalculate_project(), _require_task_reader() (+6 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.21
Nodes (13): forgot_password(), build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message(), test_new_request_invalidates_previous_token(), test_queue_failure_is_hidden_and_does_not_log_sensitive_values() (+5 more)

### Community 40 - "audit/page.tsx"
Cohesion: 0.23
Nodes (11): AdminAuditPage(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs() (+3 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.13
Nodes (4): ProjectMethodology, ProjectStatus, ProjectRepository, get_project_service()

### Community 42 - "oauth.py"
Cohesion: 0.10
Nodes (14): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), issue(), _key() (+6 more)

### Community 43 - "risk_analyzer.py"
Cohesion: 0.14
Nodes (18): RiskLevel, RiskReport, _as_list(), _clamp_score(), _compute_signals(), generate_risk_analysis(), _level_from_score(), _normalize_level() (+10 more)

### Community 44 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 45 - "FastAPI"
Cohesion: 0.09
Nodes (11): set_request_id(), close_redis(), get_redis_pubsub(), get_client_ip(), resolve_client_ip(), set_client_ip(), redis_listener(), attach_request_id() (+3 more)

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (6): _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 48 - "list_projects"
Cohesion: 0.16
Nodes (10): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+2 more)

### Community 49 - "auth_service.py"
Cohesion: 0.12
Nodes (5): hash_password(), _utcnow(), verify_password(), get_storage_service(), StorageService

### Community 50 - "api.ts"
Cohesion: 0.10
Nodes (28): EmailVerificationBannerProps, SocialLoginButtonsProps, AvatarSectionProps, LinkedAccountsSectionProps, API_BASE_URL, bootstrapSession(), refreshAccessToken(), refreshClient (+20 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.19
Nodes (13): BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats, ProjectStats (+5 more)

### Community 52 - "test_auth_email_verification.py"
Cohesion: 0.20
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.22
Nodes (17): avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage(), test_change_password_validates_current_password_and_revokes_sessions() (+9 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "TaskServiceDep"
Cohesion: 0.14
Nodes (9): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+1 more)

### Community 57 - "Task"
Cohesion: 0.10
Nodes (12): ChatMessage, Subtask, Task, TaskRepository, _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_foreign_keys_used_for_project_scoping_are_indexed() (+4 more)

### Community 58 - "test_audit_regressions.py"
Cohesion: 0.16
Nodes (15): set_current_project_id(), Phase, Worklog, recalculate_project_cost(), project_work(), test_ai_broker_failure_does_not_leave_pending_job(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere(), test_owner_can_stop_timer_after_project_access_removed() (+7 more)

### Community 59 - "get_redis"
Cohesion: 0.15
Nodes (7): get_redis(), publish_many(), health_check(), _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 60 - "ProjectService"
Cohesion: 0.16
Nodes (14): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+6 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "sprints.py"
Cohesion: 0.24
Nodes (8): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint(), SprintStatus

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.11
Nodes (18): 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án, 6. Lược đồ cơ sở dữ liệu (8 Domains & 34 Tables), 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống (+10 more)

### Community 64 - "pytest"
Cohesion: 0.08
Nodes (16): get_current_project_id(), sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page(), _captured_where_text() (+8 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.18
Nodes (18): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys (+10 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (8): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog()

### Community 68 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (29): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có (+21 more)

### Community 69 - "TaskStatus"
Cohesion: 0.10
Nodes (26): NotificationType, TaskStatus, TaskUpdate, notify_project_team(), ProjectContext, _apply_status_side_effects(), test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket() (+18 more)

### Community 70 - "AdminUserService"
Cohesion: 0.16
Nodes (21): AdminUserCreate, AdminUserResponse, AdminUserUpdate, AdminUserService, is_admin(), build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles() (+13 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 73 - "post"
Cohesion: 0.16
Nodes (13): generate_project(), get_ai_job(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest, AIImpactAnalysisRequest (+5 more)

### Community 74 - "typing"
Cohesion: 0.09
Nodes (11): NotFoundException, get_db(), IDResponse, PaginatedResponse, get_admin_user_service(), get_ai_service(), AuditService, get_audit_service() (+3 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "AIService"
Cohesion: 0.26
Nodes (4): AIRequest, AIRequestType, AIJobResponse, AIService

### Community 78 - "chat_service.py"
Cohesion: 0.08
Nodes (23): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), publish(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse (+15 more)

### Community 80 - "Settings"
Cohesion: 0.12
Nodes (10): Settings, test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings(), 6 Trụ cột chính:, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Auth & User Onboarding Module (Phase 1) (+2 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.18
Nodes (10): 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness, Hiện trạng & Hạ tầng sẵn có (+2 more)

### Community 82 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (4): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry()

### Community 83 - "approvals.py"
Cohesion: 0.17
Nodes (5): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), update_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.14
Nodes (18): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), ChangeRequest, CRStatus, ChangeRequestCreate, ChangeRequestService (+10 more)

### Community 85 - "env.py"
Cohesion: 0.10
Nodes (9): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, main() (+1 more)

### Community 86 - "documents.py"
Cohesion: 0.17
Nodes (5): create_documents(), delete_documents(), get_documents(), list_documents(), update_documents()

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.18
Nodes (4): create_gantt(), delete_gantt(), get_gantt(), list_gantt()

### Community 88 - "leaves.py"
Cohesion: 0.18
Nodes (4): create_leaves(), delete_leaves(), get_leaves(), list_leaves()

### Community 89 - "project_versions.py"
Cohesion: 0.17
Nodes (5): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), update_project_versions()

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (5): create_reports(), delete_reports(), get_reports(), list_reports(), update_reports()

### Community 91 - "rate_limit.py"
Cohesion: 0.15
Nodes (3): client_key(), rate_limit_exceeded_handler(), _retry_after_seconds()

### Community 92 - "system.py"
Cohesion: 0.17
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "BadRequestException"
Cohesion: 0.14
Nodes (9): BadRequestException, ConflictException, UnauthorizedException, code_challenge_for(), new_code_verifier(), TokenResponse, get_oauth_service(), OAuthService (+1 more)

### Community 95 - "conftest.py"
Cohesion: 0.12
Nodes (12): Permission, as_user(), factory(), client(), override_db(), _disable_rate_limiting(), engine(), event_loop() (+4 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.22
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "skills.py"
Cohesion: 0.17
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 98 - "_mask_email"
Cohesion: 0.33
Nodes (3): _mask_email(), test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing()

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.33
Nodes (6): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001)

### Community 102 - "test_token_revocation.py"
Cohesion: 0.34
Nodes (9): create_refresh_token(), build_db(), build_service(), build_user(), test_logout_ignores_a_token_of_the_wrong_type(), test_logout_revokes_the_refresh_token(), test_logout_without_a_token_is_a_no_op(), test_refresh_rotates_the_presented_token_out() (+1 more)

### Community 103 - "GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)"
Cohesion: 0.16
Nodes (14): Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004), GIAI ĐOẠN 3.6 – AI Phân tích rủi ro (SOP-AI-005), aiJobKeys, IN_PROGRESS (+6 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "AITaskType"
Cohesion: 0.09
Nodes (10): BaseAIProvider, AITaskType, model_routing_table(), resolve_model(), generate_project_from_prompt(), get_ai_provider(), XkiroProvider, _generate_with_own_session() (+2 more)

### Community 106 - "Triển khai Production trên Render + Supabase (Bản Free)"
Cohesion: 0.14
Nodes (14): 1. Tạo Supabase Project (PostgreSQL), 2. Tạo Redis trên Render, 3. Deploy Backend trên Render, 4. Deploy Celery Worker trên Render, 5. Deploy Frontend trên Render, 6. Chạy Migration, 7. Kiểm tra sau triển khai, Giới hạn bản Free (+6 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "ThemeProvider.tsx"
Cohesion: 0.29
Nodes (10): apply(), systemPrefersDark(), Status(), Theme(), ThemeContext, ThemeContextValue, themeInitScript, ThemePreference (+2 more)

### Community 111 - "Role"
Cohesion: 0.13
Nodes (14): Role, RoleCreate, RoleUpdate, get_role_service(), RoleService, build_actor(), build_db(), build_role() (+6 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "providers.tsx"
Cohesion: 0.26
Nodes (7): metadata, RootLayout(), viewport, Providers(), ThemedToaster(), notifyError(), sonner

### Community 115 - "token_revocation.py"
Cohesion: 0.31
Nodes (4): is_revoked(), _key(), revoke(), _ttl_seconds()

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 119 - "list_permissions"
Cohesion: 0.22
Nodes (4): list_permissions(), require_roles(), role_checker(), 13. Quy tắc phát triển

### Community 123 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 129 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

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
Cohesion: 0.41
Nodes (9): AIRequestStatus, ai_request(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 151 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (3): get_dashboard_summary(), get_portfolio_health(), get_project_stats()

### Community 152 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (7): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing(), two_projects()

### Community 153 - ".get_project_stats"
Cohesion: 0.20
Nodes (7): Bảo mật, Còn nợ, Giao diện, Hiệu năng, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 154 - "DashboardService"
Cohesion: 0.25
Nodes (3): ActiveProjectSummary, DashboardService, _iso_week_bounds()

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 161 - "Project"
Cohesion: 0.12
Nodes (21): ImpactReport, RiskLevel, Project, _build_prompt(), generate_impact_analysis(), get_ai_provider(), run_impact_analysis(), _summarize_cpm() (+13 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.09
Nodes (29): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+21 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "_put"
Cohesion: 0.40
Nodes (3): update_gantt(), update_leaves(), _put()

### Community 186 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Môi trường phía giao diện (`frontend/.env.local`), Môi trường phía máy chủ (`backend/.env`)

## Knowledge Gaps
- **332 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+327 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1077 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatStatus` to `User`, `react`, `ChatPanel.tsx`, `Button`, `TaskStatus`, `portfolio_service.py`, `ForbiddenException`, `getApiErrorMessage`, `Chi tiết các Giai đoạn đã hoàn thành`, `chat_service.py`, `NotificationService`, `ResourceService`, `projects/page.tsx`, `useNotifications.ts`, `DashboardService`, `ProjectService`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `schedule_optimizer.py`, `db/base.py`, `portfolio_service.py`, `test_access_token_revocation.py`, `test_ws_hardening.py`, `users.py`, `list_portfolios`, `ai_tasks.py`, `.get_project_stats`, `DashboardService`, `scheduling_service.py`, `AuthService`, `list_audit_logs`, `wbs_service.py`, `task_service.py`, `utils/cpm.py`, `ForbiddenException`, `AuditLog`, `ProjectRepository`, `test_oauth_account_takeover.py`, `list_projects`, `auth_service.py`, `dashboard_service.py`, `test_auth_email_verification.py`, `test_audit_regressions.py`, `ProjectService`, `AdminUserService`, `UserRepository`, `post`, `typing`, `AIService`, `chat_service.py`, `ResourceService`, `test_change_request_service.py`, `env.py`, `BadRequestException`, `conftest.py`, `AITaskType`, `Role`, `list_permissions`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `react`, `AuditLog`, `users/page.tsx`, `typing`, `Role`, `Settings`, `AuthService`, `BadRequestException`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _332 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `schedule_optimizer.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09191919191919191 - nodes in this community are weakly interconnected._