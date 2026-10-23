'use client'

import { useTranslations } from 'next-intl'

import { Camera, User as UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { API_BASE_URL } from '@/services/api'
import type { User } from '@/types/auth.types'
import { SectionCard } from './SectionCard'

interface AvatarSectionProps {
  user: User
  onUpload: (file: File) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

function resolveAvatarUrl(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//.test(value) || value.startsWith('blob:')) return value
  if (API_BASE_URL.startsWith('/')) return value
  const apiOrigin = new URL(API_BASE_URL).origin
  return `${apiOrigin}${value}`
}

export function AvatarSection({ user, onUpload, isLoading, error, success }: AvatarSectionProps) {
  const tAccount = useTranslations('accountUi')
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const chooseFile = (selected: File | undefined) => {
    setLocalError(null)
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setLocalError('chooseAJPEGPNGOrWebPImage')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setLocalError('avatarMustNotExceed5MiB')
      return
    }
    setFile(selected)
  }

  const submit = async () => {
    if (!file) return
    try {
      await onUpload(file)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch {
      // Mutation bộc lộ lỗi từ server qua prop `error`.
    }
  }

  const avatar = preview ?? resolveAvatarUrl(user.avatar_url)

  return (
    <SectionCard title={tAccount('profilePhoto')} description={tAccount('uploadASquarePhotoSoTeammatesCanRecognizeYou')}>
      {/* Bố cục dọc, căn giữa: vừa với cột phụ 320px trên desktop */}
      <div className="space-y-4">
        {(localError || error) && <Alert>{localError ? tAccount(localError) : error}</Alert>}
        {success && <Alert variant="success"> {tAccount('profilePhotoUpdated')} </Alert>}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted ring-4 ring-accent">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={tAccount('avatarFor', { name: user.full_name })} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-body font-medium text-foreground">{user.full_name}</p>
            <p className="text-caption text-muted-foreground">{user.email}</p>
          </div>
          <p className="text-caption text-muted-foreground">
             {tAccount('jPEGPNGOrWebPUpTo5MiBTheImageWillBeCroppedToA512512Square')} </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <div className="flex w-full flex-col gap-2">
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              <Camera className="h-4 w-4" aria-hidden="true" />
               {tAccount('choosePhoto')} </Button>
            {file && (
              <Button type="button" isLoading={isLoading} onClick={submit}>
                 {tAccount('uploadPhoto')} </Button>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
