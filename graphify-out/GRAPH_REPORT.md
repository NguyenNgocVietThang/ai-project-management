# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-02)

## Corpus Check
- 431 files · ~233,581 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 31 file(s) not represented in the graph (top: (none) 13, .puml 10, .example 3)

## Summary
- 3470 nodes · 10672 edges · 175 communities (114 shown, 61 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 883 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `744501b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- schedule_optimizer.py
- Button
- db/base.py
- endpoints/auth.py
- formatDate
- admin.py
- PortfolioService
- users/page.tsx
- email_tasks.py
- tasks/page.tsx
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- getApiErrorMessage
- ai_tasks.py
- portfolios/[id]/page.tsx
- NotificationService
- projects/page.tsx
- useTasks.ts
- test_ws_hardening.py
- users.py
- list_portfolios
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- test_access_token_revocation.py
- ChangeRequestDetail.tsx
- wbs_service.py
- AuthService
- User
- react
- test_authz_matrix.py
- package.json
- task_service.py
- ResourceService
- ForbiddenException
- test_auth_password_recovery.py
- UserRepository
- ProjectRepository
- oauth_service.py
- risk_analyzer.py
- test_auth_email_verification.py
- main.py
- ProjectCreate
- test_oauth_account_takeover.py
- projects.py
- storage_service.py
- api.ts
- dashboard_service.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- sprints.py
- resource_recommender.py
- Project
- RoleService
- ProjectService
- Thiết kế kiến trúc hệ thống
- milestones.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- OAuthService
- test_dashboard_metrics.py
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- AdminUserService
- test_portfolio_project_core.py
- DashboardService
- post
- typing
- test_resource_warnings.py
- AIService
- AGENTS.md
- ChatService
- AuditService
- test_token_revocation.py
- sweep_task_dates_task
- test_rate_limit.py
- approvals.py
- test_change_request_service.py
- env.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- test_ai_service.py
- system.py
- UserService
- BaseRepository
- date_utils.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- PortfolioRepository
- .get_project_stats
- next.config.js
- fixture
- test_project_scoping.py
- get_dashboard_summary
- GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)
- scripts
- generate_project_task
- Triển khai bản thử nghiệm trên Oracle Cloud Always Free
- middleware.ts
- my_assignments
- Rà soát code và nâng cấp giao diện — 2026-09-15
- create_change_request
- get_current_active_superuser
- playwright
- get_critical_path
- get_redis
- .__init__
- ApprovalStatus
- resource_leveling
- DocumentType
- EmailStatus
- get_current_user
- BaseAIProvider
- .eslintrc.json
- tailwind.config.ts
- ProjectStatus
- Leave
- validate_password_policy
- get_dashboard_service
- 11. Cài đặt và Chạy hệ thống
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- 10. Đặc tả API và các điểm cuối WebSocket
- 12. Cấu hình & Biến môi trường
- run_impact_analysis
- utils/cpm.py
- 3. Ngăn xếp công nghệ

## God Nodes (most connected - your core abstractions)
1. `User` - 221 edges
2. `Button` - 95 edges
3. `ForbiddenException` - 84 edges
4. `WBSService` - 73 edges
5. `TaskService` - 71 edges
6. `NotFoundException` - 68 edges
7. `Base` - 68 edges
8. `Task` - 64 edges
9. `Alert()` - 63 edges
10. `BadRequestException` - 61 edges

## Surprising Connections (you probably didn't know these)
- `4. Build, migrate và khởi động` --references--> `seed()`  [INFERRED]
  docs/deploy-oracle-cloud.md → backend/app/db/seed.py
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

## Communities (175 total, 61 thin omitted)

### Community 0 - "schedule_optimizer.py"
Cohesion: 0.13
Nodes (20): LeaveStatus, LeaveType, _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), run_schedule_optimization() (+12 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (87): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+79 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (16): AIOutput, Approval, Assignment, Base, ChatReadState, Comment, Document, EmailLog (+8 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (20): create_websocket_ticket(), exchange_oauth_code(), get_me(), login(), logout(), refresh_token(), register(), resend_verification() (+12 more)

### Community 4 - "formatDate"
Cohesion: 0.07
Nodes (48): Danh mục tính năng đã triển khai, DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), TaskTable(), TeamBarChartProps, ActiveProjectsGrid() (+40 more)

### Community 5 - "admin.py"
Cohesion: 0.10
Nodes (16): create_role(), delete_role(), get_role(), list_roles(), update_role(), AdminUserResponse, AuditActorSummary, AuditLogResponse (+8 more)

### Community 6 - "PortfolioService"
Cohesion: 0.14
Nodes (8): PortfolioStatus, PortfolioBase, PortfolioCapabilities, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate, PortfolioService

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (47): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), ChangeRequestsPage(), EmptyState(), DeleteRoleDialog(), RoleFormProps, RoleTable() (+39 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.09
Nodes (11): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task(), send_password_reset_email_task(), send_project_invitation_email_task(), generate_docx_task() (+3 more)

### Community 9 - "tasks/page.tsx"
Cohesion: 0.08
Nodes (55): DashboardLoading(), ProjectChatPage(), ProjectLayout(), ProjectSettingsPage(), Field(), KanbanColumn(), Select(), SprintView() (+47 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 12 - "getApiErrorMessage"
Cohesion: 0.07
Nodes (43): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), AIInsightsPage(), ChangeRequestList(), STATUS_CLASSES, StatusBadge() (+35 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.13
Nodes (12): ImpactReportResponse, RiskReportResponse, _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task(), _optimize_schedule_with_own_session(), runner() (+4 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.17
Nodes (23): Metric(), PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioFormProps, PortfolioList() (+15 more)

### Community 15 - "NotificationService"
Cohesion: 0.08
Nodes (14): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), Notification, MarkReadResponse, NotificationListResponse (+6 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.13
Nodes (31): ProjectMembersPage(), ProjectsPage(), InviteMemberDialog(), ProjectMembersTable(), InitialProjectMember, ProjectWizard(), useAddProjectMember(), useAssignableRoles() (+23 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (34): taskKeys, useInvalidate(), wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate (+26 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (27): chat_ws(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws() (+19 more)

### Community 19 - "users.py"
Cohesion: 0.09
Nodes (17): list_audit_logs(), change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+9 more)

### Community 20 - "list_portfolios"
Cohesion: 0.19
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 22 - "useNotifications.ts"
Cohesion: 0.11
Nodes (26): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+18 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (14): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), hash_password(), FakeRedis, test_a_wrong_password_is_counted_against_the_account() (+6 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.19
Nodes (14): _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation(), run_resource_recommendation(), runner(), _candidate(), _task() (+6 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.06
Nodes (35): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel() (+27 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "test_access_token_revocation.py"
Cohesion: 0.16
Nodes (10): _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works(), test_logout_revokes_both_tokens() (+2 more)

### Community 29 - "ChangeRequestDetail.tsx"
Cohesion: 0.17
Nodes (19): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, RiskBadge(), changeRequestKeys, IN_PROGRESS, useChangeRequest(), useImpactAnalysisJob() (+11 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.09
Nodes (29): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), create_phase(), delete_phase(), get_phase() (+21 more)

### Community 32 - "User"
Cohesion: 0.08
Nodes (13): EpicStatus, MilestoneStatus, PhaseStatus, User, add_audit(), get_project_context(), is_admin(), json_value() (+5 more)

### Community 33 - "react"
Cohesion: 0.09
Nodes (31): AuthLayout(), ResetPasswordContent(), ResetPasswordPage(), AdminLayout(), TABS, AdminIndexPage(), DashboardError(), DashboardLayout() (+23 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (51): description, name, overrides, postcss, private, version, metadata, RootLayout() (+43 more)

### Community 36 - "task_service.py"
Cohesion: 0.07
Nodes (32): create_dependency(), delete_dependency(), list_dependencies(), delete_subtask(), update_subtask(), bulk_update_tasks(), change_task_status(), create_subtask() (+24 more)

### Community 37 - "ResourceService"
Cohesion: 0.08
Nodes (16): get_current_project_id(), set_current_project_id(), AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, ResourceWarning, get_resource_service(), ResourceService (+8 more)

### Community 38 - "ForbiddenException"
Cohesion: 0.07
Nodes (17): _is_still_a_member(), get_current_verified_user(), role_checker(), BadRequestException, ConflictException, ForbiddenException, NotFoundException, DependencyType (+9 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.19
Nodes (16): forgot_password(), verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message() (+8 more)

### Community 40 - "UserRepository"
Cohesion: 0.09
Nodes (3): UserRepository, get_oauth_service(), get_user_service()

### Community 42 - "oauth_service.py"
Cohesion: 0.08
Nodes (18): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start() (+10 more)

### Community 43 - "risk_analyzer.py"
Cohesion: 0.14
Nodes (17): RiskLevel, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score(), _normalize_level(), run_risk_analysis() (+9 more)

### Community 44 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 45 - "main.py"
Cohesion: 0.05
Nodes (17): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, set_request_id(), client_key(), rate_limit_exceeded_handler(), _retry_after_seconds() (+9 more)

### Community 46 - "ProjectCreate"
Cohesion: 0.20
Nodes (3): ProjectCreate, ProjectUpdate, test_portfolio_and_project_schema_validation()

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (7): _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 48 - "projects.py"
Cohesion: 0.17
Nodes (11): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+3 more)

### Community 49 - "storage_service.py"
Cohesion: 0.13
Nodes (5): update_approvals(), update_project_versions(), get_storage_service(), StorageService, _put()

### Community 50 - "api.ts"
Cohesion: 0.06
Nodes (52): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, EmailVerificationBannerProps, SocialLoginButtonsProps, ChatMessageItem() (+44 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.19
Nodes (13): BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats, ProjectStats (+5 more)

### Community 52 - "Task"
Cohesion: 0.10
Nodes (13): ChatMessage, Milestone, Phase, Task, TaskRepository, _index_names(), test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in() (+5 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (17): OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage(), test_change_password_validates_current_password_and_revokes_sessions() (+9 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "sprints.py"
Cohesion: 0.24
Nodes (8): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint(), SprintStatus

### Community 57 - "resource_recommender.py"
Cohesion: 0.07
Nodes (20): AITaskType, model_routing_table(), resolve_model(), AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), generate_project_from_prompt() (+12 more)

### Community 58 - "Project"
Cohesion: 0.06
Nodes (30): AIRequest, Dependency, Project, Worklog, CPMResponse, CPMTask, _build_prompt(), generate_impact_analysis() (+22 more)

### Community 59 - "RoleService"
Cohesion: 0.39
Nodes (11): RoleUpdate, RoleService, build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role(), test_delete_role_blocks_when_users_still_assigned() (+3 more)

### Community 60 - "ProjectService"
Cohesion: 0.16
Nodes (14): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectResponse (+6 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "milestones.py"
Cohesion: 0.28
Nodes (6): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), update_milestone()

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.11
Nodes (18): 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án, 6. Lược đồ cơ sở dữ liệu (8 Domains & 34 Tables), 7. Hệ thống phân quyền (RBAC) & Quản trị Admin (+10 more)

### Community 66 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (9): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog() (+1 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.10
Nodes (17): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có (+9 more)

### Community 69 - "TaskStatus"
Cohesion: 0.06
Nodes (33): NotificationType, TaskStatus, notify_project_team(), ProjectContext, _apply_status_side_effects(), _mask_email(), sweep_task_dates(), test_sweep_is_noop_when_nothing_matches() (+25 more)

### Community 70 - "AdminUserService"
Cohesion: 0.08
Nodes (35): Settings, AdminUserCreate, AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts() (+27 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 72 - "DashboardService"
Cohesion: 0.25
Nodes (3): ActiveProjectSummary, DashboardService, _iso_week_bounds()

### Community 73 - "post"
Cohesion: 0.16
Nodes (13): generate_project(), get_ai_job(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis(), request_schedule_optimization(), AIGenerateProjectRequest, AIImpactAnalysisRequest (+5 more)

### Community 74 - "typing"
Cohesion: 0.08
Nodes (14): require_roles(), get_db(), AuditLog, IDResponse, PaginatedResponse, PortfolioCreate, get_admin_user_service(), get_ai_service() (+6 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 76 - "AIService"
Cohesion: 0.29
Nodes (3): AIRequestType, AIJobResponse, AIService

### Community 78 - "ChatService"
Cohesion: 0.10
Nodes (19): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+11 more)

### Community 79 - "AuditService"
Cohesion: 0.23
Nodes (5): AuditService, get_audit_service(), build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page()

### Community 80 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (8): build_db(), build_service(), build_user(), test_logout_ignores_a_token_of_the_wrong_type(), test_logout_revokes_the_refresh_token(), test_logout_without_a_token_is_a_no_op(), test_refresh_rotates_the_presented_token_out(), test_replaying_a_rotated_refresh_token_revokes_every_session()

### Community 81 - "sweep_task_dates_task"
Cohesion: 0.11
Nodes (14): parse_document_task(), sweep_task_dates_task(), _sweep_with_own_session(), 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001) (+6 more)

### Community 82 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (4): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry()

### Community 83 - "approvals.py"
Cohesion: 0.18
Nodes (4): create_approvals(), delete_approvals(), get_approvals(), list_approvals()

### Community 84 - "test_change_request_service.py"
Cohesion: 0.22
Nodes (15): ChangeRequest, CRStatus, ChangeRequestCreate, ChangeRequestResponse, ChangeRequestService, fake_db(), project_context(), _simulate_db_defaults() (+7 more)

### Community 85 - "env.py"
Cohesion: 0.11
Nodes (7): do_run_migrations(), run_async_migrations(), run_migrations_online(), list_permissions(), main(), seed(), Permission

### Community 86 - "documents.py"
Cohesion: 0.08
Nodes (10): create_documents(), delete_documents(), get_documents(), list_documents(), update_documents(), create_skills(), delete_skills(), get_skills() (+2 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.17
Nodes (5): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), update_gantt()

### Community 88 - "leaves.py"
Cohesion: 0.17
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 89 - "project_versions.py"
Cohesion: 0.18
Nodes (4): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions()

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (5): create_reports(), delete_reports(), get_reports(), list_reports(), update_reports()

### Community 91 - "test_ai_service.py"
Cohesion: 0.47
Nodes (9): AIRequestStatus, ai_request(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 92 - "system.py"
Cohesion: 0.17
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 93 - "UserService"
Cohesion: 0.16
Nodes (8): ServiceUnavailableException, UnauthorizedException, ChangePasswordRequest, DeleteAccountRequest, UserUpdate, UserService, test_search_results_are_masked_end_to_end(), test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data()

### Community 95 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 96 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.12
Nodes (15): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001) (+7 more)

### Community 98 - ".get_project_stats"
Cohesion: 0.20
Nodes (7): Bảo mật, Còn nợ, Giao diện, Hiệu năng, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "fixture"
Cohesion: 0.13
Nodes (11): as_user(), factory(), client(), override_db(), _disable_rate_limiting(), engine(), event_loop(), make_user() (+3 more)

### Community 101 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (7): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing(), two_projects()

### Community 102 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (3): get_dashboard_summary(), get_portfolio_health(), get_project_stats()

### Community 103 - "GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001)"
Cohesion: 0.26
Nodes (9): GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject(), aiService, AIJobResponse, AIJobStatus (+1 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "generate_project_task"
Cohesion: 0.16
Nodes (12): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), resource_recommendation_task(), risk_analysis_task(), sweep_active_projects_for_risk(), 5 Trụ cột AI chính:, Danh mục tính năng triển khai theo Phase (+4 more)

### Community 106 - "Triển khai bản thử nghiệm trên Oracle Cloud Always Free"
Cohesion: 0.25
Nodes (8): 1. Tạo máy và mạng, 2. Cài Docker và lấy mã nguồn, 3. Cấu hình bí mật và URL, 4. Build, migrate và khởi động, 5. Kiểm tra sau triển khai, Nguồn đối chiếu, Triển khai bản thử nghiệm trên Oracle Cloud Always Free, Điều kiện trước khi bắt đầu

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "create_change_request"
Cohesion: 0.36
Nodes (4): create_change_request(), get_change_request(), list_change_requests(), submit_change_request()

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 115 - "get_redis"
Cohesion: 0.11
Nodes (10): get_redis(), get_redis_pubsub(), is_revoked(), _key(), revoke(), _ttl_seconds(), _pending_key(), recalculate_project_task() (+2 more)

### Community 128 - "Leave"
Cohesion: 0.33
Nodes (5): Leave, Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004), GIAI ĐOẠN 3.6 – AI Phân tích rủi ro (SOP-AI-005)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 160 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Môi trường phía giao diện (`frontend/.env.local`), Môi trường phía máy chủ (`backend/.env`)

### Community 161 - "run_impact_analysis"
Cohesion: 0.24
Nodes (14): RiskLevel, run_impact_analysis(), _validate_ai_output(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+6 more)

### Community 164 - "utils/cpm.py"
Cohesion: 0.11
Nodes (26): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, _edges_by_predecessor(), _edges_by_successor(), forward_pass() (+18 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

## Knowledge Gaps
- **320 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1063 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `formatDate` to `User`, `react`, `Button`, `TaskStatus`, `PortfolioService`, `ResourceService`, `DashboardService`, `ForbiddenException`, `tasks/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `ChatService`, `NotificationService`, `portfolios/[id]/page.tsx`, `projects/page.tsx`, `api.ts`, `useNotifications.ts`, `ProjectService`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `PortfolioService`, `ai_tasks.py`, `test_ws_hardening.py`, `users.py`, `list_portfolios`, `test_resource_recommender.py`, `test_access_token_revocation.py`, `wbs_service.py`, `AuthService`, `task_service.py`, `ResourceService`, `ForbiddenException`, `UserRepository`, `ProjectRepository`, `oauth_service.py`, `test_auth_email_verification.py`, `main.py`, `test_oauth_account_takeover.py`, `projects.py`, `dashboard_service.py`, `resource_recommender.py`, `Project`, `RoleService`, `ProjectService`, `OAuthService`, `AdminUserService`, `DashboardService`, `post`, `typing`, `AIService`, `ChatService`, `test_change_request_service.py`, `env.py`, `UserService`, `.get_project_stats`, `fixture`, `generate_project_task`, `get_current_active_superuser`, `get_current_user`, `ProjectStatus`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `OAuthService`, `AdminUserService`, `getApiErrorMessage`, `AuditService`, `RoleService`, `UserService`, `AuthService`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 41 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._