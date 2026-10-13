'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Modal } from '@/components/common/Modal'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import type { ProjectMember } from '@/types/project.types'

export function ProjectMembersTable({ members, canManage, onRemove, isRemoving, error }: { members: ProjectMember[]; canManage: boolean; onRemove: (userId: number) => Promise<void>; isRemoving: boolean; error?: string | null }) {
  const [target, setTarget] = useState<ProjectMember | null>(null)
  if (members.length === 0) return <EmptyState title="No project members" description="Invite someone to start collaborating." />
  return <>
    {error && <Alert className="mb-4">{error}</Alert>}
    <Card flush className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-body-sm"><thead className="bg-muted/50 text-caption uppercase text-muted-foreground"><tr><th scope="col" className="px-4 py-3 font-medium">Member</th><th scope="col" className="px-4 py-3 font-medium">Role</th><th scope="col" className="px-4 py-3 font-medium">Joined</th><th scope="col" className="px-4 py-3 text-right font-medium">Action</th></tr></thead><tbody>{members.map((member) => <tr key={member.user.id} className="border-t transition-colors hover:bg-muted/40"><td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={member.user.full_name} src={member.user.avatar_url} /><div className="min-w-0"><p className="flex flex-wrap items-center gap-2 font-medium">{member.user.full_name}{member.is_owner && <Badge tone="primary" size="sm">Owner</Badge>}</p><p className="truncate text-caption text-muted-foreground">{member.user.email}</p></div></div></td><td className="px-4 py-3"><Badge>{member.role.name}</Badge></td><td className="px-4 py-3 text-muted-foreground">{formatDate(member.joined_at)}</td><td className="px-4 py-3 text-right">{canManage && !member.is_owner && <Button type="button" variant="ghost" size="icon" fullWidth={false} onClick={() => setTarget(member)} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${member.user.full_name}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>}</td></tr>)}</tbody></table></div></Card>
    <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Remove member" description="This user will immediately lose access to the project." className="max-w-lg"><p className="text-body-sm text-muted-foreground">Remove <strong className="text-foreground">{target?.user.full_name}</strong> from this project?</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="sm:w-auto" onClick={() => setTarget(null)}>Cancel</Button><Button type="button" variant="destructive" className="sm:w-auto" isLoading={isRemoving} onClick={async () => { if (target) { await onRemove(target.user.id); setTarget(null) } }}>Remove member</Button></div></Modal>
  </>
}
