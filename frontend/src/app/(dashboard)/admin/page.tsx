'use client'

import { useTranslations } from 'next-intl'

import { ArrowRight, History, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ButtonLink } from '@/components/common/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

interface AdminTile {
  href: string
  title: string
  description: string
  Icon: LucideIcon
}

// Các khu vực quản trị; layout cha đã kiểm tra quyền admin trước khi trang này render.
const TILES: AdminTile[] = [
  {
    href: '/admin/users',
    title: 'users',
    description: 'createAccountsAssignRolesAndActivateOrDeactivateAccess',
    Icon: Users,
  },
  {
    href: '/admin/roles',
    title: 'rolesPermissionsLabel',
    description: 'composeRolesFromTheFixedPermissionCatalogAndSeeWhoHoldsEachOne',
    Icon: ShieldCheck,
  },
  {
    href: '/admin/audit',
    title: 'auditLog',
    description: 'aReadOnlyAppendOnlyTrailOfEveryChangeMadeAcrossTheSystem',
    Icon: History,
  },
]

/** Trang tổng quan quản trị: các ô điều hướng tới từng khu vực quản lý. */
export default function AdminIndexPage() {
  const tAccount = useTranslations('accountUi')
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tAccount('admin')}
        title={tAccount('administration')}
        description={tAccount('manageWhoCanSignInWhatTheyAreAllowedToDoAndReviewEveryChangeMadeAcrossTheSystem')}
        actions={
          <ButtonLink href="/admin/users">
            <Users className="h-4 w-4" aria-hidden="true" />
             {tAccount('manageUsers')} </ButtonLink>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card interactive className="flex h-full flex-col gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h2 className="text-h4 text-foreground">{tAccount(title)}</h2>
                <p className="mt-1 text-body-sm text-muted-foreground">{tAccount(description)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary">
                 {tAccount('open')} <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
