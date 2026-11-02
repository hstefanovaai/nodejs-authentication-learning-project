import { Link, useParams } from "react-router-dom";
import { ADMIN_ORDERS } from "../../data/admin";
import { BOOKS } from "../../data/books";

const statusColors: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-100 text-slate-700 border-slate-200",
  Refunded: "bg-violet-50 text-violet-700 border-violet-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const ALL_STATUSES = ["Processing", "Shipped", "Delivered", "Completed", "Refunded", "Cancelled"];

export default function OrderDetail() {
  const { id } = useParams();
  const order = ADMIN_ORDERS.find((o) => o.id === Number(id));

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 text-lg">Order not found</p>
        <Link to="/admin/orders" className="text-orange-500 hover:text-orange-600 font-medium mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  const orderItems = Array.from({ length: order.items }, (_, i) => {
    const book = BOOKS[(order.id + i * 3) % BOOKS.length];
    const qty = 1 + (i % 3);
    return { book, qty, subtotal: book.price * qty };
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders" className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Order {order.orderNumber}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-slate-500 mt-0.5">Placed on {order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Print Invoice
          </button>
          <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Print Label
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Line Items */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium text-center">Quantity</th>
                  <th className="pb-3 font-medium text-right">Price</th>
                  <th className="pb-3 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orderItems.map((item, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-3">
                      <p className="font-medium text-slate-900">{item.book.title}</p>
                      <p className="text-xs text-slate-400">{item.book.author}</p>
                    </td>
                    <td className="py-3 text-center text-slate-600">{item.qty}</td>
                    <td className="py-3 text-right text-slate-600">€{item.book.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-slate-900">€{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200">
                  <td colSpan={3} className="py-2 text-right text-sm text-slate-500">Subtotal</td>
                  <td className="py-2 text-right text-sm font-medium text-slate-900">
                    €{orderItems.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-1 text-right text-sm text-slate-500">Shipping</td>
                  <td className="py-1 text-right text-sm text-slate-900">€1.49</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td colSpan={3} className="py-3 text-right text-sm font-semibold text-slate-900">Total</td>
                  <td className="py-3 text-right text-lg font-bold text-slate-900">€{order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {[
                { date: order.date, time: "10:23", event: "Order placed", done: true },
                { date: order.date, time: "10:24", event: "Payment confirmed via " + order.paymentMethod, done: order.status !== "Cancelled" },
                { date: order.date, time: "14:00", event: "Order confirmed and sent to fulfillment", done: ["Shipped", "Delivered", "Completed"].includes(order.status) },
                { date: "", time: "", event: "Shipped via courier", done: ["Shipped", "Delivered", "Completed"].includes(order.status) },
                { date: "", time: "", event: "Delivered to customer", done: ["Delivered", "Completed"].includes(order.status) },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${step.done ? "bg-emerald-400" : "bg-slate-200"}`} />
                  <div>
                    <p className={`text-sm ${step.done ? "text-slate-900" : "text-slate-400"}`}>{step.event}</p>
                    {step.date && <p className="text-xs text-slate-400">{step.date} at {step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update Status</h2>
            <select
              defaultValue={order.status}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 mb-3"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Update Status
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{order.customer}</p>
                <p className="text-xs text-slate-400">{order.email}</p>
              </div>
              <Link to="/admin/customers/1" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                View customer profile
              </Link>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Shipping</h2>
            <div className="space-y-2 text-sm">
              <p className="text-slate-900 font-medium">{order.customer}</p>
              <p className="text-slate-600">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total</span>
                <span className="text-slate-900 font-bold">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status !== "Refunded" && order.status !== "Cancelled" && (
            <button className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Issue Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
