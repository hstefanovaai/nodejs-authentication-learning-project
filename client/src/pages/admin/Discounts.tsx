import { useState } from "react";
import { ADMIN_DISCOUNTS } from "../../data/admin";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Expired: "bg-slate-100 text-slate-600",
  Scheduled: "bg-blue-50 text-blue-700",
};

export default function Discounts() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discounts & Coupons</h1>
          <p className="text-slate-500 mt-1">Manage promo codes and discount rules</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          + Create Coupon
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">New Coupon</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min. Order Value (€)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usage Limit</label>
              <input
                type="number"
                placeholder="0 = unlimited"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Applies To</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option>All Products</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Science Fiction</option>
                <option>Fantasy</option>
                <option>Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Min. Order</th>
                <th className="px-4 py-3 font-medium">Usage</th>
                <th className="px-4 py-3 font-medium">Applies To</th>
                <th className="px-4 py-3 font-medium">Valid Period</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ADMIN_DISCOUNTS.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{d.code}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    {d.type === "Percentage" ? `${d.value}%` : `€${d.value.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {d.minOrder > 0 ? `€${d.minOrder}` : "None"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {d.used}{d.usageLimit > 0 ? ` / ${d.usageLimit}` : " / ∞"}
                    {d.usageLimit > 0 && (
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${Math.min((d.used / d.usageLimit) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{d.appliesTo}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {d.startDate} — {d.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                    <button className="text-rose-500 hover:text-rose-600 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
