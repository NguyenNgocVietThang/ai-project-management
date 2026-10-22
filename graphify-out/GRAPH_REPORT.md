# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-22)

## Corpus Check
- 680 files · ~642,692 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 12, .puml 10, .example 3)

## Summary
- 5784 nodes · 19410 edges · 225 communities (167 shown, 58 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `42f5d319`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createFireworks
- Button
- Project
- test_requirement_clarify_job.py
- documents.py
- useTasks.ts
- test_auth_cookies.py
- projects/page.tsx
- email.py
- ProcessModel
- test_project_versions.py
- cn
- report_service.py
- lucide-react
- test_bpmn_schema.py
- vitest
- AdminUserService
- endpoints/ai.py
- test_ws_hardening.py
- require_permissions
- StorageService
- swimlaneLayout.ts
- create_change_request
- _run_ai_job
- process_png.py
- test_investor_portal.py
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- env.py
- worklogs.py
- tasks/page.tsx
- (dashboard)/portfolios/[id]/page.tsx
- auth_service.py
- sqlalchemy_ext_asyncio
- User
- list_projects
- next-intl
- diff_snapshots
- InvestorService
- chat_service.py
- validate_content
- main.py
- StorageError
- providers.tsx
- sprints.py
- sqlalchemy
- test_project_from_brief_job.py
- NotificationService
- list_notifications
- versions/types.ts
- Rà soát cuối: Render Free + Supabase Free
- request_xlsx_report
- AIService
- wbs.py
- storage_service.py
- TaskStatus
- test_impact_analyzer.py
- system.py
- test_portfolio_project_core.py
- Thiết kế kiến trúc hệ thống
- post
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- useDocuments.ts
- test_auth_password_recovery.py
- approvals.py
- AIResponseError
- TaskService
- ChangeRequestDetail.tsx
- browser-qa.cjs
- phases.py
- UserRepository
- test_process_png.py
- requirementBrief.types.ts
- ProjectOverviewCharts.tsx
- security_state_service.py
- AGENTS.md
- test_auth_email_verification.py
- RequirementBrief
- test_resource_recommender.py
- tasks.py
- @tanstack/react-query
- ApprovalTimeline.test.tsx
- test_user_profile_settings.py
- DocumentRenderError
- leaves.py
- ClarifyItem
- investor.types.ts
- document_service.py
- test_oauth_account_takeover.py
- get_chat_history
- Design system cho AI Project Planning và Portfolio Management
- api.ts
- scheduling_tasks.py
- test_cpm_scheduling.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- dashboard_service.py
- devDependencies
- next.config.js
- NotificationType
- list_investor_portfolios
- list_permissions
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- project_versions.py
- AITaskType
- middleware.ts
- Durable jobs verification
- Rà soát code và nâng cấp giao diện — 2026-09-15
- test_docx_renderer.py
- useCPM.test.tsx
- playwright
- ConnectionManager
- package.json
- fireworks.ts
- Kế hoạch: Render Free + Supabase Free
- BadRequestException
- test_security_state.py
- date_utils.py
- Settings
- test_route_trailing_slash.py
- typing
- unittest_mock
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- useWBS.ts
- test_project_expected_benefit.py
- get_critical_path
- Chi tiết kế hoạch triển khai
- test_evm.py
- .limit
- Kế hoạch lưu trữ: Phase 4 — Workflow & Reporting (đã triển khai mã nguồn)
- 11. Cài đặt và Chạy hệ thống
- Local browser QA — 2026-10-20
- AuditLog
- Rà soát nguồn các trang còn lại — 20/10/2026
- DocumentTemplate
- DocumentType
- get_dashboard_summary
- EmailStatus
- skills.py
- schemas/process_model.py
- project_task_counts
- types
- Rà soát 2026-09-06
- AppBackground.tsx
- factory
- Lộ trình: Auth & User Onboarding Module (Phase 1)
- portfolio_service.py
- _no_ws_publish
- README.md
- test_dashboard_metrics.py
- Lộ trình: Mô-đun tính năng AI (Phase 3)
- test_ai_service.py
- docx_renderer.py
- test_authz_matrix.py
- ResourceService
- Thiết kế lại giao diện dễ sử dụng — Implementation Plan
- endpoints/dependencies.py
- Thiết kế các luồng Phase 4
- test_resource_warnings.py
- Tiến độ — tasks/plan.md
- react
- parse_process_model
- list_jobs
- validate_password_policy
- sweep_task_dates_task
- Prompt điều phối subagent — Phase 4
- 3. Ngăn xếp công nghệ
- impact_analyzer.py
- list_audit_logs
- Job
- create_refresh_token
- Frontend durable jobs verification
- resource_leveling
- Kiểm tra giao diện triển khai — 20/10/2026
- next
- acquire
- 6 Token và hợp đồng component
- Task

## God Nodes (most connected - your core abstractions)
1. `User` - 310 edges
2. `Button` - 139 edges
3. `cn()` - 125 edges
4. `Project` - 113 edges
5. `Task` - 108 edges
6. `ForbiddenException` - 105 edges
7. `react` - 105 edges
8. `NotFoundException` - 102 edges
9. `Job` - 101 edges
10. `Base` - 93 edges

## Surprising Connections (you probably didn't know these)
- `Implemented contract` --references--> `JobRunner`  [INFERRED]
  docs/job-core-verification.md → backend/app/core/job_runner.py
- `Hiện trạng tại thời điểm lập kế hoạch (2026-10-12; bối cảnh lịch sử)` --references--> `AIRequest`  [INFERRED]
  tasks/phase4/plan.md → backend/app/models/ai_request.py
- `3. Mô hình dữ liệu` --references--> `Base`  [INFERRED]
  docs/superpowers/specs/2026-10-16-investor-dashboard-design.md → backend/app/models/base.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `6.3 Thay đổi schema Project` --references--> `ProjectSummaryResponse`  [INFERRED]
  docs/superpowers/specs/2026-10-16-investor-dashboard-design.md → backend/app/schemas/project.py

## Import Cycles
- None detected.

## Communities (225 total, 58 thin omitted)

### Community 0 - "createFireworks"
Cohesion: 0.23
Nodes (20): colorsFor(), createFireworks(), baseSpeed(), burst(), crackleBurst(), destroy(), draw(), explode() (+12 more)

### Community 1 - "Button"
Cohesion: 0.04
Nodes (112): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), Hiện trạng theo tính năng, Hỏi làm rõ yêu cầu, 3.9 Tích hợp AI (SRS-AI), Task 7: Quản lý investor trên trang portfolio và trường lợi ích kỳ vọng trong form dự án, ForgotPasswordPage(), metadata (+104 more)

### Community 2 - "Project"
Cohesion: 0.04
Nodes (72): ConflictException, UnprocessableException, Approval, ApprovalStatus, ChangeRequest, CRStatus, Project, ApprovalChainResponse (+64 more)

### Community 3 - "test_requirement_clarify_job.py"
Cohesion: 0.15
Nodes (28): enqueue_clarify_turn(), _create(), _job_count(), _reload(), _run_turn(), test_answer_while_turn_running_is_rejected_without_second_job(), test_answer_without_open_question_conflicts(), test_create_with_quota_exhausted_leaves_no_brief() (+20 more)

### Community 4 - "documents.py"
Cohesion: 0.21
Nodes (12): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), _to_response() (+4 more)

### Community 5 - "useTasks.ts"
Cohesion: 0.15
Nodes (23): Props, taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, taskService, UserSummary, Assignment (+15 more)

### Community 6 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (16): _base(), clear_session_cookies(), _media_path(), read_refresh_token(), _refresh_path(), set_session_cookies(), _cookies(), test_clearing_removes_every_session_cookie() (+8 more)

### Community 7 - "projects/page.tsx"
Cohesion: 0.12
Nodes (31): ProjectMembersPage(), InviteMemberDialog(), InitialProjectMember, useAddProjectMember(), useAssignableRoles(), useRemoveProjectMember(), useUserSearch(), projectKeys (+23 more)

### Community 8 - "email.py"
Cohesion: 0.10
Nodes (15): EmailDeliveryError, _mail_config(), _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), send_email_verification_task(), send_password_reset_email_task() (+7 more)

### Community 9 - "ProcessModel"
Cohesion: 0.12
Nodes (15): _adjacency(), lint_process_model(), process_steps_table(), ProcessFlow, ProcessLane, ProcessModel, ProcessNode, _reach() (+7 more)

### Community 10 - "test_project_versions.py"
Cohesion: 0.05
Nodes (51): ProjectVersion, _apply_fields(), build_snapshot(), create_snapshot(), _enforce_cap(), _from_json(), get_versioning_service(), _lock_project() (+43 more)

### Community 11 - "cn"
Cohesion: 0.07
Nodes (66): Task 6: Trang cổng investor và các component hiển thị, 10. Kiểm thử, InvestorHomePage(), ChangeRequestsPage(), SprintView(), TaskCard(), ProjectsPage(), MiniProgressBar() (+58 more)

### Community 12 - "report_service.py"
Cohesion: 0.05
Nodes (40): build_report_data(), compute_eva(), get_report_job(), read_report_file(), report_filename(), _require_reader(), run_report_job(), burndown_header_row() (+32 more)

### Community 13 - "lucide-react"
Cohesion: 0.06
Nodes (88): AdminAuditPage(), InvestorPortfolioPage(), ProfilePage(), ProfilePageContent(), AIInsightsPage(), ProjectChatPage(), apiDetail(), DocumentsPage() (+80 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.15
Nodes (25): _error_text(), test_blank_label_normalized_to_none(), test_blank_name_rejected(), test_closed_cycle_without_exit_rejected(), test_dead_end_node_rejected(), test_duplicate_ids_rejected(), test_end_with_outgoing_flow_rejected(), test_flow_from_unknown_node_rejected() (+17 more)

### Community 15 - "vitest"
Cohesion: 0.05
Nodes (47): mocks, mocks, mocks, setup(), mocks, phases, capabilities, detail (+39 more)

### Community 16 - "AdminUserService"
Cohesion: 0.06
Nodes (46): create_role(), delete_role(), get_role(), list_roles(), update_role(), AdminUserCreate, AdminUserUpdate, RoleCreate (+38 more)

### Community 17 - "endpoints/ai.py"
Cohesion: 0.14
Nodes (15): AIGenerateProjectFromBriefRequest, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), request_impact_analysis(), request_resource_recommendation(), request_risk_analysis() (+7 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.06
Nodes (27): chat_ws(), _is_still_a_member(), _MessageBudget, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), _redeem(), WSAuthError (+19 more)

### Community 19 - "require_permissions"
Cohesion: 0.11
Nodes (15): change_password(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar(), get_user(), list_users() (+7 more)

### Community 20 - "StorageService"
Cohesion: 0.13
Nodes (24): StorageService, client(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle(), email_settings(), storage_settings(), test_email_idempotency_conflict_is_classified() (+16 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.07
Nodes (42): mocks, record, setup(), clip(), NodeShape(), ProcessDiagram(), model, setup() (+34 more)

### Community 22 - "create_change_request"
Cohesion: 0.36
Nodes (4): create_change_request(), get_change_request(), list_change_requests(), submit_change_request()

### Community 23 - "_run_ai_job"
Cohesion: 0.10
Nodes (18): ImpactReportResponse, impact_analysis_task(), _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task(), _optimize_schedule_with_own_session(), runner() (+10 more)

### Community 24 - "process_png.py"
Cohesion: 0.10
Nodes (13): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+5 more)

### Community 25 - "test_investor_portal.py"
Cohesion: 0.11
Nodes (28): Permission, PortfolioInvestor, investor_setup(), overview_url(), test_chi_tiet_du_an_khong_lo_du_lieu_ca_nhan(), test_danh_sach_chi_gom_portfolio_duoc_cap(), test_dong_cap_quyen_khong_con_role_investor_khong_hien_trong_danh_sach(), test_du_an_huy_qua_han_khong_tinh_la_tre_han() (+20 more)

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
Nodes (40): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+32 more)

### Community 30 - "env.py"
Cohesion: 0.19
Nodes (5): do_run_migrations(), run_async_migrations(), run_migrations_online(), main(), seed()

### Community 31 - "worklogs.py"
Cohesion: 0.19
Nodes (8): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), start_timer(), stop_timer(), update_worklog()

### Community 32 - "tasks/page.tsx"
Cohesion: 0.06
Nodes (62): Field(), KanbanColumn(), PRIORITY_TONE, STATUS_TONE, STATUSES, TaskCreateModal(), TasksPage(), TasksSkeleton() (+54 more)

### Community 33 - "(dashboard)/portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (29): AdminIndexPage(), AdminTile, TILES, Metric(), PortfolioDetailPage(), ProgressBar(), PortfoliosPage(), PageHeader() (+21 more)

### Community 34 - "auth_service.py"
Cohesion: 0.07
Nodes (15): _identity_key(), _lock_seconds(), record_failure(), seconds_until_unlocked(), hash_password(), AuthService, get_auth_service(), FakeRedis (+7 more)

### Community 35 - "sqlalchemy_ext_asyncio"
Cohesion: 0.05
Nodes (11): Portfolio, Role, BaseRepository, ProjectRepository, as_user(), _disable_rate_limiting(), engine(), make_user() (+3 more)

### Community 36 - "User"
Cohesion: 0.07
Nodes (18): get_current_active_superuser(), ForbiddenException, NotFoundException, EpicStatus, MilestoneStatus, PhaseStatus, User, AIJobResponse (+10 more)

### Community 37 - "list_projects"
Cohesion: 0.16
Nodes (9): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+1 more)

### Community 38 - "next-intl"
Cohesion: 0.06
Nodes (67): AuthLayout(), AuthLoadingSkeleton(), STEP_ICONS, OAuthCallbackContent(), OAuthCallbackPage(), OAuthPendingState(), ResetPasswordContent(), ResetPasswordPage() (+59 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (16): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), _translate(), _snap() (+8 more)

### Community 40 - "InvestorService"
Cohesion: 0.16
Nodes (11): InvestorGrantCreate, InvestorGrantResponse, InvestorPortfolioItem, InvestorPortfolioOverview, InvestorProjectDetail, InvestorProjectRow, MetricsResponse, PortfolioBrief (+3 more)

### Community 41 - "chat_service.py"
Cohesion: 0.11
Nodes (19): publish(), publish_many(), ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, ChatService, get_chat_service() (+11 more)

### Community 42 - "validate_content"
Cohesion: 0.22
Nodes (10): _cell_text(), _clean_text(), missing_required_sections(), _normalize_assumptions(), _normalize_bullets(), _normalize_paragraph(), _normalize_steps(), _normalize_table() (+2 more)

### Community 43 - "main.py"
Cohesion: 0.05
Nodes (17): configure_logging(), get_request_id(), JsonFormatter, RequestIdFilter, set_request_id(), client_key(), rate_limit_exceeded_handler(), _retry_after_seconds() (+9 more)

### Community 44 - "StorageError"
Cohesion: 0.15
Nodes (6): StorageError, StorageNotFoundError, _put(), FakeStorage, storage(), Supabase Storage setup

### Community 45 - "providers.tsx"
Cohesion: 0.15
Nodes (18): inter, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+10 more)

### Community 46 - "sprints.py"
Cohesion: 0.18
Nodes (11): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), start_sprint(), update_sprint(), SprintStatus (+3 more)

### Community 47 - "sqlalchemy"
Cohesion: 0.08
Nodes (23): Assignment, Base, ChatMessage, ChatReadState, Comment, Dependency, DependencyType, EmailLog (+15 more)

### Community 48 - "test_project_from_brief_job.py"
Cohesion: 0.20
Nodes (14): factory(), provider(), FakeProvider, job_for(), make_brief(), make_runner(), test_brief_not_ready_or_foreign_is_rejected(), test_endpoint_contract() (+6 more)

### Community 49 - "NotificationService"
Cohesion: 0.18
Nodes (7): Notification, MarkReadResponse, NotificationListResponse, NotificationResponse, UnreadCountResponse, get_notification_service(), NotificationService

### Community 50 - "list_notifications"
Cohesion: 0.15
Nodes (5): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read()

### Community 51 - "versions/types.ts"
Cohesion: 0.09
Nodes (26): diff, emptyGroup, messages, mocks, setup(), version(), zero, RollbackDialogProps (+18 more)

### Community 52 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 53 - "request_xlsx_report"
Cohesion: 0.22
Nodes (4): download_xlsx_report(), request_xlsx_report(), XlsxReportAccepted, XlsxReportRequest

### Community 54 - "AIService"
Cohesion: 0.05
Nodes (56): TooManyRequestsException, PermanentJobError, AIOutput, AIRequest, AIRequestStatus, AIRequestType, ImpactReport, ProcessModelRecord (+48 more)

### Community 55 - "wbs.py"
Cohesion: 0.09
Nodes (23): create_epic(), delete_epic(), get_epic(), list_epics(), update_epic(), complete_milestone(), create_milestone(), delete_milestone() (+15 more)

### Community 57 - "TaskStatus"
Cohesion: 0.11
Nodes (16): TaskStatus, sweep_task_dates(), _apply_status_side_effects(), sweep_task_dates(), _sweep_with_own_session(), test_sweep_is_noop_when_nothing_matches(), test_sweep_notifies_starting_and_due_soon_tasks_and_stamps_idempotency(), test_status_graph_supports_normal_block_and_reopen_flows() (+8 more)

### Community 58 - "test_impact_analyzer.py"
Cohesion: 0.32
Nodes (12): RiskLevel, change_request(), FakeScalars, make_db(), patched_ai(), project(), task(), test_affected_task_ids_outside_project_are_filtered_out() (+4 more)

### Community 59 - "system.py"
Cohesion: 0.15
Nodes (5): create_system(), delete_system(), get_system(), list_system(), update_system()

### Community 60 - "test_portfolio_project_core.py"
Cohesion: 0.27
Nodes (17): db(), portfolio(), project(), test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_and_project_schema_validation(), test_portfolio_scope_and_soft_delete_cascade() (+9 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.14
Nodes (14): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+6 more)

### Community 62 - "post"
Cohesion: 0.10
Nodes (22): create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), refresh_token(), register() (+14 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.07
Nodes (27): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+19 more)

### Community 64 - "useDocuments.ts"
Cohesion: 0.22
Nodes (15): documentFilename(), documentService, saveBlob(), documentKeys, hasActiveDocument(), api, base, useDownloadDocument() (+7 more)

### Community 65 - "test_auth_password_recovery.py"
Cohesion: 0.23
Nodes (14): ResetPasswordRequest, build_request(), build_service(), extract_token(), test_expired_token_uses_same_error_as_unknown_token(), test_forgot_password_endpoint_always_returns_generic_message(), test_new_request_invalidates_previous_token(), test_outbox_failure_aborts_transaction_without_sensitive_logs() (+6 more)

### Community 66 - "approvals.py"
Cohesion: 0.19
Nodes (6): approve_step(), list_approvals(), reject_step(), ApprovalApproveRequest, ApprovalRejectRequest, ApprovalStepResponse

### Community 67 - "AIResponseError"
Cohesion: 0.04
Nodes (41): build_assumption_items(), build_brief_context(), build_system_prompt(), build_user_prompt(), render(), _cut(), parse_group_response(), _section_spec() (+33 more)

### Community 68 - "TaskService"
Cohesion: 0.07
Nodes (28): TaskPriority, TaskDetailResponse, TaskResponse, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, get_task_service() (+20 more)

### Community 69 - "ChangeRequestDetail.tsx"
Cohesion: 0.12
Nodes (26): ChangeRequestDetailPage(), useBreadcrumbLabel(), ApprovalTimeline(), DOT_CLASS, STATUS_ICON, STATUS_TONE, ChangeRequestDetail(), isImpactReport() (+18 more)

### Community 70 - "browser-qa.cjs"
Cohesion: 0.14
Nodes (15): broadFixtures, capture(), { chromium }, filtered(), { fixture }, fs, geometry(), main() (+7 more)

### Community 71 - "phases.py"
Cohesion: 0.23
Nodes (8): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), update_phase(), PhaseUpdate

### Community 73 - "test_process_png.py"
Cohesion: 0.25
Nodes (9): ProcessRenderError, render_process_png(), build_model(), open_png(), test_internal_failure_raises_process_render_error(), test_large_process_is_scaled_down_within_limits(), test_render_without_vietnamese_font_falls_back(), test_renders_valid_png_with_lanes_gateways_loop_and_long_vietnamese_names() (+1 more)

### Community 74 - "requirementBrief.types.ts"
Cohesion: 0.09
Nodes (21): empty, jobState, mocks, renderModal(), ItemRowProps, BriefItem, BriefItemKey, BriefItemSource (+13 more)

### Community 75 - "ProjectOverviewCharts.tsx"
Cohesion: 0.07
Nodes (53): BurndownChart(), BurndownChartLabels, BurndownChartProps, DEFAULT_LABELS, formatDate(), ANIMATION_DURATION, animationProps(), axisProps (+45 more)

### Community 76 - "security_state_service.py"
Cohesion: 0.27
Nodes (18): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+10 more)

### Community 78 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (13): build_service(), extract_token(), test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure(), create_user(), test_resend_endpoint_requires_authentication() (+5 more)

### Community 79 - "RequirementBrief"
Cohesion: 0.04
Nodes (78): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), list_briefs(), patch_item(), reject_assumption() (+70 more)

### Community 80 - "test_resource_recommender.py"
Cohesion: 0.20
Nodes (13): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), run_resource_recommendation(), _candidate(), _task(), test_fit_score_outside_range_is_clamped() (+5 more)

### Community 81 - "tasks.py"
Cohesion: 0.17
Nodes (9): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+1 more)

### Community 82 - "@tanstack/react-query"
Cohesion: 0.13
Nodes (31): aiJobKeys, useAIJob(), useGenerateProject(), isAccessError(), isTerminalJob(), jobPollingInterval(), pageActive(), PollState (+23 more)

### Community 83 - "ApprovalTimeline.test.tsx"
Cohesion: 0.17
Nodes (12): ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, parseMissingRoles(), readApiError(), mocks (+4 more)

### Community 84 - "test_user_profile_settings.py"
Cohesion: 0.10
Nodes (23): ServiceUnavailableException, UnauthorizedException, verify_password(), OAuthService, OAuthState, UserService, avatar_bytes(), build_db() (+15 more)

### Community 85 - "DocumentRenderError"
Cohesion: 0.33
Nodes (3): DocumentRenderError, _ensure_language(), labels()

### Community 86 - "leaves.py"
Cohesion: 0.15
Nodes (5): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), update_leaves()

### Community 88 - "investor.types.ts"
Cohesion: 0.20
Nodes (12): totals, metrics(), row(), setup(), ExclusionReason, InvestorGrant, InvestorPortfolioItem, InvestorPortfolioOverview (+4 more)

### Community 89 - "document_service.py"
Cohesion: 0.06
Nodes (53): JobError, GeneratedDocument, build_process_steps(), plan_section_groups(), blocking_missing_items(), _enqueue_step(), find_project_brief(), _generate_group() (+45 more)

### Community 90 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (6): _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account(), _victim()

### Community 91 - "get_chat_history"
Cohesion: 0.19
Nodes (4): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message()

### Community 92 - "Design system cho AI Project Planning và Portfolio Management"
Cohesion: 0.15
Nodes (13): 10 Lựa chọn và đánh đổi, 11 Điểm cần hoàn thiện, 12 Quy trình cập nhật, 1 Tóm tắt, 2 Mục tiêu và giới hạn, 3 Bối cảnh và nguyên tắc, 4 Kiến trúc design system, 5 Vòng đời tương tác (+5 more)

### Community 93 - "api.ts"
Cohesion: 0.08
Nodes (26): api, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService (+18 more)

### Community 94 - "scheduling_tasks.py"
Cohesion: 0.21
Nodes (4): _pending_key(), recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 95 - "test_cpm_scheduling.py"
Cohesion: 0.05
Nodes (55): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), run_schedule_optimization(), _validate_and_filter_result(), run_cpm(), apply() (+47 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "dashboard_service.py"
Cohesion: 0.14
Nodes (16): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+8 more)

### Community 98 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "NotificationType"
Cohesion: 0.29
Nodes (4): NotificationType, test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket(), fake_flush()

### Community 101 - "list_investor_portfolios"
Cohesion: 0.33
Nodes (3): get_investor_portfolio(), get_investor_project(), list_investor_portfolios()

### Community 102 - "list_permissions"
Cohesion: 0.25
Nodes (3): list_permissions(), require_roles(), role_checker()

### Community 103 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 104 - "project_versions.py"
Cohesion: 0.17
Nodes (12): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+4 more)

### Community 106 - "AITaskType"
Cohesion: 0.06
Nodes (33): AmbiguousJobError, RetryableJobError, BaseAIProvider, reserve_ai_call(), AITaskType, model_routing_table(), resolve_model(), build_brief_generation_prompt() (+25 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "test_docx_renderer.py"
Cohesion: 0.20
Nodes (19): _headings(), _open(), _png_bytes(), _render(), _rows(), _table_after_heading(), test_assumptions_section_lists_assumed_and_skipped_from_brief_only(), test_docx_opens_with_title_toc_and_heading_levels() (+11 more)

### Community 111 - "useCPM.test.tsx"
Cohesion: 0.06
Nodes (52): mocks, formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small (+44 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "ConnectionManager"
Cohesion: 0.06
Nodes (34): ConnectionManager, fake_ws(), FakeWebSocket, test_broadcast_local_drops_connection_that_fails_to_send(), test_broadcast_local_sends_to_every_connection_on_channel(), test_connect_registers_websocket_on_channel(), test_disconnect_on_unknown_channel_is_a_noop(), test_disconnect_removes_websocket_and_empty_channel() (+26 more)

### Community 114 - "package.json"
Cohesion: 0.05
Nodes (38): description, name, overrides, postcss, private, scripts, build, dev (+30 more)

### Community 115 - "fireworks.ts"
Cohesion: 0.11
Nodes (17): AMBER, FireworksEngine, FireworksMode, FireworksOptions, GOLD, Hue, INTERACTIVE_SELECTOR, LIME (+9 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng tại thời điểm lập kế hoạch (2026-10-08; lưu làm bối cảnh lịch sử), Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "BadRequestException"
Cohesion: 0.08
Nodes (26): update_project(), BadRequestException, ProjectMethodology, ProjectStatus, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+18 more)

### Community 118 - "test_security_state.py"
Cohesion: 0.06
Nodes (41): clear(), issue(), _key(), redeem(), consume(), issue(), _key(), get_redis() (+33 more)

### Community 119 - "date_utils.py"
Cohesion: 0.32
Nodes (3): add_working_days(), date_range(), working_days_between()

### Community 120 - "Settings"
Cohesion: 0.14
Nodes (12): Settings, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once(), test_production_refuses_to_start_with_insecure_settings() (+4 more)

### Community 121 - "test_route_trailing_slash.py"
Cohesion: 0.36
Nodes (3): _is_routed(), test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 122 - "typing"
Cohesion: 0.04
Nodes (33): schedule_jobs(), JobResponse, _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), _start() (+25 more)

### Community 123 - "unittest_mock"
Cohesion: 0.22
Nodes (4): _rate_limiting_on(), test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled(), test_the_throttle_response_tells_the_caller_when_to_retry()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.25
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "run_risk_analysis"
Cohesion: 0.20
Nodes (14): _as_list(), _clamp_score(), _level_from_score(), _normalize_level(), run_risk_analysis(), fake_db(), project(), _scalars_result() (+6 more)

### Community 128 - "useWBS.ts"
Cohesion: 0.18
Nodes (18): Props, phase, setup(), sprint, wbsKeys, wbsService, Epic, EpicInput (+10 more)

### Community 129 - "test_project_expected_benefit.py"
Cohesion: 0.40
Nodes (3): pm_project(), test_loi_ich_ky_vong_am_bi_tu_choi(), test_pm_cap_nhat_va_doc_lai_loi_ich_ky_vong()

### Community 138 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.40
Nodes (5): Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004), GIAI ĐOẠN 3.6 – AI Phân tích rủi ro (SOP-AI-005)

### Community 139 - "test_evm.py"
Cohesion: 0.12
Nodes (26): aggregate_metrics(), _build(), classify_health(), compute_project_metrics(), elapsed_fraction(), Metrics, _money(), _rate() (+18 more)

### Community 145 - ".limit"
Cohesion: 0.20
Nodes (6): SecurityLimiter, decorator(), wrapper(), Chỗ plan làm rõ thêm cho spec, Global Constraints, Investor Dashboard Implementation Plan

### Community 146 - "Kế hoạch lưu trữ: Phase 4 — Workflow & Reporting (đã triển khai mã nguồn)"
Cohesion: 0.12
Nodes (16): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hiện trạng tại thời điểm lập kế hoạch (2026-10-12; bối cảnh lịch sử), Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch lưu trữ: Phase 4 — Workflow & Reporting (đã triển khai mã nguồn) (+8 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. (Không bắt buộc, kế thừa) Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "Local browser QA — 2026-10-20"
Cohesion: 0.40
Nodes (5): Evidence timing, Isolation and checks, Limits, Local browser QA — 2026-10-20, Run

### Community 149 - "AuditLog"
Cohesion: 0.11
Nodes (15): get_current_project_id(), set_current_project_id(), AuditLog, _captured_where_text(), test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_project_id_default_reads_the_request_context(), test_recent_activity_filters_by_visible_projects() (+7 more)

### Community 150 - "Rà soát nguồn các trang còn lại — 20/10/2026"
Cohesion: 0.40
Nodes (4): Backlog có bằng chứng, Kiểm tra trình duyệt còn thiếu, Rà soát nguồn các trang còn lại — 20/10/2026, Thành phần chung có thể dùng

### Community 151 - "DocumentTemplate"
Cohesion: 0.08
Nodes (8): ContentValidation, RenderResult, _brief_item_usable(), Column, DocumentTemplate, missing_brief_items(), Section, test_missing_brief_items_counts_only_clear_and_assumed()

### Community 153 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (3): get_dashboard_summary(), get_portfolio_health(), get_project_stats()

### Community 155 - "skills.py"
Cohesion: 0.15
Nodes (5): create_skills(), delete_skills(), get_skills(), list_skills(), update_skills()

### Community 156 - "schemas/process_model.py"
Cohesion: 0.17
Nodes (6): generate_process_model(), get_process_model(), ProcessModelGenerateRequest, ProcessModelGenerateResponse, ProcessModelResponse, ProcessStepRow

### Community 157 - "project_task_counts"
Cohesion: 0.18
Nodes (6): get_dashboard_service(), _iso_week_bounds(), project_task_counts(), File Structure, Task 1: Hàm EVM thuần, Task 8: Kiểm chứng trên trình duyệt và cập nhật tài liệu

### Community 158 - "types"
Cohesion: 0.09
Nodes (13): UserSearchResult, AuditService, get_audit_service(), _mask_email(), build_db(), test_list_maps_rows_with_actor(), test_list_returns_empty_page(), test_customer_role_cannot_read_project_work_items() (+5 more)

### Community 159 - "Rà soát 2026-09-06"
Cohesion: 0.20
Nodes (9): 7 Trụ cột chính:, Bảo mật, Còn nợ, Giao diện, Lỗi chặn đã sửa, Lộ trình: Portfolio & Project Core Module (Phase 2), Rà soát 2026-09-06, Tính năng "trông như xong" nhưng luôn trả 0 (+1 more)

### Community 160 - "AppBackground.tsx"
Cohesion: 0.35
Nodes (8): AppBackground(), currentMode(), hasTextSelection(), isInteractiveTarget(), FIREWORKS_STORAGE_KEY, FireworksPreference, readFireworksPreference(), useFireworksPreference()

### Community 163 - "Lộ trình: Auth & User Onboarding Module (Phase 1)"
Cohesion: 0.22
Nodes (5): 6 Trụ cột chính:, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Auth & User Onboarding Module (Phase 1), Rà soát bảo mật 2026-09-06, Tổng quan Module

### Community 164 - "portfolio_service.py"
Cohesion: 0.05
Nodes (28): create_portfolio(), delete_portfolio(), get_portfolio(), grant_portfolio_investor(), list_portfolio_investors(), list_portfolios(), revoke_portfolio_investor(), update_portfolio() (+20 more)

### Community 166 - "README.md"
Cohesion: 0.13
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 167 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (7): _service_with_rows(), test_burndown_accumulates_completions_across_the_window(), test_burndown_counts_work_finished_before_the_window_opens(), test_burndown_never_reports_negative_work_remaining(), test_team_utilisation_is_empty_without_members(), test_team_utilisation_uses_grouped_queries_not_one_per_member(), test_the_ideal_line_runs_from_the_total_down_to_zero()

### Community 168 - "Lộ trình: Mô-đun tính năng AI (Phase 3)"
Cohesion: 0.22
Nodes (7): 5 Trụ cột AI chính:, Lộ trình: Mô-đun tính năng AI (Phase 3), Tổng quan Module, Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan

### Community 169 - "test_ai_service.py"
Cohesion: 0.44
Nodes (8): ai_request(), db(), test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output(), test_missing_job_raises_not_found(), test_other_users_job_is_forbidden_unless_admin(), test_pending_job_has_no_project_id_yet(), user()

### Community 172 - "docx_renderer.py"
Cohesion: 0.14
Nodes (11): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _render_assumptions(), render_docx(), render_docx_report() (+3 more)

### Community 173 - "test_authz_matrix.py"
Cohesion: 0.20
Nodes (8): test_a_member_can_read_project_tasks(), test_a_member_cannot_create_tasks(), test_a_non_member_cannot_read_project_tasks(), test_an_unverified_account_can_still_read(), test_an_unverified_account_cannot_write(), test_the_customer_role_cannot_read_the_dependency_graph_either(), test_the_customer_role_cannot_read_the_work_breakdown_of_tasks(), test_the_pm_can_create_tasks()

### Community 175 - "ResourceService"
Cohesion: 0.06
Nodes (23): create_assignment(), delete_assignment(), my_assignments(), delete_subtask(), update_subtask(), AssignmentCreate, AssignmentMutationResponse, AssignmentResponse (+15 more)

### Community 177 - "Thiết kế lại giao diện dễ sử dụng — Implementation Plan"
Cohesion: 0.18
Nodes (10): Global Constraints, Hướng bố cục đề xuất, Thiết kế lại giao diện dễ sử dụng — Implementation Plan, Thứ tự và giới hạn ước lượng, Đợt 1 — Sửa lỗi cản trở thao tác (ước lượng 1–2 ngày làm việc), Đợt 2 — Khung ứng dụng và điều hướng (2–3 ngày), Đợt 3 — Danh sách công việc và bộ lọc (2–3 ngày), Đợt 4 — WBS và tổng quan (2–3 ngày) (+2 more)

### Community 178 - "endpoints/dependencies.py"
Cohesion: 0.31
Nodes (3): create_dependency(), delete_dependency(), list_dependencies()

### Community 179 - "Thiết kế các luồng Phase 4"
Cohesion: 0.29
Nodes (7): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 181 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (9): _assignment(), _service(), test_a_reasonable_workload_raises_nothing(), test_concurrent_assignments_add_up(), test_each_overloaded_day_is_reported_separately(), test_hours_are_spread_across_the_assignment_window(), test_leave_takes_precedence_over_overload(), test_more_hours_than_a_day_holds_is_flagged() (+1 more)

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.20
Nodes (9): Cập nhật 2026-10-14, Cập nhật 2026-10-16 — Investor Dashboard (Phase 5, giai đoạn 5.3), Cập nhật 2026-10-18 — Dọn dẹp nhánh và cache lỗi thời (nhật ký), Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md (+1 more)

### Community 186 - "react"
Cohesion: 0.07
Nodes (47): Danh mục tính năng đã triển khai, Danh mục tính năng triển khai theo Phase, NotificationsPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props (+39 more)

### Community 188 - "parse_process_model"
Cohesion: 0.18
Nodes (7): parse_process_model(), test_parse_from_dict(), test_parse_from_fenced_string(), test_parse_invalid_json_raises_ai_error(), test_parse_non_object_raises_ai_error(), test_parse_schema_error_raises_ai_error_with_summary(), Nhật ký

### Community 192 - "list_jobs"
Cohesion: 0.31
Nodes (3): get_job(), list_jobs(), visible_jobs()

### Community 195 - "sweep_task_dates_task"
Cohesion: 0.14
Nodes (11): sweep_task_dates_task(), 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.15
Nodes (12): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm) (+4 more)

### Community 197 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (5 dịch vụ mặc định + 2 dịch vụ Celery kế thừa trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 198 - "impact_analyzer.py"
Cohesion: 0.20
Nodes (7): _build_prompt(), generate_impact_analysis(), get_ai_provider(), run_impact_analysis(), _summarize_cpm(), _truncate(), _validate_ai_output()

### Community 204 - "Job"
Cohesion: 0.05
Nodes (46): JobContext, JobResult, JobRunner, Job, catchup_loop(), enqueue_due_schedules(), run_daily_batch(), apply() (+38 more)

### Community 208 - "create_refresh_token"
Cohesion: 0.09
Nodes (22): get_current_user(), get_current_user_media(), _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), _utcnow(), TokenResponse (+14 more)

### Community 209 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 214 - "Kiểm tra giao diện triển khai — 20/10/2026"
Cohesion: 0.50
Nodes (4): Giới hạn kiểm tra, Kiểm tra giao diện triển khai — 20/10/2026, Phát hiện ưu tiên, Phạm vi và bằng chứng

### Community 217 - "next"
Cohesion: 0.07
Nodes (45): Task 5: Frontend nền tảng: kiểu dữ liệu, service, hook, RBAC, điều hướng, i18n, 8. Frontend, AdminLayout(), TABS, InvestorLayout(), DashboardLayout(), FireworksToggle(), FireworksToggleProps (+37 more)

### Community 228 - "6 Token và hợp đồng component"
Cohesion: 0.18
Nodes (8): 6.1 Màu ngữ nghĩa, 6.2 Typography, 6.3 Khoảng cách và hình khối, 6.4 Component, 6.5 Responsive và chuyển động, 6 Token và hợp đồng component, FakeSocket, flush()

### Community 257 - "Task"
Cohesion: 0.06
Nodes (31): Task, Worklog, TaskRepository, CPMResponse, CPMTask, _compute_signals(), _count_overloaded_user_days(), recalculate_project_cost() (+23 more)

## Knowledge Gaps
- **626 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `{ chromium }`, `fs`, `path` (+621 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1779 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **58 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `react` to `tasks/page.tsx`, `dashboard_service.py`, `Button`, `(dashboard)/portfolios/[id]/page.tsx`, `portfolio_service.py`, `TaskService`, `User`, `next-intl`, `chat_service.py`, `cn`, `ProjectOverviewCharts.tsx`, `ResourceService`, `NotificationService`, `BadRequestException`, `next`, `Rà soát 2026-09-06`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Task`, `Project`, `ProcessModel`, `test_project_versions.py`, `report_service.py`, `AdminUserService`, `endpoints/ai.py`, `test_ws_hardening.py`, `require_permissions`, `env.py`, `auth_service.py`, `sqlalchemy_ext_asyncio`, `portfolio_service.py`, `list_projects`, `InvestorService`, `chat_service.py`, `sqlalchemy`, `ResourceService`, `AIService`, `wbs.py`, `TaskService`, `UserRepository`, `list_audit_logs`, `Job`, `test_auth_email_verification.py`, `RequirementBrief`, `create_refresh_token`, `test_user_profile_settings.py`, `document_service.py`, `test_oauth_account_takeover.py`, `dashboard_service.py`, `list_permissions`, `BadRequestException`, `test_security_state.py`, `typing`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `Hiện trạng theo tính năng` connect `Button` to `ChangeRequestDetail.tsx`, `Lộ trình: Mô-đun tính năng AI (Phase 3)`, `ProcessModel`, `lucide-react`, `useCPM.test.tsx`, `types`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 100 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 100 INFERRED edges - model-reasoned connections that need verification._
- **Are the 52 inferred relationships involving `Project` (e.g. with `visible_jobs()` and `PortfolioRepository`) actually correct?**
  _`Project` has 52 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `{ chromium }` to the rest of the system?**
  _626 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.04415708812260537 - nodes in this community are weakly interconnected._