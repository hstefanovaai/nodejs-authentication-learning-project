import { useState } from "react";
import { MONTHLY_REVENUE, ADMIN_PRODUCTS, ADMIN_ORDERS } from "../../data/admin";
import { CATEGORIES } from "../../data/books";

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
const maxOrders = Math.max(...MONTHLY_REVENUE.map((m) => m.orders));

const categoryRevenue = CATEGORIES.map((cat) => {
  const products = ADMIN_PRODUCTS.filter((p) => p.category === cat);
  const revenue = products.reduce((sum, p) => sum + p.sales * p.price, 0);
  return { category: cat, revenue: Math.round(revenue), products: products.length };
}).sort((a, b) => b.revenue - a.revenue);

const maxCatRevenue = Math.max(...categoryRevenue.map((c) => c.revenue));

const statusBreakdown = [
  { status: "Completed", count: ADMIN_ORDERS.filter((o) => o.status === "Completed").length, color: "bg-slate-400" },
  { status: "Delivered", count: ADMIN_ORDERS.filter((o) => o.status === "Delivered").length, color: "bg-emerald-400" },
  { status: "Shipped", count: ADMIN_ORDERS.filter((o) => o.status === "Shipped").length, color: "bg-blue-400" },
  { status: "Processing", count: ADMIN_ORDERS.filter((o) => o.status === "Processing").length, color: "bg-amber-400" },
  { status: "Refunded", count: ADMIN_ORDERS.filter((o) => o.status === "Refunded").length, color: "bg-violet-400" },
  { status: "Cancelled", count: ADMIN_ORDERS.filter((o) => o.status === "Cancelled").length, color: "bg-rose-400" },
];
const totalOrdersCount = statusBreakdown.reduce((s, b) => s + b.count, 0);

export default function Analytics() {
  const [period, setPeriod] = useState("year");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">Sales data, trends, and performance metrics</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900">€{MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0).toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">+15.3% vs last year</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-slate-900">{MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0).toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">+12.1% vs last year</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-slate-900">3.2%</p>
          <p className="text-xs text-emerald-600 mt-1">+0.3% vs last year</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Abandoned Carts</p>
          <p className="text-2xl font-bold text-slate-900">68.4%</p>
          <p className="text-xs text-rose-600 mt-1">+2.1% vs last year</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Revenue Over Time</h2>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500">€{(m.revenue / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-orange-400 rounded-t-md min-h-[4px]"
                  style={{ height: `${(m.revenue / maxRevenue) * 140}px` }}
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Orders Over Time</h2>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500">{m.orders}</span>
                <div
                  className="w-full bg-blue-400 rounded-t-md min-h-[4px]"
                  style={{ height: `${(m.orders / maxOrders) * 140}px` }}
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue by Category */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Category</h2>
          <div className="space-y-3">
            {categoryRevenue.slice(0, 8).map((c) => (
              <div key={c.category} className="flex items-center gap-4">
                <span className="text-sm text-slate-700 w-36 truncate">{c.category}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-24 text-right">€{c.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <span className="text-sm text-slate-700 flex-1">{s.status}</span>
                <span className="text-sm text-slate-500">{s.count}</span>
                <span className="text-xs text-slate-400 w-12 text-right">{((s.count / totalOrdersCount) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          {/* Simple donut representation */}
          <div className="mt-6 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                {(() => {
                  let offset = 0;
                  const colors = ["#94a3b8", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#fb7185"];
                  return statusBreakdown.map((s, i) => {
                    const pct = (s.count / totalOrdersCount) * 100;
                    const el = (
                      <circle
                        key={s.status}
                        r="16"
                        cx="18"
                        cy="18"
                        fill="transparent"
                        stroke={colors[i]}
                        strokeWidth="3"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{totalOrdersCount}</p>
                  <p className="text-xs text-slate-400">orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
