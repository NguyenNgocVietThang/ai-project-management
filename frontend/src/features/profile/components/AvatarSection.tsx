'use client'

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
  const apiOrigin = new URL(API_BASE_URL).origin
  return `${apiOrigin}${value}`
}

export function AvatarSection({ user, onUpload, isLoading, error, success }: AvatarSectionProps) {
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
      setLocalError('Choose a JPEG, PNG, or WebP image.')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setLocalError('Avatar must not exceed 5 MiB.')
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
      // The mutation exposes the server error through the `error` prop.
    }
  }

  const avatar = preview ?? resolveAvatarUrl(user.avatar_url)

  return (
    <SectionCard title="Profile photo" description="Upload a square photo so teammates can recognize you.">
      <div className="space-y-5">
        {(localError || error) && <Alert>{localError ?? error}</Alert>}
        {success && <Alert variant="success">Profile photo updated.</Alert>}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={`${user.full_name}'s avatar`} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-muted-foreground">
              JPEG, PNG, or WebP up to 5 MiB. The image will be cropped to a 512 × 512 square.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" className="sm:w-auto" onClick={() => inputRef.current?.click()}>
                <Camera className="h-4 w-4" aria-hidden="true" />
                Choose photo
              </Button>
              {file && (
                <Button type="button" className="sm:w-auto" isLoading={isLoading} onClick={submit}>
                  Upload photo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
