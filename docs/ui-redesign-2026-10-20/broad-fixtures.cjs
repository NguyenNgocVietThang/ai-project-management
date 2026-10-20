// Synthetic read-only fixtures for the remaining-page audit. No real people/data.
module.exports = function broadFixtures(data) {
 const paged = items => ({ items, total: items.length, page: 1, page_size: 100, total_pages: 1 })
 const stamp = '2026-10-20T03:00:00Z'
 const portfolio = { id: 21, name: 'Danh mục chuyển đổi số — mẫu QA', description: 'Danh mục tổng hợp phục vụ kiểm tra cục bộ.', status: 'ACTIVE', start_date: '2026-10-20', end_date: '2026-12-15', budget: 500000000, currency: 'VND', owner_id: data.user.id, project_count: 1, progress_percent: 1, created_at: stamp, updated_at: stamp, capabilities: { can_update: true, can_delete: true, can_create_project: true } }
 const permissions = [{ id: 1, resource: 'project', action: 'read', description: 'Xem dự án' }]
 const roles = [{ id: 1, name: 'PM', description: 'Quản lý dự án', permissions, user_count: 1 }]
 const doc = { id: 301, project_id: 2, brief_id: null, doc_type: 'SRS', language: 'vi', version: 1, status: 'ready', progress: { completed_groups: 4, total_groups: 4 }, missing_items: [], warnings: [], error_code: null, file_size: 10240, job_id: null, job_status: null, created_by_id: data.user.id, created_at: stamp, completed_at: stamp }
 return {
  '/dashboards/summary': { stats: { active_projects: 1, total_tasks: data.tasks.length, overdue_tasks: 0, hours_this_week: 6 }, active_projects: [{ ...data.project, days_remaining: 56 }], my_tasks: data.tasks.slice(0, 3).map(task => ({ ...task, project_name: data.project.name, is_overdue: false })), recent_activity: [{ id: 401, action: 'project.create', description: 'Khởi tạo dự án tổng hợp QA.', entity_type: 'project', entity_id: 2, actor_name: data.user.full_name, created_at: stamp }] },
  '/portfolios': paged([portfolio]),
  '/portfolios/21': { ...portfolio, projects: [data.project] },
  '/dashboards/portfolios/21/health': { portfolio_id: 21, portfolio_name: portfolio.name, total_projects: 1, active_projects: 1, completed_projects: 0, overall_progress: 1, projects: [{ project_id: 2, project_name: data.project.name, progress_percent: 1, status: 'ACTIVE', overdue_tasks: 0, budget_utilization_pct: 0 }] },
  '/projects/2/worklogs': { items: [{ id: 501, task_id: 101, user_id: data.user.id, hours: 6, log_date: '2026-10-20', description: 'Rà soát yêu cầu và chuẩn bị dữ liệu QA.', start_time: null, end_time: null, created_at: stamp, user: data.user, is_running: false }], total_hours: 6, by_user: { [data.user.id]: 6 } },
  '/resource-leveling/2': [{ user_id: data.user.id, date: '2026-10-20', reason: 'overloaded', total_hours: 10, max_hours: 8, task_ids: [101] }],
  '/projects/2/messages': { items: [{ id: 601, project_id: 2, user_id: 9002, user_name: 'Nguyễn thành viên có tên dài để kiểm tra metadata tin nhắn trên điện thoại', user_avatar_url: null, content: 'Đã chuẩn bị bộ dữ liệu tổng hợp để kiểm tra giao diện. Xin rà soát kế hoạch và các công việc cần phối hợp.', created_at: stamp }, { id: 602, project_id: 2, user_id: data.user.id, user_name: data.user.full_name, user_avatar_url: null, content: 'Tôi sẽ kiểm tra danh sách công việc và cập nhật kết quả.', created_at: stamp }], next_before_id: null, has_more: false },
  '/projects/2/documents': [doc, { ...doc, id: 302, doc_type: 'BRD', status: 'failed', progress: { completed_groups: 1, total_groups: 4 }, error_code: 'ai_quota_exceeded', completed_at: null }],
  '/users': paged([{ ...data.user, created_at: stamp }]),
  '/permissions': permissions,
  '/roles': roles,
  '/audit': paged([{ id: 701, user_id: data.user.id, user: data.user, action: 'project.create', entity_type: 'project', entity_id: 2, old_values: null, new_values: { name: data.project.name }, ip_address: null, description: 'Sự kiện tổng hợp QA.', created_at: stamp }]),
 }
}
