import { Link, useParams } from "react-router-dom";
import { ADMIN_CUSTOMERS, ADMIN_ORDERS } from "../../data/admin";

export default function CustomerDetail() {
  const { id } = useParams();
  const customer = ADMIN_CUSTOMERS.find((c) => c.id === Number(id));

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 text-lg">Customer not found</p>
        <Link to="/admin/customers" className="text-orange-500 hover:text-orange-600 font-medium mt-2 inline-block">
          Back to customers
        </Link>
      </div>
    );
  }

  const customerOrders = ADMIN_ORDERS.filter((o) => o.customer === customer.name).slice(0, 10);

  const statusColors: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Banned: "bg-rose-50 text-rose-700 border-rose-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const orderStatusColors: Record<string, string> = {
    Processing: "bg-amber-50 text-amber-700",
    Shipped: "bg-blue-50 text-blue-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Completed: "bg-slate-100 text-slate-700",
    Refunded: "bg-violet-50 text-violet-700",
    Cancelled: "bg-rose-50 text-rose-700",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/customers" className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[customer.status]}`}>
              {customer.status}
            </span>
          </div>
          <p className="text-slate-500 mt-0.5">Member since {customer.joinDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{customer.orders}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">€{customer.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 mb-1">Avg. Order</p>
              <p className="text-2xl font-bold text-slate-900">€{(customer.totalSpent / customer.orders).toFixed(2)}</p>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order History</h2>
            {customerOrders.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {customerOrders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-100">
                      <td className="py-2.5">
                        <Link to={`/admin/orders/${o.id}`} className="font-medium text-orange-500 hover:text-orange-600">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 text-slate-600">{o.date}</td>
                      <td className="py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${orderStatusColors[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-900">€{o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-slate-400">No orders found for this customer.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-900">{customer.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-900">{customer.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Order</span>
                <span className="text-slate-900">{customer.lastOrder}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Addresses</h2>
            <div className="space-y-4">
              <div className="p-3 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Default</span>
                </div>
                <p className="text-sm text-slate-900">{customer.name}</p>
                <p className="text-sm text-slate-600">42 Example Street</p>
                <p className="text-sm text-slate-600">{customer.city}</p>
                <p className="text-sm text-slate-600">+359 888 123 456</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Reset Password
            </button>
            {customer.status === "Active" ? (
              <button className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Ban Customer
              </button>
            ) : customer.status === "Banned" ? (
              <button className="w-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Unban Customer
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
