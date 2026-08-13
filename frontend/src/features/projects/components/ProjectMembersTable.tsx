'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Modal } from '@/components/common/Modal'
import { formatDate } from '@/lib/format'
import type { ProjectMember } from '@/types/project.types'

export function ProjectMembersTable({ members, canManage, onRemove, isRemoving, error }: { members: ProjectMember[]; canManage: boolean; onRemove: (userId: number) => Promise<void>; isRemoving: boolean; error?: string | null }) {
  const [target, setTarget] = useState<ProjectMember | null>(null)
  if (members.length === 0) return <EmptyState title="No project members" description="Invite someone to start collaborating." />
  return <>
    {error && <Alert className="mb-4">{error}</Alert>}
    <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Member</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody>{members.map((member) => <tr key={member.user.id} className="border-t"><td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={member.user.full_name} src={member.user.avatar_url} /><div><p className="font-medium">{member.user.full_name}{member.is_owner && <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary">Owner</span>}</p><p className="text-xs text-muted-foreground">{member.user.email}</p></div></div></td><td className="px-4 py-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{member.role.name}</span></td><td className="px-4 py-3 text-muted-foreground">{formatDate(member.joined_at)}</td><td className="px-4 py-3 text-right">{canManage && !member.is_owner && <button type="button" onClick={() => setTarget(member)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${member.user.full_name}`}><Trash2 className="h-4 w-4" /></button>}</td></tr>)}</tbody></table></div>
    <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Remove member" description="This user will immediately lose access to the project." className="max-w-lg"><p className="text-sm text-muted-foreground">Remove <strong className="text-foreground">{target?.user.full_name}</strong> from this project?</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="sm:w-auto" onClick={() => setTarget(null)}>Cancel</Button><Button type="button" variant="destructive" className="sm:w-auto" isLoading={isRemoving} onClick={async () => { if (target) { await onRemove(target.user.id); setTarget(null) } }}>Remove member</Button></div></Modal>
  </>
}
