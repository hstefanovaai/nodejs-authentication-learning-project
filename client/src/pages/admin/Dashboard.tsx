import { Link } from "react-router-dom";
import {
  DASHBOARD_STATS,
  MONTHLY_REVENUE,
  TOP_SELLING,
  RECENT_ACTIVITY,
  ADMIN_ORDERS,
} from "../../data/admin";

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  const colors: Record<string, string> = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[color]}`}>{sub}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Orders" value={DASHBOARD_STATS.totalOrders.toLocaleString()} sub="+12% vs last month" color="orange" />
        <StatCard label="Revenue" value={`€${DASHBOARD_STATS.revenue.toLocaleString()}`} sub="+8.2%" color="emerald" />
        <StatCard label="New Customers" value={String(DASHBOARD_STATS.newCustomers)} sub="This month" color="blue" />
        <StatCard label="Low Stock Alerts" value={String(DASHBOARD_STATS.lowStockProducts)} sub="Need attention" color="amber" />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Pending Orders" value={String(DASHBOARD_STATS.pendingOrders)} sub="Awaiting action" color="violet" />
        <StatCard label="Conversion Rate" value={`${DASHBOARD_STATS.conversionRate}%`} sub="+0.3%" color="emerald" />
        <StatCard label="Avg. Order Value" value={`€${DASHBOARD_STATS.avgOrderValue}`} sub="+€1.20" color="blue" />
        <StatCard label="Returning Customers" value={`${DASHBOARD_STATS.returningCustomers}%`} sub="+5%" color="rose" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500">€{(m.revenue / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-orange-400 rounded-t-md min-h-[4px] transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 140}px` }}
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Selling</h2>
          <div className="space-y-4">
            {TOP_SELLING.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.sales} sales</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">€{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a) => {
              const typeColors: Record<string, string> = {
                order: "bg-blue-400",
                review: "bg-amber-400",
                stock: "bg-rose-400",
                customer: "bg-emerald-400",
                refund: "bg-violet-400",
              };
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColors[a.type] ?? "bg-slate-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{a.message}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-orange-500 hover:text-orange-600 font-medium">View all</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ADMIN_ORDERS.slice(0, 6).map((o) => {
                const statusColors: Record<string, string> = {
                  Processing: "bg-amber-50 text-amber-700",
                  Shipped: "bg-blue-50 text-blue-700",
                  Delivered: "bg-emerald-50 text-emerald-700",
                  Completed: "bg-slate-100 text-slate-700",
                  Refunded: "bg-violet-50 text-violet-700",
                  Cancelled: "bg-rose-50 text-rose-700",
                };
                return (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="py-2.5 font-medium text-slate-900">{o.orderNumber}</td>
                    <td className="py-2.5 text-slate-600">{o.customer}</td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-900">€{o.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
