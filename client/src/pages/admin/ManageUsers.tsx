import { useCallback, useEffect, useState } from 'react'
import { api } from '../../services/api'
import type { User } from '../../types'
import { useAuthStore } from '../../store/auth'
import { Avatar, Badge, Button, GlassCard, Skeleton, toast } from '../../components/ui'

export function ManageUsers() {
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<User[] | null>(null)

  const load = useCallback(async () => {
    setUsers(await api.listUsers())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function toggleRole(user: User) {
    if (user.id === currentUser?.id) {
      toast.error("You can't change your own role.")
      return
    }
    const next = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    try {
      await api.updateUserRole(user.id, next)
      toast.success(`${user.displayName} is now ${next.toLowerCase()}.`)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed.')
    }
  }

  async function toggleActive(user: User) {
    if (user.id === currentUser?.id) {
      toast.error("You can't disable your own account.")
      return
    }
    try {
      await api.setUserActive(user.id, !user.isActive)
      toast.success(
        user.isActive ? `${user.displayName} disabled.` : `${user.displayName} enabled.`,
      )
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed.')
    }
  }

  return (
    <div>
      <h1 className="text-headline-lg md:text-headline-xl">
        User <span className="text-primary">Management</span>
      </h1>

      <GlassCard className="mt-8 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-body-md">
            <thead className="border-b border-white/[0.08] bg-white/[0.03] text-label-md text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users === null
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                : users.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.photoUrl} name={u.displayName} size="sm" />
                          <span className="font-medium">{u.displayName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-on-surface-variant">{u.email}</td>
                      <td className="px-5 py-3">
                        <Badge tone={u.role === 'ADMIN' ? 'primary' : 'neutral'}>{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={u.isActive ? 'success' : 'danger'}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={u.id === currentUser?.id}
                            onClick={() => toggleRole(u)}
                          >
                            {u.role === 'ADMIN' ? 'Demote' : 'Promote'}
                          </Button>
                          <Button
                            variant={u.isActive ? 'outline' : 'secondary'}
                            size="sm"
                            disabled={u.id === currentUser?.id}
                            onClick={() => toggleActive(u)}
                          >
                            {u.isActive ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
