import { useState } from "react";

export default function Settings() {
  const [tab, setTab] = useState<"general" | "tax" | "email" | "notifications">("general");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Store-wide configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        {(["general", "tax", "email", "notifications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="space-y-6">
          {/* Store Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Store Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  defaultValue="Bookstore"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store URL</label>
                <input
                  type="text"
                  defaultValue="https://bookstore.example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  defaultValue="hello@bookstore.example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Phone</label>
                <input
                  type="text"
                  defaultValue="+359 2 123 4567"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Store Logo</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                B
              </div>
              <div>
                <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Upload Logo
                </button>
                <p className="text-xs text-slate-400 mt-1">PNG or SVG, max 2MB. Recommended: 200x200px</p>
              </div>
            </div>
          </div>

          {/* Regional */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Regional Settings</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select
                  defaultValue="EUR"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="BGN">Bulgarian Lev (лв)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select
                  defaultValue="Europe/Sofia"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Europe/Sofia">Europe/Sofia (UTC+2)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="Europe/Berlin">Europe/Berlin (UTC+1)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight Unit</label>
                <select
                  defaultValue="g"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {tab === "tax" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tax Rules</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Bulgaria (VAT)</p>
                  <p className="text-sm text-slate-500">Standard rate for books</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">9%</span>
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">EU Countries (VAT)</p>
                  <p className="text-sm text-slate-500">Varies by country</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">7-25%</span>
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">UK (VAT)</p>
                  <p className="text-sm text-slate-500">Zero-rated for printed books</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">0%</span>
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Rest of World</p>
                  <p className="text-sm text-slate-500">No tax collected</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">0%</span>
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium">+ Add tax rule</button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Prices Include Tax</h2>
                <p className="text-sm text-slate-500 mt-1">Display prices with tax included</p>
              </div>
              <div className="w-11 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "email" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Templates</h2>
            <div className="space-y-3">
              {[
                { name: "Order Confirmation", description: "Sent when an order is placed", enabled: true },
                { name: "Shipping Notification", description: "Sent when an order is shipped", enabled: true },
                { name: "Delivery Confirmation", description: "Sent when an order is delivered", enabled: true },
                { name: "Refund Notification", description: "Sent when a refund is processed", enabled: true },
                { name: "Welcome Email", description: "Sent when a new customer registers", enabled: true },
                { name: "Password Reset", description: "Sent for password reset requests", enabled: true },
                { name: "Abandoned Cart", description: "Reminder for incomplete orders", enabled: false },
                { name: "Review Request", description: "Ask customer to review their purchase", enabled: false },
              ].map((template) => (
                <div key={template.name} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${template.enabled ? "bg-emerald-400" : "bg-slate-300"}`} />
                    <div>
                      <p className="font-medium text-slate-900">{template.name}</p>
                      <p className="text-sm text-slate-500">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                    <button className="text-slate-400 hover:text-slate-600 text-sm font-medium">Preview</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">SMTP Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
                <input
                  type="text"
                  defaultValue="587"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  defaultValue="noreply@bookstore.example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Save SMTP Settings
              </button>
              <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Send Test Email
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "New order placed", description: "Get notified when a customer places an order", enabled: true },
              { label: "Low stock alert", description: "Alert when product stock falls below threshold", enabled: true },
              { label: "New customer registration", description: "Notify when a new customer signs up", enabled: false },
              { label: "New review submitted", description: "Get notified when a customer submits a review", enabled: true },
              { label: "Refund requested", description: "Alert when a customer requests a refund", enabled: true },
              { label: "Daily sales summary", description: "Receive a daily email with sales summary", enabled: false },
              { label: "Weekly analytics report", description: "Weekly digest of store performance", enabled: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{n.label}</p>
                  <p className="text-xs text-slate-500">{n.description}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-orange-500" : "bg-slate-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${n.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                defaultValue={10}
                className="w-32 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <span className="text-sm text-slate-500">units</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
