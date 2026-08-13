import { redirect } from 'next/navigation'

// The auth flow's true source of truth (authStore) only lives client-side, so `/`
// hands off to `/login` immediately; the (auth) route group bounces already-authenticated
// users on to `/dashboard` once the store rehydrates.
export default function RootPage() {
  redirect('/login')
}
