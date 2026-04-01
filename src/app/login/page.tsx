'use client'

import { useSearchParams } from 'next/navigation'
import { login } from './actions'
import { Suspense, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const [state, formAction] = useActionState(login, null)
  
  const displayError = state?.error || urlError

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">Admin Login</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Enter your credentials to access the tournament dashboard.</p>
        </div>

        {displayError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30">
            {displayError}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-black dark:text-white"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-black dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <a href="/" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
            &larr; Back to Public Page
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
