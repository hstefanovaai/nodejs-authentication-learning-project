import { useEffect, useState } from 'react'

type Health = { status: string; uptime: number }

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Health>
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Auth Playground</h1>
        <p className="mt-2 text-sm text-slate-600">
          React + TypeScript + Tailwind, talking to an Express + TypeScript API.
        </p>

        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm">
          <span className="font-medium text-slate-700">API status: </span>
          {health && <span className="text-green-700">{health.status}</span>}
          {error && <span className="text-red-700">unreachable ({error})</span>}
          {!health && !error && <span className="text-slate-500">checking…</span>}
        </div>
      </div>
    </main>
  )
}
