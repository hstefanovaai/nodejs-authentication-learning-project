export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Auth Playground
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          React + TypeScript + Tailwind, talking to an Express + TypeScript API.
        </p>
      </div>
    </main>
  );
}
