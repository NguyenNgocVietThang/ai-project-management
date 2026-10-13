# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-13)

## Corpus Check
- 608 files · ~375,690 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 5423 nodes · 18244 edges · 227 communities (170 shown, 57 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1669 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11c9b01a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- make_user
- Button
- sqlalchemy
- test_requirement_clarify_job.py
- ProjectOverviewCharts.tsx
- versions/types.ts
- api
- security.py
- email.py
- job_runner.py
- test_change_request_service.py
- report_service.py
- test_xlsx_renderer.py
- cn
- test_bpmn_schema.py
- AIRequest
- test_requirement_brief_schema.py
- endpoints/ai.py
- test_ws_hardening.py
- require_permissions
- test_cloud_adapters.py
- swimlaneLayout.ts
- test_approval_decisions.py
- useNotifications.ts
- process_png.py
- ConnectionManager
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- getApiErrorMessage
- schemas/requirement_brief.py
- WBSService
- vitest
- test_authz_matrix.py
- ProjectService
- Chi tiết các Giai đoạn đã hoàn thành
- list_projects
- typing
- diff_snapshots
- change_requests.py
- useTasks.ts
- requirement_briefs.py
- scheduling_tasks.py
- StorageService
- test_cpm_scheduling.py
- projects/page.tsx
- useCPM.test.tsx
- ThemeProvider.tsx
- (dashboard)/layout.tsx
- api.ts
- ai_tasks.py
- portfolios/[id]/page.tsx
- test_user_profile_settings.py
- Settings
- AIResponseError
- document_writer.py
- package.json
- run_impact_analysis
- system.py
- Project
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- worklogs.py
- test_process_png.py
- Hiệu năng
- wbs/page.tsx
- generate_process_model
- admin.py
- AdminUserService
- requirement_clarifier.py
- DocumentTemplate
- tasks.py
- Button.tsx
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- security_state_service.py
- AGENTS.md
- AuditLog
- _SheetWriter
- test_resource_recommender.py
- xlsx_renderer.py
- @tanstack/react-query
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- ProjectRepository
- test_project_from_brief_job.py
- leaves.py
- task_service.py
- test_docx_renderer.py
- test_document_generation_job.py
- oauth_service.py
- user_service.py
- Thiết kế các luồng Phase 4
- TaskStatus
- test_security_state.py
- RoleService
- Tài liệu yêu cầu nghiệp vụ (BRD)
- DashboardService
- devDependencies
- next.config.js
- main
- test_auth_email_verification.py
- durable_jobs.py
- project_versions.py
- list_portfolios
- requirementBrief.types.ts
- middleware.ts
- post
- Rà soát code và nâng cấp giao diện — 2026-09-15
- useDocuments.ts
- layout.ts
- playwright
- approve_step
- schedule_jobs
- env.py
- Kế hoạch: Render Free + Supabase Free
- test_portfolio_project_core.py
- oauth.py
- make_project
- RequirementBrief
- my_assignments
- Đặc tả yêu cầu phần mềm (SRS)
- Email and private storage adapters
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- Rà soát cuối: Render Free + Supabase Free
- document_service.py
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
- project_service.py
- skills.py
- RequirementItems
- .get_user_summary
- reports/__init__.py
- test_project_scoping.py
- update_subtask
- AdminUserCreate
- ProcessModel
- RequirementClarifier.tsx
- PortfolioService
- WBSServiceDep
- README.md
- request_xlsx_report
- test_private_storage_access.py
- AIService
- pytest
- list_permissions
- docx_renderer.py
- as_user
- approvals.ts
- test_migration_matches_model_and_downgrades
- list_briefs
- get_resource_service
- get_role_service
- FakeStorage
- test_xlsx_report_job.py
- test_recent_activity_filters_by_visible_projects
- UI Guidelines (design system noi bo)
- Frontend durable jobs verification
- Tiến độ — tasks/plan.md
- resource-recommendation.service.ts
- NotificationService
- ChatService
- rate_limit.py
- wbs.py
- Prompt điều phối subagent — Phase 4
- process/types.ts
- Rà soát 2026-09-06
- fixture
- Job
- health_check
- 10. Đặc tả API và các điểm cuối WebSocket
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- list_jobs
- User
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

## Communities (227 total, 57 thin omitted)

### Community 0 - "make_user"
Cohesion: 0.07
Nodes (47): AppBackground(), currentMode(), hasTextSelection(), AMBER, colorsFor(), createFireworks(), acquire(), baseSpeed() (+39 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (93): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, metadata (+85 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.08
Nodes (17): get_client_ip(), Assignment, Base, ChatMessage, ChatReadState, Comment, DocumentType, EmailLog (+9 more)

### Community 3 - "test_requirement_clarify_job.py"
Cohesion: 0.13
Nodes (32): AIOutput, AIRequestStatus, mirror_ai_status(), enqueue_clarify_turn(), test_generation_is_atomic_and_replay_does_not_duplicate(), _create(), _job_count(), _reload() (+24 more)

### Community 4 - "ProjectOverviewCharts.tsx"
Cohesion: 0.07
Nodes (52): BurndownChart(), BurndownChartLabels, BurndownChartProps, DEFAULT_LABELS, formatDate(), ANIMATION_DURATION, animationProps(), axisProps (+44 more)

### Community 5 - "versions/types.ts"
Cohesion: 0.09
Nodes (27): diff, emptyGroup, messages, mocks, setup(), version(), zero, RollbackDialogProps (+19 more)

### Community 6 - "api"
Cohesion: 0.09
Nodes (21): api, ChangeRequestCreateInput, changeRequestService, RiskAnalysisJobResponse, RiskAnalysisJobStatus, RiskAnalysisResultResponse, riskReportService, scheduleOptimizationService (+13 more)

### Community 7 - "security.py"
Cohesion: 0.10
Nodes (20): get_current_user_media(), _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works() (+12 more)

### Community 8 - "email.py"
Cohesion: 0.11
Nodes (11): EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_email_verification_task(), send_password_reset_email_task(), send_project_invitation_email_task() (+3 more)

### Community 9 - "job_runner.py"
Cohesion: 0.07
Nodes (27): JobError, JobResult, PermanentJobError, RetryableJobError, lifespan(), reserve_ai_call(), catchup_loop(), enqueue_due_schedules() (+19 more)

### Community 10 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (29): UnprocessableException, ChangeRequestCreate, ChangeRequestService, get_change_request_service(), _add_member(), _draft_cr(), fake_db(), _load_approval_migration() (+21 more)

### Community 11 - "report_service.py"
Cohesion: 0.14
Nodes (11): run_report(), build_report_data(), compute_eva(), get_report_job(), read_report_file(), report_filename(), _require_reader(), run_report_job() (+3 more)

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.24
Nodes (15): burndown_header_row(), ProjectInfo, TaskRow, _full_data(), _load(), _row(), test_danh_sach_rong_van_co_tieu_de_va_dong_khong_co_du_lieu(), test_ky_tu_dieu_khien_bi_loai_bo() (+7 more)

### Community 13 - "cn"
Cohesion: 0.06
Nodes (84): Hiện trạng theo tính năng, ChangeRequestsPage(), FilterSelect(), KanbanColumn(), PRIORITY_TONE, SprintView(), STATUS_TONE, STATUSES (+76 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.12
Nodes (31): parse_process_model(), _error_text(), test_blank_label_normalized_to_none(), test_blank_name_rejected(), test_closed_cycle_without_exit_rejected(), test_dead_end_node_rejected(), test_duplicate_ids_rejected(), test_end_with_outgoing_flow_rejected() (+23 more)

### Community 15 - "AIRequest"
Cohesion: 0.12
Nodes (20): AIRequest, ProcessModelRecord, insufficient_items(), get_latest_process(), get_latest_process_model(), _pending_request(), ProcessRequestOutcome, request_process_model() (+12 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.14
Nodes (26): apply_item_updates(), empty_items(), RequirementBriefUpdateError, validate_items(), test_ai_cannot_reopen_user_clear_item_as_missing(), test_ai_cannot_set_assumed_or_skipped(), test_ai_clear_item_can_be_refined_by_ai_and_overridden_by_user(), test_ai_clear_update_is_applied_without_mutating_input() (+18 more)

### Community 17 - "endpoints/ai.py"
Cohesion: 0.13
Nodes (15): AIGenerateProjectFromBriefRequest, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis() (+7 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (25): chat_ws(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError, notifications_ws() (+17 more)

### Community 19 - "require_permissions"
Cohesion: 0.14
Nodes (11): create_project(), create_user(), deactivate_user(), get_user(), list_users(), reactivate_user(), search_users(), update_user() (+3 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.14
Nodes (20): client(), email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified(), test_email_transport_timeout_hides_secrets_and_retains_retry_key(), test_minio_compatibility_releases_download_connection(), test_minio_infrastructure_errors_become_sanitized_storage_errors(), test_resend_errors_are_sanitized_and_classified() (+12 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.07
Nodes (43): mocks, record, setup(), clip(), NodeShape(), ProcessDiagram(), model, setup() (+35 more)

### Community 22 - "test_approval_decisions.py"
Cohesion: 0.06
Nodes (43): seed(), Approval, ApprovalStatus, ChangeRequest, CRStatus, Role, ApprovalApproveRequest, ApprovalChainResponse (+35 more)

### Community 23 - "useNotifications.ts"
Cohesion: 0.15
Nodes (22): NotificationsPage(), buttonClasses(), NotificationBell(), ACTION_BUTTON, NotificationItem(), Props, TONE_CLASSES, TYPE_META (+14 more)

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
Cohesion: 0.09
Nodes (41): AdminAuditPage(), AdminIndexPage(), AdminTile, TILES, AdminRolesPage(), AdminUsersPage(), PageHeader(), PageHeaderProps (+33 more)

### Community 30 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (97): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), VerifyEmailSkeleton(), SegmentLoading(), SegmentLoading(), DashboardPage() (+89 more)

### Community 31 - "schemas/requirement_brief.py"
Cohesion: 0.14
Nodes (11): _build_item(), _clean(), ItemUpdateResult, QAEntry, RequirementBriefDetail, RequirementBriefRead, RequirementItem, RequirementItemUpdate (+3 more)

### Community 32 - "WBSService"
Cohesion: 0.10
Nodes (9): _is_still_a_member(), EpicStatus, MilestoneStatus, PhaseStatus, list_documents(), get_project_context(), require_project_roles(), WBSService (+1 more)

### Community 33 - "vitest"
Cohesion: 0.06
Nodes (26): mocks, mocks, setup(), mocks, Form(), empty, jobState, mocks (+18 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (9): project(), test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks() (+1 more)

### Community 35 - "ProjectService"
Cohesion: 0.20
Nodes (3): ProjectMemberResponse, get_project_service(), ProjectService

### Community 36 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.11
Nodes (16): sweep_task_dates_task(), _sweep_with_own_session(), Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking (+8 more)

### Community 37 - "list_projects"
Cohesion: 0.17
Nodes (9): add_project_member(), change_project_member_role(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects(), remove_project_member() (+1 more)

### Community 38 - "typing"
Cohesion: 0.04
Nodes (28): JobResponse, get_current_user(), NotFoundException, publish(), publish_many(), get_db(), Permission, ProcessModelGenerateRequest (+20 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (16): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), _translate(), _snap() (+8 more)

### Community 40 - "change_requests.py"
Cohesion: 0.39
Nodes (4): create_change_request(), get_change_request(), list_change_requests(), submit_change_request()

### Community 41 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 42 - "requirement_briefs.py"
Cohesion: 0.14
Nodes (16): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), patch_item(), reject_assumption(), skip_and_finish() (+8 more)

### Community 43 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 44 - "StorageService"
Cohesion: 0.17
Nodes (5): StorageError, StorageNotFoundError, StorageService, _put(), Supabase Storage setup

### Community 45 - "test_cpm_scheduling.py"
Cohesion: 0.05
Nodes (54): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), run_schedule_optimization(), _validate_and_filter_result(), run_cpm() (+46 more)

### Community 46 - "projects/page.tsx"
Cohesion: 0.16
Nodes (24): ProjectMembersPage(), InitialProjectMember, useAddProjectMember(), useProjectMembers(), useRemoveProjectMember(), projectKeys, useCreateProject(), useProjects() (+16 more)

### Community 47 - "useCPM.test.tsx"
Cohesion: 0.15
Nodes (14): CPM_JOB_KIND, cpmKeys, shouldRetry(), schedule, useCPM(), UseCPMResult, useReloadWhenCPMJobSucceeds(), classifyCPMError() (+6 more)

### Community 48 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (20): inter, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+12 more)

### Community 49 - "(dashboard)/layout.tsx"
Cohesion: 0.09
Nodes (35): Primitive, AuthLayout(), AuthLoadingSkeleton(), STEP_ICONS, AdminLayout(), TABS, DashboardLayout(), FireworksToggle() (+27 more)

### Community 50 - "api.ts"
Cohesion: 0.05
Nodes (60): Danh mục tính năng đã triển khai, 5 Trụ cột chính:, Danh mục tính năng triển khai theo Phase, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun AI tài liệu và hoàn thiện (Phase 5), Tổng quan Module, ProfilePage(), EmailVerificationBannerProps (+52 more)

### Community 51 - "ai_tasks.py"
Cohesion: 0.10
Nodes (20): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task(), _optimize_schedule_with_own_session() (+12 more)

### Community 52 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (29): Metric(), PortfolioDetailPage(), ProgressBar(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioFormProps (+21 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.19
Nodes (17): avatar_bytes(), build_db(), build_service(), build_user(), test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage(), test_change_password_validates_current_password_and_revokes_sessions() (+9 more)

### Community 54 - "Settings"
Cohesion: 0.10
Nodes (15): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+7 more)

### Community 55 - "AIResponseError"
Cohesion: 0.05
Nodes (37): AmbiguousJobError, BaseAIProvider, AITaskType, AIResponseError, _extract_balanced_object(), parse_json_object(), wrap_user_input(), build_system_prompt() (+29 more)

### Community 56 - "document_writer.py"
Cohesion: 0.11
Nodes (20): build_assumption_items(), build_brief_context(), build_process_steps(), build_system_prompt(), build_user_prompt(), render(), _cut(), parse_group_response() (+12 more)

### Community 57 - "package.json"
Cohesion: 0.05
Nodes (37): description, name, overrides, postcss, private, scripts, build, dev (+29 more)

### Community 58 - "run_impact_analysis"
Cohesion: 0.24
Nodes (14): RiskLevel, run_impact_analysis(), _validate_ai_output(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+6 more)

### Community 59 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 60 - "Project"
Cohesion: 0.05
Nodes (35): Dependency, LeaveStatus, LeaveType, Project, Task, Worklog, TaskRepository, CPMResponse (+27 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.14
Nodes (14): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+6 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.06
Nodes (37): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+29 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (25): 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 3. Ngăn xếp công nghệ, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+17 more)

### Community 64 - "worklogs.py"
Cohesion: 0.12
Nodes (18): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog() (+10 more)

### Community 65 - "test_process_png.py"
Cohesion: 0.22
Nodes (10): prepare_process_section(), ProcessRenderError, render_process_png(), build_model(), open_png(), test_internal_failure_raises_process_render_error(), test_large_process_is_scaled_down_within_limits(), test_render_without_vietnamese_font_falls_back() (+2 more)

### Community 66 - "Hiệu năng"
Cohesion: 0.33
Nodes (3): Hiệu năng, FakeSocket, flush()

### Community 67 - "wbs/page.tsx"
Cohesion: 0.13
Nodes (28): BlockTitle(), DeletePhaseDialog(), Editor, Empty(), EntityEditor(), Field(), IconButton(), statusOptions() (+20 more)

### Community 69 - "admin.py"
Cohesion: 0.13
Nodes (10): create_role(), delete_role(), get_role(), list_roles(), update_role(), AuditActorSummary, AuditLogResponse, PermissionResponse (+2 more)

### Community 70 - "AdminUserService"
Cohesion: 0.26
Nodes (18): AdminUserUpdate, AdminUserService, build_db(), build_user(), test_create_user_blocks_non_admin_assigning_roles(), test_create_user_duplicate_email_conflicts(), test_create_user_success(), test_deactivate_user_blocks_last_active_admin() (+10 more)

### Community 71 - "requirement_clarifier.py"
Cohesion: 0.10
Nodes (14): build_brief_snapshot(), build_clarify_prompt(), render(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), _quota_exhausted() (+6 more)

### Community 72 - "DocumentTemplate"
Cohesion: 0.10
Nodes (6): _brief_item_usable(), Column, DocumentTemplate, missing_brief_items(), Section, test_missing_brief_items_counts_only_clear_and_assumed()

### Community 73 - "tasks.py"
Cohesion: 0.16
Nodes (10): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+2 more)

### Community 74 - "Button.tsx"
Cohesion: 0.16
Nodes (15): OAuthCallbackContent(), OAuthCallbackPage(), OAuthPendingState(), DashboardError(), ChangeRequestDetailPage(), GlobalError(), NotFound(), ButtonLink() (+7 more)

### Community 75 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 76 - "security_state_service.py"
Cohesion: 0.21
Nodes (21): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+13 more)

### Community 78 - "AuditLog"
Cohesion: 0.12
Nodes (12): get_current_project_id(), set_current_project_id(), AuditLog, test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_project_id_default_reads_the_request_context(), test_select_over_audit_logs_still_compiles(), _index_names() (+4 more)

### Community 79 - "_SheetWriter"
Cohesion: 0.13
Nodes (3): _labels(), sheet_names(), _SheetWriter

### Community 80 - "test_resource_recommender.py"
Cohesion: 0.20
Nodes (13): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), run_resource_recommendation(), _candidate(), _task(), test_fit_score_outside_range_is_clamped() (+5 more)

### Community 81 - "xlsx_renderer.py"
Cohesion: 0.18
Nodes (7): _coerce_date(), ProjectReportData, render_project_xlsx(), _write_change_requests_sheet(), _write_critical_path_sheet(), _write_eva_sheet(), _write_tasks_sheet()

### Community 82 - "@tanstack/react-query"
Cohesion: 0.13
Nodes (30): aiJobKeys, useAIJob(), useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow(), JobsPanel() (+22 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 85 - "test_project_from_brief_job.py"
Cohesion: 0.24
Nodes (12): FakeProvider, job_for(), make_brief(), make_runner(), test_brief_not_ready_or_foreign_is_rejected(), test_endpoint_contract(), test_quota_exhausted_returns_429(), test_ready_brief_generates_one_project_and_consumes_brief() (+4 more)

### Community 86 - "leaves.py"
Cohesion: 0.15
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 87 - "task_service.py"
Cohesion: 0.09
Nodes (29): BadRequestException, DependencyType, TaskPriority, AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate, DependencyResponse (+21 more)

### Community 88 - "test_docx_renderer.py"
Cohesion: 0.22
Nodes (18): _headings(), _open(), _png_bytes(), _render(), _rows(), _table_after_heading(), test_assumptions_section_lists_assumed_and_skipped_from_brief_only(), test_docx_opens_with_title_toc_and_heading_levels() (+10 more)

### Community 89 - "test_document_generation_job.py"
Cohesion: 0.13
Nodes (22): plan_section_groups(), blocking_missing_items(), find_project_brief(), _job_active(), request_document(), get_template(), _add_process(), drain() (+14 more)

### Community 90 - "oauth_service.py"
Cohesion: 0.09
Nodes (8): UnauthorizedException, code_challenge_for(), new_code_verifier(), UserRepository, TokenResponse, get_oauth_service(), OAuthService, OAuthState

### Community 91 - "user_service.py"
Cohesion: 0.07
Nodes (24): change_password(), connect_social_account(), deactivate_account(), disconnect_social_account(), get_avatar(), update_me(), ServiceUnavailableException, AdminUserResponse (+16 more)

### Community 92 - "Thiết kế các luồng Phase 4"
Cohesion: 0.25
Nodes (8): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Hỏi làm rõ yêu cầu, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 93 - "TaskStatus"
Cohesion: 0.09
Nodes (27): NotificationType, TaskStatus, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, _apply_status_side_effects(), sweep_task_dates() (+19 more)

### Community 94 - "test_security_state.py"
Cohesion: 0.04
Nodes (49): clear(), _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), issue(), _key(), redeem() (+41 more)

### Community 95 - "RoleService"
Cohesion: 0.30
Nodes (12): RoleCreate, RoleUpdate, RoleService, build_actor(), build_db(), build_role(), test_create_role_rejects_duplicate_name(), test_delete_role_blocks_deleting_admin_role() (+4 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "DashboardService"
Cohesion: 0.21
Nodes (13): BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioProjectHealth, ProjectDashboardStats, ProjectStats, RecentActivityItem (+5 more)

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

### Community 103 - "durable_jobs.py"
Cohesion: 0.10
Nodes (18): ImpactReport, RiskReport, ImpactReportResponse, RiskReportResponse, authorize_request(), run_ai(), apply(), model_routing_table() (+10 more)

### Community 104 - "project_versions.py"
Cohesion: 0.17
Nodes (12): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+4 more)

### Community 105 - "list_portfolios"
Cohesion: 0.17
Nodes (5): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), update_portfolio()

### Community 106 - "requirementBrief.types.ts"
Cohesion: 0.16
Nodes (14): requirementBriefService, BriefItemSource, BriefItemStatus, BriefStatus, ItemCounts, ItemUpdate, PendingTurn, QaTurn (+6 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "post"
Cohesion: 0.24
Nodes (9): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint(), SprintStatus (+1 more)

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
Cohesion: 0.33
Nodes (3): approve_step(), list_approvals(), reject_step()

### Community 115 - "env.py"
Cohesion: 0.08
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, set_request_id() (+4 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (12): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade(), test_portfolio_update_checks_dates_against_existing_values() (+4 more)

### Community 118 - "oauth.py"
Cohesion: 0.22
Nodes (8): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start(), state_cookie_kwargs(), state_cookie_path()

### Community 119 - "make_project"
Cohesion: 0.34
Nodes (11): FakeStorage, make_project(), base(), _ready_document(), test_document_of_other_project_is_404(), test_download_ready_document_and_headers(), test_generate_needs_clarification_returns_200(), test_generate_returns_202_with_job_and_list_shows_progress() (+3 more)

### Community 120 - "RequirementBrief"
Cohesion: 0.21
Nodes (17): RequirementBrief, PendingTurn, find_project_brief(), accept_assumption(), answer(), _apply_user_updates(), create_brief(), finalize() (+9 more)

### Community 121 - "my_assignments"
Cohesion: 0.20
Nodes (3): create_assignment(), delete_assignment(), my_assignments()

### Community 122 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (13): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+5 more)

### Community 123 - "Email and private storage adapters"
Cohesion: 0.50
Nodes (3): Email and private storage adapters, Existing file flow and scope, Local verification

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "run_risk_analysis"
Cohesion: 0.18
Nodes (16): RiskLevel, _as_list(), _clamp_score(), _level_from_score(), _normalize_level(), run_risk_analysis(), runner(), fake_db() (+8 more)

### Community 128 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 129 - "document_service.py"
Cohesion: 0.10
Nodes (24): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), _to_response() (+16 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 139 - "AuthService"
Cohesion: 0.08
Nodes (21): hash_password(), validate_password_policy(), verify_password(), RegisterRequest, ResetPasswordRequest, AuthService, get_auth_service(), test_registration_outbox_rollback_and_no_precommit_delivery() (+13 more)

### Community 145 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.12
Nodes (16): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hiện trạng đã xác minh, Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở) (+8 more)

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
Cohesion: 0.15
Nodes (10): AuditService, build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page(), Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004) (+2 more)

### Community 151 - "useXlsxExport.ts"
Cohesion: 0.28
Nodes (12): reportErrorCode(), useXlsxExport(), XlsxExportState, readStoredJobId(), reportService, storageKey(), writeStoredJobId(), KNOWN_REPORT_ERRORS (+4 more)

### Community 152 - "create_dependency"
Cohesion: 0.29
Nodes (3): create_dependency(), delete_dependency(), list_dependencies()

### Community 153 - "dashboards.py"
Cohesion: 0.23
Nodes (4): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), PortfolioHealthResponse

### Community 154 - "project_service.py"
Cohesion: 0.14
Nodes (16): ProjectMethodology, ProjectStatus, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate, ProjectDetailResponse (+8 more)

### Community 155 - "skills.py"
Cohesion: 0.15
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 158 - "reports/__init__.py"
Cohesion: 0.20
Nodes (4): ChangeRequestRow, CriticalPathData, ReportApprovalStep, test_chong_formula_injection()

### Community 159 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (7): test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing(), two_projects()

### Community 162 - "ProcessModel"
Cohesion: 0.10
Nodes (16): _adjacency(), lint_process_model(), process_steps_table(), ProcessFlow, ProcessLane, ProcessModel, ProcessNode, _reach() (+8 more)

### Community 163 - "RequirementClarifier.tsx"
Cohesion: 0.10
Nodes (42): apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_TONE, apiDetail(), formatDateTime(), KNOWN_ERRORS (+34 more)

### Community 164 - "PortfolioService"
Cohesion: 0.15
Nodes (9): PortfolioStatus, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate (+1 more)

### Community 165 - "WBSServiceDep"
Cohesion: 0.29
Nodes (5): complete_milestone(), create_milestone(), get_milestone(), list_milestones(), update_milestone()

### Community 166 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 167 - "request_xlsx_report"
Cohesion: 0.22
Nodes (4): download_xlsx_report(), request_xlsx_report(), XlsxReportAccepted, XlsxReportRequest

### Community 168 - "test_private_storage_access.py"
Cohesion: 0.33
Nodes (6): factory(), provider(), test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 169 - "AIService"
Cohesion: 0.13
Nodes (16): AIRequestType, AIJobResponse, AIService, test_ai_and_outbox_rollback_together(), test_completed_ai_output_rechecks_current_project_access(), test_owner_can_resume_jobs_other_owner_cannot(), test_same_request_key_does_not_generate_twice(), ai_request() (+8 more)

### Community 170 - "pytest"
Cohesion: 0.08
Nodes (13): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry(), _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+5 more)

### Community 171 - "list_permissions"
Cohesion: 0.25
Nodes (3): list_permissions(), require_roles(), role_checker()

### Community 172 - "docx_renderer.py"
Cohesion: 0.08
Nodes (26): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _cell_text(), _clean_text(), ContentValidation (+18 more)

### Community 173 - "as_user"
Cohesion: 0.40
Nodes (3): as_user(), factory(), override_db()

### Community 175 - "test_migration_matches_model_and_downgrades"
Cohesion: 0.40
Nodes (3): _load_migration(), test_migration_chains_after_security_state(), test_migration_matches_model_and_downgrades()

### Community 176 - "list_briefs"
Cohesion: 0.17
Nodes (5): list_briefs(), ItemCounts, RequirementBriefSummary, _counts(), to_summary()

### Community 180 - "test_xlsx_report_job.py"
Cohesion: 0.24
Nodes (10): request_xlsx_report(), drain(), http_as(), make_project(), storage(), test_invalid_language_rejected(), test_member_removed_before_run_fails_job(), test_outsider_is_rejected() (+2 more)

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
Cohesion: 0.33
Nodes (5): Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 190 - "NotificationService"
Cohesion: 0.08
Nodes (13): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), MarkReadResponse, NotificationListResponse, NotificationResponse (+5 more)

### Community 191 - "ChatService"
Cohesion: 0.09
Nodes (19): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+11 more)

### Community 192 - "rate_limit.py"
Cohesion: 0.07
Nodes (7): TooManyRequestsException, rate_limit_exceeded_handler(), _retry_after_seconds(), SecurityLimiter, decorator(), wrapper(), resolve_client_ip()

### Community 194 - "wbs.py"
Cohesion: 0.08
Nodes (29): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), create_phase(), delete_phase(), get_phase() (+21 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.17
Nodes (11): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm), V0 — quy tắc rollback mặc định (+3 more)

### Community 200 - "Rà soát 2026-09-06"
Cohesion: 0.18
Nodes (9): 7 Trụ cột chính:, Bảo mật, Còn nợ, Giao diện, Lỗi chặn đã sửa, Lộ trình: Portfolio & Project Core Module (Phase 2), Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0 (+1 more)

### Community 204 - "Job"
Cohesion: 0.07
Nodes (32): JobContext, JobRunner, Job, aware(), enqueue(), JobService, LeaseLostError, safe_error_code() (+24 more)

### Community 208 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 209 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 215 - "list_jobs"
Cohesion: 0.31
Nodes (3): get_job(), list_jobs(), visible_jobs()

### Community 227 - "User"
Cohesion: 0.07
Nodes (16): get_current_active_superuser(), get_current_verified_user(), ConflictException, ForbiddenException, SubtaskStatus, User, ChangeRequestResponse, read_document_file() (+8 more)

### Community 231 - "test_version_rollback.py"
Cohesion: 0.05
Nodes (52): delete_milestone(), Milestone, Phase, ProjectVersion, Sprint, _apply_fields(), build_snapshot(), create_snapshot() (+44 more)

## Knowledge Gaps
- **545 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+540 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1669 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `api.ts` to `WBSService`, `DashboardService`, `Button`, `ProjectService`, `PortfolioService`, `User`, `ProjectOverviewCharts.tsx`, `wbs/page.tsx`, `Rà soát 2026-09-06`, `cn`, `getApiErrorMessage`, `useNotifications.ts`, `portfolios/[id]/page.tsx`, `task_service.py`, `TaskStatus`, `NotificationService`, `ChatService`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `document_service.py`, `sqlalchemy`, `security.py`, `job_runner.py`, `test_change_request_service.py`, `AuthService`, `report_service.py`, `AIRequest`, `endpoints/ai.py`, `test_ws_hardening.py`, `require_permissions`, `test_approval_decisions.py`, `project_service.py`, `.get_user_summary`, `WBSService`, `ProcessModel`, `ProjectService`, `PortfolioService`, `typing`, `AIService`, `pytest`, `list_permissions`, `as_user`, `approvals.ts`, `ai_tasks.py`, `test_xlsx_report_job.py`, `Project`, `ChatService`, `wbs.py`, `AdminUserService`, `ProjectRepository`, `task_service.py`, `test_document_generation_job.py`, `oauth_service.py`, `user_service.py`, `test_security_state.py`, `RoleService`, `DashboardService`, `test_auth_email_verification.py`, `durable_jobs.py`, `test_version_rollback.py`, `list_portfolios`, `env.py`, `RequirementBrief`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `DashboardService` to `sqlalchemy`, `User`, `Chi tiết các Giai đoạn đã hoàn thành`, `typing`, `Rà soát 2026-09-06`, `report_service.py`, `AuditLog`, `test_dashboard_metrics.py`, `api.ts`, `.__init__`, `test_xlsx_report_job.py`, `test_recent_activity_filters_by_visible_projects`, `.get_user_summary`, `dashboards.py`, `project_service.py`, `Project`, `TaskStatus`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _545 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `make_user` be split into smaller, more focused modules?**
  _Cohesion score 0.07184325108853411 - nodes in this community are weakly interconnected._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05152057245080501 - nodes in this community are weakly interconnected._