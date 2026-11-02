import { useState } from "react";
import { ADMIN_CATEGORIES, ADMIN_COLLECTIONS } from "../../data/admin";

const collectionStatusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
  Scheduled: "bg-blue-50 text-blue-700",
};

export default function Categories() {
  const [tab, setTab] = useState<"categories" | "collections">("categories");

  const topLevel = ADMIN_CATEGORIES.filter((c) => c.parentId === null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories & Collections</h1>
          <p className="text-slate-500 mt-1">Organize your product taxonomy</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {tab === "categories" ? "+ Add Category" : "+ Add Collection"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "categories" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setTab("collections")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "collections" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Collections
        </button>
      </div>

      {tab === "categories" ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100">
            <p className="text-sm text-slate-500">{ADMIN_CATEGORIES.length} categories ({topLevel.length} top-level)</p>
          </div>
          <div className="divide-y divide-slate-100">
            {topLevel.map((category) => {
              const children = ADMIN_CATEGORIES.filter((c) => c.parentId === category.id);
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4 text-slate-300 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    {children.length > 0 && (
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                      <span className="text-xs text-slate-400 ml-2">/{category.slug}</span>
                    </div>
                    <span className="text-xs text-slate-400">{category.productCount} products</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="text-slate-400 hover:text-rose-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center gap-3 px-4 py-3 pl-14 hover:bg-slate-50 transition-colors bg-slate-50/50">
                      <svg className="w-4 h-4 text-slate-300 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                      <div className="flex-1">
                        <span className="text-sm text-slate-700">{child.name}</span>
                        <span className="text-xs text-slate-400 ml-2">/{child.slug}</span>
                      </div>
                      <span className="text-xs text-slate-400">{child.productCount} products</span>
                      <button className="text-slate-400 hover:text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-slate-400 hover:text-rose-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">Collection</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Date Range</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ADMIN_COLLECTIONS.map((col) => (
                  <tr key={col.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{col.name}</p>
                      <p className="text-xs text-slate-400">{col.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{col.productCount}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {col.startDate && col.endDate
                        ? `${col.startDate} — ${col.endDate}`
                        : "No date range"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${collectionStatusColors[col.status]}`}>
                        {col.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
