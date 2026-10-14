# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-14)

## Corpus Check
- 608 files · ~556,867 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 5424 nodes · 18242 edges · 222 communities (168 shown, 54 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1669 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `740b7a0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createFireworks
- Button
- sqlalchemy
- RequirementBrief
- ProjectOverviewCharts.tsx
- versions/types.ts
- api
- security.py
- unittest_mock
- AIResponseError
- test_auth_cookies.py
- Role
- test_xlsx_renderer.py
- cn
- test_bpmn_schema.py
- test_process_model_job.py
- test_requirement_brief_schema.py
- endpoints/ai.py
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- swimlaneLayout.ts
- Project
- lucide-react
- process_png.py
- ConnectionManager
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- Skeleton
- schemas/requirement_brief.py
- list_notifications
- test_auth_password_recovery.py
- test_authz_matrix.py
- ProjectService
- sweep_task_dates_task
- list_projects
- typing
- diff_snapshots
- versions/page.tsx
- useTasks.ts
- requirement_briefs.py
- scheduling_tasks.py
- StorageService
- test_cpm_scheduling.py
- projects/page.tsx
- useCPM.test.tsx
- providers.tsx
- Chi tiết các Giai đoạn đã hoàn thành
- api.ts
- UserRepository
- portfolios/[id]/page.tsx
- test_user_profile_settings.py
- Settings
- ai_tasks.py
- test_document_writer.py
- package.json
- run_impact_analysis
- system.py
- job_runner.py
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- post
- test_process_png.py
- connectWebSocket
- test_resource_warnings.py
- schemas/process_model.py
- admin.py
- AdminUserService
- test_requirement_clarifier_parse.py
- DocumentTemplate
- TaskServiceDep
- react
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- security_state_service.py
- AGENTS.md
- get_chat_history
- test_ai_service.py
- test_resource_recommender.py
- Chi tiết các Giai đoạn đã hoàn thành
- @tanstack/react-query
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- ProjectRepository
- test_rate_limit.py
- leaves.py
- task_service.py
- test_docx_renderer.py
- test_document_generation_job.py
- OAuthService
- types
- Thiết kế các luồng Phase 4
- test_reported_metrics_are_real.py
- test_security_state.py
- RoleService
- Tài liệu yêu cầu nghiệp vụ (BRD)
- DashboardService
- devDependencies
- next.config.js
- main
- test_auth_email_verification.py
- run_ai
- project_versions.py
- list_portfolios
- schedule-optimization.types.ts
- middleware.ts
- Rà soát code và nâng cấp giao diện — 2026-09-15
- useDocuments.ts
- layout.ts
- playwright
- approve_step
- scripts
- main.py
- Kế hoạch: Render Free + Supabase Free
- test_portfolio_project_core.py
- oauth.py
- SecurityLimiter
- requirement_brief_service.py
- my_assignments
- Đặc tả yêu cầu phần mềm (SRS)
- FakeProvider
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- Rà soát cuối: Render Free + Supabase Free
- schemas/document.py
- date_utils.py
- PortfolioRepository
- AuthService
- test_dashboard_metrics.py
- Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)
- 11. Cài đặt và Chạy hệ thống
- Backend local verification — 2026-10-09
- Durable jobs verification
- AuditService
- useXlsxExport.ts
- create_dependency
- dashboards.py
- ProjectCreate
- skills.py
- RequirementItems
- .get_user_summary
- 3. Ngăn xếp công nghệ
- test_project_scoping.py
- update_subtask
- validate_password_policy
- bpmn.py
- RequirementClarifier.tsx
- PortfolioService
- merged_content
- README.md
- request_xlsx_report
- test_private_storage_access.py
- pytest
- test_oauth_account_takeover.py
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- docx_renderer.py
- fixture
- approvals.ts
- test_migration_matches_model_and_downgrades
- FakeStorage
- test_xlsx_report_job.py
- test_recent_activity_filters_by_visible_projects
- UI Guidelines (design system noi bo)
- Frontend durable jobs verification
- Tiến độ — tasks/plan.md
- resource-recommendation.service.ts
- NotificationService
- ChatService
- wbs.py
- Prompt điều phối subagent — Phase 4
- process/types.ts
- Rà soát 2026-09-06
- fixture
- Job
- get_admin_user_service
- get_dashboard_service
- list_jobs
- fireworks.ts
- ThemeProvider.tsx
- User
- AppBackground.tsx
- acquire
- test_version_rollback.py

## God Nodes (most connected - your core abstractions)
1. `User` - 296 edges
2. `Button` - 133 edges
3. `cn()` - 113 edges
4. `Project` - 104 edges
5. `Task` - 103 edges
6. `ForbiddenException` - 101 edges
7. `Job` - 99 edges
8. `NotFoundException` - 96 edges
9. `react` - 93 edges
10. `Base` - 89 edges

## Surprising Connections (you probably didn't know these)
- `Implemented contract` --references--> `JobRunner`  [INFERRED]
  docs/job-core-verification.md → backend/app/core/job_runner.py
- `Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI` --references--> `main()`  [INFERRED]
  docs/specs/system-architecture/srs.md → backend/app/db/seed.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `Chuyển mode và nghiệm thu` --references--> `AuthService`  [INFERRED]
  docs/security-state-audit.md → backend/app/services/auth_service.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py

## Import Cycles
- None detected.

## Communities (222 total, 54 thin omitted)

### Community 0 - "createFireworks"
Cohesion: 0.23
Nodes (20): colorsFor(), createFireworks(), baseSpeed(), burst(), crackleBurst(), destroy(), draw(), explode() (+12 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (106): ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, metadata, RegisterPage(), AdminRolesPage() (+98 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.05
Nodes (42): Assignment, Base, ChatMessage, Comment, DocumentType, EmailLog, EmailStatus, Epic (+34 more)

### Community 3 - "RequirementBrief"
Cohesion: 0.13
Nodes (31): AIOutput, RequirementBrief, enqueue_clarify_turn(), create_brief(), _create(), _job_count(), _reload(), _run_turn() (+23 more)

### Community 4 - "ProjectOverviewCharts.tsx"
Cohesion: 0.07
Nodes (52): BurndownChart(), BurndownChartLabels, BurndownChartProps, DEFAULT_LABELS, formatDate(), ANIMATION_DURATION, animationProps(), axisProps (+44 more)

### Community 5 - "versions/types.ts"
Cohesion: 0.09
Nodes (26): diff, emptyGroup, messages, mocks, setup(), version(), zero, diff (+18 more)

### Community 6 - "api"
Cohesion: 0.13
Nodes (18): ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, approvalKeys, Decision, changeRequestKeys (+10 more)

### Community 7 - "security.py"
Cohesion: 0.11
Nodes (18): get_current_user_media(), _user_from_token(), create_access_token(), create_refresh_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works(), test_logout_revokes_both_tokens() (+10 more)

### Community 8 - "unittest_mock"
Cohesion: 0.11
Nodes (12): EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task(), send_password_reset_email_task() (+4 more)

### Community 9 - "AIResponseError"
Cohesion: 0.11
Nodes (17): parse_process_model(), AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), build_system_prompt(), build_user_prompt(), generate_process_model() (+9 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 11 - "Role"
Cohesion: 0.11
Nodes (8): do_run_migrations(), run_async_migrations(), run_migrations_online(), seed(), Permission, Role, engine(), seed_roles()

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.06
Nodes (33): build_report_data(), compute_eva(), burndown_header_row(), BurndownRow, ChangeRequestRow, _coerce_date(), CriticalPathData, EVAData (+25 more)

### Community 13 - "cn"
Cohesion: 0.07
Nodes (79): Field(), FilterSelect(), KanbanColumn(), PRIORITY_TONE, SprintView(), STATUS_TONE, STATUSES, TaskCard() (+71 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.13
Nodes (34): lint_process_model(), ProcessModel, _error_text(), test_blank_label_normalized_to_none(), test_blank_name_rejected(), test_closed_cycle_without_exit_rejected(), test_dead_end_node_rejected(), test_duplicate_ids_rejected() (+26 more)

### Community 15 - "test_process_model_job.py"
Cohesion: 0.10
Nodes (24): ProcessModelRecord, reserve_ai_call(), find_project_brief(), get_latest_process(), get_latest_process_model(), ProcessRequestOutcome, read_latest_for_user(), request_process_model() (+16 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.14
Nodes (26): apply_item_updates(), empty_items(), RequirementBriefUpdateError, validate_items(), test_ai_cannot_reopen_user_clear_item_as_missing(), test_ai_cannot_set_assumed_or_skipped(), test_ai_clear_item_can_be_refined_by_ai_and_overridden_by_user(), test_ai_clear_update_is_applied_without_mutating_input() (+18 more)

### Community 17 - "endpoints/ai.py"
Cohesion: 0.14
Nodes (15): AIGenerateProjectFromBriefRequest, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis() (+7 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (22): chat_ws(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws() (+14 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (15): connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user(), list_users() (+7 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.14
Nodes (20): client(), email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified(), test_email_transport_timeout_hides_secrets_and_retains_retry_key(), test_minio_compatibility_releases_download_connection(), test_minio_infrastructure_errors_become_sanitized_storage_errors(), test_resend_errors_are_sanitized_and_classified() (+12 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.07
Nodes (44): mocks, record, setup(), clip(), NodeShape(), ProcessDiagram(), model, setup() (+36 more)

### Community 22 - "Project"
Cohesion: 0.05
Nodes (68): UnprocessableException, Approval, ApprovalStatus, ChangeRequest, CRStatus, Project, ApprovalChainResponse, ApprovalStepResponse (+60 more)

### Community 23 - "lucide-react"
Cohesion: 0.15
Nodes (23): NotificationsPage(), NotificationBell(), ACTION_BUTTON, NotificationItem(), Props, TONE_CLASSES, TYPE_META, NotificationPanel() (+15 more)

### Community 24 - "process_png.py"
Cohesion: 0.10
Nodes (13): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+5 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (8): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel()

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
Cohesion: 0.12
Nodes (27): AdminAuditPage(), AdminUsersPage(), DeactivateUserDialog(), UserFormProps, adminUserKeys, useAdminUsers(), useCreateAdminUser(), useDeactivateAdminUser() (+19 more)

### Community 30 - "Skeleton"
Cohesion: 0.07
Nodes (54): OAuthCallbackContent(), OAuthCallbackPage(), OAuthPendingState(), ResetPasswordContent(), ResetPasswordPage(), VerificationState, VerifyEmailContent(), verify() (+46 more)

### Community 31 - "schemas/requirement_brief.py"
Cohesion: 0.15
Nodes (12): AssumptionAcceptRequest, _build_item(), _clean(), ItemUpdateResult, QAEntry, RequirementBriefDetail, RequirementBriefRead, RequirementItem (+4 more)

### Community 32 - "list_notifications"
Cohesion: 0.15
Nodes (5): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read()

### Community 33 - "test_auth_password_recovery.py"
Cohesion: 0.24
Nodes (13): verify_password(), build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message(), test_new_request_invalidates_previous_token(), test_outbox_failure_aborts_transaction_without_sensitive_logs() (+5 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "ProjectService"
Cohesion: 0.18
Nodes (13): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+5 more)

### Community 36 - "sweep_task_dates_task"
Cohesion: 0.22
Nodes (7): sweep_task_dates_task(), Chi tiết các Giai đoạn, GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness

### Community 37 - "list_projects"
Cohesion: 0.15
Nodes (10): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+2 more)

### Community 38 - "typing"
Cohesion: 0.04
Nodes (23): JobResponse, list_permissions(), require_roles(), role_checker(), get_client_ip(), get_current_project_id(), set_current_project_id(), get_db() (+15 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (16): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), _translate(), _snap() (+8 more)

### Community 40 - "versions/page.tsx"
Cohesion: 0.23
Nodes (15): formatDateTime(), KNOWN_KINDS, VersionsPage(), RollbackDialog(), RollbackDialogProps, ChangeKind, formatValue(), ItemTitle() (+7 more)

### Community 41 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 42 - "requirement_briefs.py"
Cohesion: 0.11
Nodes (16): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), list_briefs(), patch_item(), reject_assumption() (+8 more)

### Community 43 - "scheduling_tasks.py"
Cohesion: 0.21
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 44 - "StorageService"
Cohesion: 0.14
Nodes (8): StorageError, StorageNotFoundError, StorageService, _put(), Email and private storage adapters, Existing file flow and scope, Local verification, Supabase Storage setup

### Community 45 - "test_cpm_scheduling.py"
Cohesion: 0.05
Nodes (53): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), run_schedule_optimization(), _validate_and_filter_result(), run_cpm() (+45 more)

### Community 46 - "projects/page.tsx"
Cohesion: 0.08
Nodes (41): Primitive, AdminIndexPage(), AdminTile, TILES, ProjectLayout(), ProjectMembersPage(), ProjectsPage(), ErrorState() (+33 more)

### Community 47 - "useCPM.test.tsx"
Cohesion: 0.15
Nodes (14): CPM_JOB_KIND, cpmKeys, shouldRetry(), schedule, useCPM(), UseCPMResult, useReloadWhenCPMJobSucceeds(), classifyCPMError() (+6 more)

### Community 48 - "providers.tsx"
Cohesion: 0.21
Nodes (9): inter, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), themeInitScript, notifyError() (+1 more)

### Community 49 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.13
Nodes (11): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005), Hiện trạng & Hạ tầng sẵn có (+3 more)

### Community 50 - "api.ts"
Cohesion: 0.04
Nodes (94): Danh mục tính năng đã triển khai, 5 Trụ cột chính:, Danh mục tính năng triển khai theo Phase, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun AI tài liệu và hoàn thiện (Phase 5), Tổng quan Module, AuthLayout(), AuthLoadingSkeleton() (+86 more)

### Community 52 - "portfolios/[id]/page.tsx"
Cohesion: 0.10
Nodes (37): Metric(), PortfolioDetailPage(), ProgressBar(), PortfoliosPage(), CountUp(), Reveal(), RevealTextProps, StatsRow() (+29 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.10
Nodes (26): ServiceUnavailableException, UnauthorizedException, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, UserBase, UserCreate, UserUpdate (+18 more)

### Community 54 - "Settings"
Cohesion: 0.18
Nodes (10): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+2 more)

### Community 55 - "ai_tasks.py"
Cohesion: 0.04
Nodes (43): AmbiguousJobError, ImpactReportResponse, RiskReportResponse, BaseAIProvider, AITaskType, model_routing_table(), resolve_model(), build_brief_generation_prompt() (+35 more)

### Community 56 - "test_document_writer.py"
Cohesion: 0.09
Nodes (21): build_assumption_items(), build_brief_context(), build_process_steps(), build_system_prompt(), build_user_prompt(), render(), _cut(), parse_group_response() (+13 more)

### Community 57 - "package.json"
Cohesion: 0.04
Nodes (44): description, name, overrides, postcss, private, version, mocks, setup() (+36 more)

### Community 58 - "run_impact_analysis"
Cohesion: 0.26
Nodes (13): run_impact_analysis(), _validate_ai_output(), change_request(), FakeScalars, make_db(), patched_ai(), project(), task() (+5 more)

### Community 59 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 60 - "job_runner.py"
Cohesion: 0.13
Nodes (8): JobError, RetryableJobError, _build_prompt(), generate_impact_analysis(), get_ai_provider(), _summarize_cpm(), _truncate(), run_report()

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.14
Nodes (14): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+6 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.09
Nodes (24): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+16 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (24): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+16 more)

### Community 64 - "post"
Cohesion: 0.09
Nodes (15): create_change_request(), get_change_request(), list_change_requests(), submit_change_request(), schedule_jobs(), change_password(), active_timer(), create_worklog() (+7 more)

### Community 65 - "test_process_png.py"
Cohesion: 0.22
Nodes (10): prepare_process_section(), ProcessRenderError, render_process_png(), build_model(), open_png(), test_internal_failure_raises_process_render_error(), test_large_process_is_scaled_down_within_limits(), test_render_without_vietnamese_font_falls_back() (+2 more)

### Community 66 - "connectWebSocket"
Cohesion: 0.24
Nodes (6): connectWebSocket(), connect(), scheduleReconnect(), FakeSocket, WSClient, WSClientOptions

### Community 67 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 68 - "schemas/process_model.py"
Cohesion: 0.17
Nodes (6): generate_process_model(), get_process_model(), ProcessModelGenerateRequest, ProcessModelGenerateResponse, ProcessModelResponse, ProcessStepRow

### Community 69 - "admin.py"
Cohesion: 0.10
Nodes (13): create_role(), delete_role(), get_role(), list_roles(), update_role(), AdminUserResponse, AuditActorSummary, AuditLogResponse (+5 more)

### Community 70 - "AdminUserService"
Cohesion: 0.20
Nodes (19): AdminUserCreate, AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts(), test_create_user_success() (+11 more)

### Community 71 - "test_requirement_clarifier_parse.py"
Cohesion: 0.13
Nodes (10): build_clarify_prompt(), render(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), test_invalid_response_raises(), test_null_question_and_no_question_mark_allowed() (+2 more)

### Community 72 - "DocumentTemplate"
Cohesion: 0.09
Nodes (7): blocking_missing_items(), _brief_item_usable(), Column, DocumentTemplate, missing_brief_items(), Section, test_missing_brief_items_counts_only_clear_and_assumed()

### Community 73 - "TaskServiceDep"
Cohesion: 0.14
Nodes (9): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+1 more)

### Community 74 - "react"
Cohesion: 0.06
Nodes (70): AIInsightsPage(), ChangeRequestDetailPage(), ChangeRequestsPage(), ProjectChatPage(), apiDetail(), formatDateTime(), KNOWN_ERRORS, ProcessPage() (+62 more)

### Community 75 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 76 - "security_state_service.py"
Cohesion: 0.19
Nodes (21): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+13 more)

### Community 78 - "get_chat_history"
Cohesion: 0.19
Nodes (4): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message()

### Community 79 - "test_ai_service.py"
Cohesion: 0.38
Nodes (9): ai_request(), authorized_project_context(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet() (+1 more)

### Community 80 - "test_resource_recommender.py"
Cohesion: 0.19
Nodes (14): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), run_resource_recommendation(), runner(), _candidate(), _task() (+6 more)

### Community 81 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.18
Nodes (10): 7 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications (+2 more)

### Community 82 - "@tanstack/react-query"
Cohesion: 0.12
Nodes (28): aiJobKeys, useAIJob(), useGenerateProject(), useImpactAnalysisJob(), isAccessError(), isTerminalJob(), jobPollingInterval(), pageActive() (+20 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.17
Nodes (12): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+4 more)

### Community 84 - "ProjectRepository"
Cohesion: 0.11
Nodes (3): ProjectMethodology, ProjectStatus, ProjectRepository

### Community 85 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (4): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry()

### Community 86 - "leaves.py"
Cohesion: 0.15
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 87 - "task_service.py"
Cohesion: 0.06
Nodes (50): NotificationType, TaskPriority, TaskStatus, AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate, DependencyResponse (+42 more)

### Community 88 - "test_docx_renderer.py"
Cohesion: 0.19
Nodes (19): _headings(), _open(), _png_bytes(), _render(), _rows(), _table_after_heading(), test_assumptions_section_lists_assumed_and_skipped_from_brief_only(), test_docx_opens_with_title_toc_and_heading_levels() (+11 more)

### Community 89 - "test_document_generation_job.py"
Cohesion: 0.13
Nodes (32): GeneratedDocument, plan_section_groups(), _enqueue_step(), find_project_brief(), _job_active(), _quota_exhausted(), request_document(), get_template() (+24 more)

### Community 90 - "OAuthService"
Cohesion: 0.12
Nodes (6): code_challenge_for(), new_code_verifier(), TokenResponse, get_oauth_service(), OAuthService, OAuthState

### Community 91 - "types"
Cohesion: 0.14
Nodes (8): UserSearchResult, _mask_email(), test_customer_role_cannot_read_project_work_items(), test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing(), test_project_role_options_do_not_carry_the_permission_matrix(), test_search_results_are_masked_end_to_end(), test_user_search_result_never_carries_a_usable_address()

### Community 92 - "Thiết kế các luồng Phase 4"
Cohesion: 0.29
Nodes (7): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 93 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (11): _apply_status_side_effects(), _task(), test_a_task_completed_without_ever_starting_still_gets_a_start_date(), test_epic_story_points_are_rolled_up_from_tasks(), test_finishing_work_records_the_end_date(), test_progress_can_be_reported_between_the_extremes(), test_progress_outside_zero_to_one_hundred_is_rejected(), test_project_cost_is_derived_from_logged_hours_and_rates() (+3 more)

### Community 94 - "test_security_state.py"
Cohesion: 0.05
Nodes (45): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), issue(), _key(), redeem() (+37 more)

### Community 95 - "RoleService"
Cohesion: 0.30
Nodes (12): RoleCreate, RoleUpdate, RoleService, build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role() (+4 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "DashboardService"
Cohesion: 0.18
Nodes (14): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+6 more)

### Community 98 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "main"
Cohesion: 0.20
Nodes (9): main(), Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan, Môi trường kiểm thử, Nhật ký, Nhật ký tiến độ Phase 4 (+1 more)

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 103 - "run_ai"
Cohesion: 0.10
Nodes (24): PermanentJobError, authorize_request(), run_ai(), apply(), insufficient_items(), apply_clarify_result(), build_brief_snapshot(), _lock_brief() (+16 more)

### Community 104 - "project_versions.py"
Cohesion: 0.17
Nodes (12): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+4 more)

### Community 105 - "list_portfolios"
Cohesion: 0.17
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 106 - "schedule-optimization.types.ts"
Cohesion: 0.28
Nodes (7): scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "useDocuments.ts"
Cohesion: 0.22
Nodes (15): documentFilename(), documentService, saveBlob(), documentKeys, hasActiveDocument(), api, base, useDownloadDocument() (+7 more)

### Community 111 - "layout.ts"
Cohesion: 0.11
Nodes (32): formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small, task() (+24 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "approve_step"
Cohesion: 0.19
Nodes (5): approve_step(), list_approvals(), reject_step(), ApprovalApproveRequest, ApprovalRejectRequest

### Community 114 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 115 - "main.py"
Cohesion: 0.05
Nodes (19): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, set_request_id(), rate_limit_exceeded_handler(), _retry_after_seconds(), close_redis() (+11 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 118 - "oauth.py"
Cohesion: 0.22
Nodes (8): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), state_cookie_kwargs(), state_cookie_path()

### Community 119 - "SecurityLimiter"
Cohesion: 0.33
Nodes (3): SecurityLimiter, decorator(), wrapper()

### Community 120 - "requirement_brief_service.py"
Cohesion: 0.18
Nodes (18): ItemCounts, PendingTurn, RequirementBriefSummary, RequirementItemPatch, accept_assumption(), answer(), _apply_user_updates(), _counts() (+10 more)

### Community 121 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 122 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "run_risk_analysis"
Cohesion: 0.29
Nodes (11): run_risk_analysis(), runner(), fake_db(), project(), _scalars_result(), test_invalid_risk_level_falls_back_to_score_derived_level(), test_missing_project_raises_value_error(), test_non_list_factors_and_suggestions_are_wrapped_not_raised() (+3 more)

### Community 128 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 129 - "schemas/document.py"
Cohesion: 0.18
Nodes (12): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), _to_response() (+4 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 139 - "AuthService"
Cohesion: 0.08
Nodes (12): hash_password(), AuthService, get_auth_service(), FakeRedis, test_a_wrong_password_is_counted_against_the_account(), test_account_locks_after_repeated_failures_regardless_of_source_ip(), test_authenticate_refuses_while_locked_without_hashing_a_password(), test_lockout_backs_off_further_with_each_extra_failure() (+4 more)

### Community 145 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.12
Nodes (15): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở), Mặc định đã áp dụng cho câu hỏi mở (2026-10-12, chờ người dùng duyệt) (+7 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. (Không bắt buộc, kế thừa) Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 149 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 150 - "AuditService"
Cohesion: 0.26
Nodes (6): AuditService, get_audit_service(), build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page(), GIAI ĐOẠN 1.6 – Admin Management & RBAC Control (SOP-ADM-001)

### Community 151 - "useXlsxExport.ts"
Cohesion: 0.28
Nodes (12): reportErrorCode(), useXlsxExport(), XlsxExportState, readStoredJobId(), reportService, storageKey(), writeStoredJobId(), KNOWN_REPORT_ERRORS (+4 more)

### Community 152 - "create_dependency"
Cohesion: 0.29
Nodes (3): create_dependency(), delete_dependency(), list_dependencies()

### Community 153 - "dashboards.py"
Cohesion: 0.29
Nodes (3): get_dashboard_summary(), get_portfolio_health(), get_project_stats()

### Community 154 - "ProjectCreate"
Cohesion: 0.20
Nodes (3): ProjectCreate, ProjectUpdate, test_portfolio_and_project_schema_validation()

### Community 155 - "skills.py"
Cohesion: 0.15
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 158 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (5 dịch vụ mặc định + 2 dịch vụ Celery kế thừa trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 159 - "test_project_scoping.py"
Cohesion: 0.36
Nodes (6): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing()

### Community 162 - "bpmn.py"
Cohesion: 0.11
Nodes (8): _adjacency(), process_steps_table(), ProcessFlow, ProcessLane, ProcessNode, _reach(), process_model_steps(), test_max_size_chain_is_accepted()

### Community 163 - "RequirementClarifier.tsx"
Cohesion: 0.09
Nodes (43): Hiện trạng theo tính năng, Hỏi làm rõ yêu cầu, 3.9 Tích hợp AI (SRS-AI), apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_TONE (+35 more)

### Community 164 - "PortfolioService"
Cohesion: 0.15
Nodes (9): PortfolioStatus, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate (+1 more)

### Community 166 - "README.md"
Cohesion: 0.18
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 167 - "request_xlsx_report"
Cohesion: 0.22
Nodes (4): download_xlsx_report(), request_xlsx_report(), XlsxReportAccepted, XlsxReportRequest

### Community 168 - "test_private_storage_access.py"
Cohesion: 0.33
Nodes (6): factory(), provider(), test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 169 - "pytest"
Cohesion: 0.06
Nodes (36): TooManyRequestsException, AIRequest, AIRequestStatus, AIRequestType, ImpactReport, RiskLevel, RiskLevel, RiskReport (+28 more)

### Community 170 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (6): _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 171 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 172 - "docx_renderer.py"
Cohesion: 0.08
Nodes (26): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _cell_text(), _clean_text(), ContentValidation (+18 more)

### Community 173 - "fixture"
Cohesion: 0.18
Nodes (8): as_user(), factory(), override_db(), _disable_rate_limiting(), event_loop(), make_user(), factory(), session()

### Community 175 - "test_migration_matches_model_and_downgrades"
Cohesion: 0.40
Nodes (3): _load_migration(), test_migration_chains_after_security_state(), test_migration_matches_model_and_downgrades()

### Community 180 - "test_xlsx_report_job.py"
Cohesion: 0.16
Nodes (11): request_xlsx_report(), SchedulingService, drain(), http_as(), make_project(), test_compute_eva_formula(), test_invalid_language_rejected(), test_member_removed_before_run_fails_job() (+3 more)

### Community 181 - "test_recent_activity_filters_by_visible_projects"
Cohesion: 0.50
Nodes (3): _captured_where_text(), test_recent_activity_filters_by_visible_projects(), test_recent_activity_returns_nothing_without_visible_projects()

### Community 182 - "UI Guidelines (design system noi bo)"
Cohesion: 0.50
Nodes (3): Mau trang chuan, Token, UI Guidelines (design system noi bo)

### Community 183 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.29
Nodes (6): Cập nhật 2026-10-14, Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 190 - "NotificationService"
Cohesion: 0.14
Nodes (10): Notification, MarkReadResponse, NotificationListResponse, NotificationResponse, UnreadCountResponse, get_notification_service(), NotificationService, test_push_does_not_shield_callers_from_a_broadcast_exception() (+2 more)

### Community 191 - "ChatService"
Cohesion: 0.11
Nodes (18): publish(), publish_many(), ChatReadState, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatService, sanitize_message() (+10 more)

### Community 194 - "wbs.py"
Cohesion: 0.05
Nodes (42): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), complete_milestone(), create_milestone(), delete_milestone() (+34 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.17
Nodes (11): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm), V0 — quy tắc rollback mặc định (+3 more)

### Community 200 - "Rà soát 2026-09-06"
Cohesion: 0.22
Nodes (8): Bảo mật, Còn nợ, Giao diện, Hiệu năng, Lỗi chặn đã sửa, Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0, flush()

### Community 204 - "Job"
Cohesion: 0.07
Nodes (40): JobContext, JobResult, JobRunner, Job, run_daily_batch(), apply(), aware(), enqueue() (+32 more)

### Community 215 - "list_jobs"
Cohesion: 0.31
Nodes (3): get_job(), list_jobs(), visible_jobs()

### Community 225 - "fireworks.ts"
Cohesion: 0.12
Nodes (16): AMBER, FireworksEngine, FireworksOptions, GOLD, Hue, INTERACTIVE_SELECTOR, LIME, NOOP_ENGINE (+8 more)

### Community 226 - "ThemeProvider.tsx"
Cohesion: 0.27
Nodes (11): apply(), systemPrefersDark(), Status(), Theme(), ThemeContext, ThemeContextValue, ThemePreference, ThemeProvider() (+3 more)

### Community 227 - "User"
Cohesion: 0.04
Nodes (46): _is_still_a_member(), get_current_active_superuser(), get_current_verified_user(), BadRequestException, ConflictException, ForbiddenException, NotFoundException, EpicStatus (+38 more)

### Community 228 - "AppBackground.tsx"
Cohesion: 0.25
Nodes (10): AppBackground(), currentMode(), hasTextSelection(), FireworksMode, isInteractiveTarget(), FireworksToggleProps, FIREWORKS_STORAGE_KEY, FireworksPreference (+2 more)

### Community 231 - "test_version_rollback.py"
Cohesion: 0.05
Nodes (51): get_current_user(), Dependency, DependencyType, ProjectVersion, _apply_fields(), create_snapshot(), _enforce_cap(), _from_json() (+43 more)

## Knowledge Gaps
- **546 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+541 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1670 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `api.ts` to `DashboardService`, `Button`, `ProjectService`, `PortfolioService`, `User`, `ProjectOverviewCharts.tsx`, `cn`, `Chi tiết các Giai đoạn đã hoàn thành`, `portfolios/[id]/page.tsx`, `lucide-react`, `task_service.py`, `NotificationService`, `ChatService`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `sqlalchemy`, `RequirementBrief`, `security.py`, `Role`, `AuthService`, `test_xlsx_renderer.py`, `test_process_model_job.py`, `endpoints/ai.py`, `test_ws_hardening.py`, `users.py`, `Project`, `.get_user_summary`, `ProjectService`, `PortfolioService`, `list_projects`, `typing`, `pytest`, `test_oauth_account_takeover.py`, `fixture`, `approvals.ts`, `UserRepository`, `test_xlsx_report_job.py`, `test_user_profile_settings.py`, `ai_tasks.py`, `job_runner.py`, `ChatService`, `wbs.py`, `AdminUserService`, `Job`, `ProjectRepository`, `task_service.py`, `test_document_generation_job.py`, `OAuthService`, `test_security_state.py`, `RoleService`, `DashboardService`, `test_auth_email_verification.py`, `test_version_rollback.py`, `run_ai`, `list_portfolios`, `requirement_brief_service.py`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `DashboardService` to `sqlalchemy`, `User`, `typing`, `Rà soát 2026-09-06`, `test_xlsx_renderer.py`, `test_dashboard_metrics.py`, `api.ts`, `get_dashboard_service`, `ProjectRepository`, `test_xlsx_report_job.py`, `Project`, `task_service.py`, `test_recent_activity_filters_by_visible_projects`, `Chi tiết các Giai đoạn đã hoàn thành`, `.get_user_summary`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _546 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.047821681864235056 - nodes in this community are weakly interconnected._
- **Should `sqlalchemy` be split into smaller, more focused modules?**
  _Cohesion score 0.04834520318391286 - nodes in this community are weakly interconnected._