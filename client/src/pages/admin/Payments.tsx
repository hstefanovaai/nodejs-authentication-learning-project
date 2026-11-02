import { useState } from "react";
import { ADMIN_TRANSACTIONS } from "../../data/admin";

const statusColors: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Refunded: "bg-violet-50 text-violet-700",
  Failed: "bg-rose-50 text-rose-700",
};

const gateways = [
  { name: "Stripe", status: "Connected", icon: "💳", description: "Accept credit/debit cards and other payment methods" },
  { name: "PayPal", status: "Connected", icon: "🅿️", description: "Accept PayPal payments and Pay Later options" },
  { name: "Bank Transfer", status: "Active", icon: "🏦", description: "Direct bank transfer / wire transfer" },
  { name: "Cash on Delivery", status: "Active", icon: "💵", description: "Pay when the order is delivered" },
];

export default function Payments() {
  const [tab, setTab] = useState<"transactions" | "gateways">("transactions");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = ADMIN_TRANSACTIONS.filter((t) => statusFilter === "All" || t.status === statusFilter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-500 mt-1">Transaction logs and payment gateway settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setTab("transactions")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "transactions" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setTab("gateways")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "gateways" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Payment Gateways
        </button>
      </div>

      {tab === "transactions" ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 flex items-center gap-4 border-b border-slate-100">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order ID, customer or transaction ID..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Gateway</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{t.transactionId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{t.orderId}</td>
                    <td className="px-4 py-3 text-slate-600">{t.customer}</td>
                    <td className="px-4 py-3 text-slate-600">{t.gateway}</td>
                    <td className="px-4 py-3 text-slate-600">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">€{t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      {t.status === "Completed" && (
                        <button className="text-violet-500 hover:text-violet-600 text-sm font-medium">Refund</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {gateways.map((gw) => (
            <div key={gw.name} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{gw.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{gw.name}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {gw.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{gw.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Configure
                  </button>
                  <button className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-2">Add another payment gateway</p>
            <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
              + Connect Gateway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
