import { useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_ORDERS, type AdminOrderStatus } from "../../data/admin";

const statusColors: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Completed: "bg-slate-100 text-slate-700",
  Refunded: "bg-violet-50 text-violet-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AdminOrderStatus>("All");
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());

  const filtered = ADMIN_ORDERS.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function toggleSelect(id: number) {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedOrders.size === filtered.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filtered.map((o) => o.id)));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-1">{ADMIN_ORDERS.length} total orders</p>
        </div>
        {selectedOrders.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{selectedOrders.size} selected</span>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Print Invoices
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Print Shipping Labels
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | AdminOrderStatus)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option>All</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Completed</option>
            <option>Refunded</option>
            <option>Cancelled</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-t border-slate-100">
                <th className="px-4 py-3 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(o.id)}
                      onChange={() => toggleSelect(o.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-slate-900">{o.customer}</p>
                      <p className="text-xs text-slate-400">{o.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{o.date}</td>
                  <td className="px-4 py-3 text-slate-600">{o.items}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">€{o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/orders/${o.id}`} className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">No orders match your filters.</div>
        )}
      </div>
    </div>
  );
}
