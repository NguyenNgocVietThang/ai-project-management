import { formatDate, formatStatus } from '@/lib/format'

type Translate = (key: string, values?: Record<string, string | number>) => string

/** Match only known server templates, keeping quoted names and free text intact.
 * Unknown notifications may contain user content and must remain unchanged. */
export function localizeSystemText(text: string, t: Translate, locale: string): string {
  const fixed: Record<string, string> = {
    'New task assigned': 'assignedTitle', 'Task assigned to you': 'assignedTitle',
    'Công việc đã được phân công': 'assignedTitle',
    'Change request cần bạn duyệt': 'reviewTitle',
    'Change request đã được duyệt': 'approvedTitle',
    'Change request bị từ chối': 'rejectedTitle',
    'Password sign-in': 'passwordSignIn', 'Refresh token rotated': 'tokenRotated',
    'Refresh token revoked': 'tokenRevoked',
  }
  if (fixed[text]) return t(fixed[text])
  const rules: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/^(?:You have been assigned to task|Bạn đã được phân công công việc) '(.+)'$/, m => t('assignedMessage', { name: m[1] })],
    [/^Task '(.+)' is starting today$/, m => t('startingTitle', { name: m[1] })],
    [/^Task '(.+)' was scheduled to start today \((\d{4}-\d{2}-\d{2})\)\.$/, m => t('startingMessage', { name: m[1], date: formatDate(m[2], locale) })],
    [/^Task '(.+)' is due soon$/, m => t('dueTitle', { name: m[1] })],
    [/^Task '(.+)' is due on (\d{4}-\d{2}-\d{2})\.$/, m => t('dueMessage', { name: m[1], date: formatDate(m[2], locale) })],
    [/^Task '(.+)' updated$/, m => t('updatedTitle', { name: m[1] })],
    [/^Task '(.+)' status changed$/, m => t('statusTitle', { name: m[1] })],
    [/^(.+) moved '(.+)' from ([A-Z_]+) to ([A-Z_]+)$/, m => t('statusMessage', { actor: m[1], name: m[2], from: formatStatus(m[3], locale), to: formatStatus(m[4], locale) })],
    [/^(.+) changed ([a-z_, ]+) on task '(.+)'$/, m => t('updatedMessage', { actor: m[1], name: m[3], fields: m[2].split(', ').map(field => localizeField(field, t)).join(', ') })],
    [/^Change request '(.+)' đang chờ bước duyệt (.+)$/, m => t('reviewMessage', { name: m[1], role: formatStatus(m[2], locale) })],
    [/^Change request '(.+)' đã được duyệt$/, m => t('approvedMessage', { name: m[1] })],
    [/^Change request '(.+)' đã bị từ chối$/, m => t('rejectedMessage', { name: m[1] })],
    [/^Created phase (.+)$/, m => t('phaseCreated', { name: m[1] })],
    [/^Deleted phase (.+) using (.+)$/, m => t('phaseDeleted', { name: m[1], strategy: localizeStrategy(m[2], t) })],
    [/^Created change request (.+)$/, m => t('crCreated', { name: m[1] })],
    [/^Added (.+) as (.+)$/, m => t('memberAdded', { name: m[1], role: formatStatus(m[2], locale) })],
    [/^Changed (.+) from (.+) to (.+)$/, m => t('memberChanged', { name: m[1], from: formatStatus(m[2], locale), to: formatStatus(m[3], locale) })],
    [/^Removed (.+) from the project$/, m => t('memberRemoved', { name: m[1] })],
    [/^Project (\d+) version (\d+): (.+)$/, m => t('versionCreated', { id: m[1], version: m[2], label: m[3] })],
    [/^Project (\d+) rolled back to version (\d+)$/, m => t('versionRestored', { id: m[1], version: m[2] })],
    [/^Step (\d+) \((.+)\) of change request (\d+)$/, m => t('approvalStep', { step: m[1], role: formatStatus(m[2], locale), id: m[3] })],
    [/^Admin (.+) (created|updated|deleted) role (.+)$/, m => t(`role${capitalize(m[2])}`, { actor: m[1], name: m[3] })],
    [/^Admin (.+) (created|updated|deactivated|reactivated) user (.+)$/, m => t(`user${capitalize(m[2])}`, { actor: m[1], name: m[3] })],
    [/^(Create|Created|Update|Updated|Delete|Deleted) portfolio (.+)$/, m => t(`portfolio${m[1].startsWith('Create') ? 'Created' : m[1].startsWith('Update') ? 'Updated' : 'Deleted'}`, { name: m[2] })],
    [/^(Investor added|Investor removed|Investor updated) on portfolio (.+)$/, m => t(`investor${capitalize(m[1].split(' ')[1])}`, { name: m[2] })],
    [/^(Grant|Revoke) investor on portfolio (.+)$/, m => t(m[1] === 'Grant' ? 'investorAdded' : 'investorRemoved', { name: m[2] })],
  ]
  for (const [pattern, render] of rules) {
    const match = text.match(pattern)
    if (match) return render(match)
  }
  return text
}

const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1)

function localizeField(field: string, t: Translate) {
  const fields = ['name', 'description', 'start_date', 'due_date', 'estimated_hours', 'priority', 'assigned_to_id', 'phase_id', 'sprint_id', 'epic_id', 'labels', 'story_points', 'status']
  return fields.includes(field) ? t(`fields.${field}`) : field
}

function localizeStrategy(strategy: string, t: Translate) {
  return ['cascade', 'move', 'backlog', 'move_to_backlog', 'reassign'].includes(strategy) ? t(`strategies.${strategy}`) : strategy
}

export function localizeEntityType(value: string, t: Translate): string {
  return ['Task', 'Project', 'Portfolio', 'Phase', 'Sprint', 'Milestone', 'Epic', 'ChangeRequest', 'User', 'Role', 'Assignment', 'Worklog', 'ProjectVersion', 'Approval'].includes(value)
    ? t(`entities.${value}`) : value
}

export function localizeActivityAction(value: string, t: Translate, locale: string): string {
  return ['CREATE', 'UPDATE', 'DELETE', 'STATUS', 'ASSIGN', 'APPROVE', 'REJECT', 'SUBMIT', 'LOGIN_SUCCESS', 'LOGOUT', 'TOKEN_REFRESH', 'ROLLBACK', 'RESTORE', 'ADD_MEMBER', 'REMOVE_MEMBER', 'UPDATE_MEMBER_ROLE', 'VERSION_CREATE', 'VERSION_ROLLBACK'].includes(value)
    ? t(`actions.${value}`) : formatStatus(value, locale)
}
