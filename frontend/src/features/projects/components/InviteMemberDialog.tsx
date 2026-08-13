'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { useAssignableRoles, useUserSearch } from '@/features/projects/hooks/useProjectMembers'
import type { ProjectMemberCreate, UserSummary } from '@/types/project.types'

export function InviteMemberDialog({ open, onClose, onInvite, isLoading, error }: { open: boolean; onClose: () => void; onInvite: (body: ProjectMemberCreate) => Promise<void>; isLoading: boolean; error?: string | null }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<UserSummary | null>(null)
  const [roleId, setRoleId] = useState<number | null>(null)
  const users = useUserSearch(query)
  const roles = useAssignableRoles()

  useEffect(() => {
    if (!roleId && roles.data?.length) {
      setRoleId(roles.data.find((role) => role.name === 'Member')?.id ?? roles.data[0].id)
    }
  }, [roleId, roles.data])

  const close = () => {
    setQuery('')
    setSelected(null)
    onClose()
  }

  return <Modal open={open} onClose={close} title="Invite project member" description="Choose an active user and assign their project role.">
    <div className="space-y-5">
      {error && <Alert>{error}</Alert>}
      <div><Label htmlFor="invite-search">Search users</Label><div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input id="invite-search" className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null) }} placeholder="Name, username, or email" /></div></div>
      {query && !selected && <div className="max-h-56 overflow-y-auto rounded-lg border">{users.data?.map((candidate) => <button key={candidate.id} type="button" onClick={() => setSelected(candidate)} className="flex w-full items-center gap-3 border-b p-3 text-left last:border-0 hover:bg-accent"><Avatar name={candidate.full_name} src={candidate.avatar_url} /><span><span className="block text-sm font-medium">{candidate.full_name}</span><span className="text-xs text-muted-foreground">{candidate.email}</span></span></button>)}{users.data?.length === 0 && <p className="p-4 text-sm text-muted-foreground">No active users found.</p>}</div>}
      {selected && <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4"><Avatar name={selected.full_name} src={selected.avatar_url} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{selected.full_name}</p><p className="truncate text-xs text-muted-foreground">{selected.email}</p></div><Button type="button" variant="ghost" className="w-auto" onClick={() => setSelected(null)}>Change</Button></div>}
      <div><Label htmlFor="invite-role">Project role</Label><select id="invite-role" value={roleId ?? ''} onChange={(event) => setRoleId(Number(event.target.value))} className="h-11 w-full rounded-md border bg-background px-3"><option value="" disabled>Select a role</option>{roles.data?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="sm:w-auto" onClick={close}>Cancel</Button><Button type="button" className="sm:w-auto" disabled={!selected || !roleId} isLoading={isLoading} onClick={async () => { if (selected && roleId) { await onInvite({ user_id: selected.id, role_id: roleId }); close() } }}>Invite member</Button></div>
    </div>
  </Modal>
}
