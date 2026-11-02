import { useState } from "react";
import { ADMIN_SHIPPING_ZONES } from "../../data/admin";

export default function Shipping() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipping</h1>
          <p className="text-slate-500 mt-1">Configure shipping zones and rates</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Shipping Zone
        </button>
      </div>

      {/* New Zone Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">New Shipping Zone</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zone Name</label>
              <input
                type="text"
                placeholder="e.g. EU Countries"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Countries</label>
              <input
                type="text"
                placeholder="Enter countries separated by commas"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Zone
            </button>
          </div>
        </div>
      )}

      {/* Shipping Zones */}
      <div className="space-y-6">
        {ADMIN_SHIPPING_ZONES.map((zone) => (
          <div key={zone.id} className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{zone.name}</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {zone.countries.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-slate-400 hover:text-rose-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Shipping Method</th>
                  <th className="px-6 py-3 font-medium">Rate Type</th>
                  <th className="px-6 py-3 font-medium">Cost</th>
                  <th className="px-6 py-3 font-medium">Free Shipping Above</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {zone.rates.map((rate, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium text-slate-900">{rate.method}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {rate.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-900 font-medium">€{rate.cost.toFixed(2)}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {rate.freeAbove ? `€${rate.freeAbove}` : "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-3 border-t border-slate-100">
              <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                + Add shipping rate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
