import { useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_CUSTOMERS } from "../../data/admin";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Banned: "bg-rose-50 text-rose-700",
  Inactive: "bg-slate-100 text-slate-600",
};

export default function CustomersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = ADMIN_CUSTOMERS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-500 mt-1">{ADMIN_CUSTOMERS.length} registered customers</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Banned</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-t border-slate-100">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Total Spent</th>
                <th className="px-4 py-3 font-medium">Last Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.city}</td>
                  <td className="px-4 py-3 text-slate-600">{c.orders}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">€{c.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{c.lastOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/customers/${c.id}`} className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">No customers match your filters.</div>
        )}
      </div>
    </div>
  );
}
