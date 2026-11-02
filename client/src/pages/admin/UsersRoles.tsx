import { useState } from "react";
import { ADMIN_USERS } from "../../data/admin";

const roleColors: Record<string, string> = {
  "Super Admin": "bg-rose-50 text-rose-700",
  Admin: "bg-orange-50 text-orange-700",
  Editor: "bg-blue-50 text-blue-700",
  Fulfillment: "bg-emerald-50 text-emerald-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
};

const ROLE_PERMISSIONS = [
  { permission: "View Dashboard", superAdmin: true, admin: true, editor: true, fulfillment: true },
  { permission: "Manage Products", superAdmin: true, admin: true, editor: true, fulfillment: false },
  { permission: "Manage Orders", superAdmin: true, admin: true, editor: false, fulfillment: true },
  { permission: "View Customers", superAdmin: true, admin: true, editor: true, fulfillment: true },
  { permission: "Manage Customers", superAdmin: true, admin: true, editor: false, fulfillment: false },
  { permission: "Manage Categories", superAdmin: true, admin: true, editor: true, fulfillment: false },
  { permission: "Manage Discounts", superAdmin: true, admin: true, editor: false, fulfillment: false },
  { permission: "Manage Shipping", superAdmin: true, admin: true, editor: false, fulfillment: true },
  { permission: "View Payments", superAdmin: true, admin: true, editor: false, fulfillment: false },
  { permission: "Manage Refunds", superAdmin: true, admin: true, editor: false, fulfillment: false },
  { permission: "Moderate Reviews", superAdmin: true, admin: true, editor: true, fulfillment: false },
  { permission: "View Analytics", superAdmin: true, admin: true, editor: true, fulfillment: false },
  { permission: "Manage Settings", superAdmin: true, admin: false, editor: false, fulfillment: false },
  { permission: "Manage Users & Roles", superAdmin: true, admin: false, editor: false, fulfillment: false },
];

export default function UsersRoles() {
  const [tab, setTab] = useState<"users" | "roles">("users");
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1">Manage admin accounts and permissions</p>
        </div>
        {tab === "users" && (
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            + Invite User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "users" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("roles")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "roles" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Roles & Permissions
        </button>
      </div>

      {tab === "users" && (
        <>
          {/* Invite Form */}
          {showInviteForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Invite New Admin User</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Fulfillment</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Send Invitation
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Last Login</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {ADMIN_USERS.map((u) => (
                    <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[u.status]}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.lastLogin}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Edit</button>
                        {u.role !== "Super Admin" && (
                          <button className="text-rose-500 hover:text-rose-600 text-sm font-medium">Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "roles" && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Role Permissions Matrix</h2>
            <p className="text-sm text-slate-500 mt-0.5">Defines what each role can access</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Permission</th>
                  <th className="px-6 py-3 font-medium text-center">Super Admin</th>
                  <th className="px-6 py-3 font-medium text-center">Admin</th>
                  <th className="px-6 py-3 font-medium text-center">Editor</th>
                  <th className="px-6 py-3 font-medium text-center">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ROLE_PERMISSIONS.map((rp) => (
                  <tr key={rp.permission} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium text-slate-900">{rp.permission}</td>
                    {[rp.superAdmin, rp.admin, rp.editor, rp.fulfillment].map((allowed, i) => (
                      <td key={i} className="px-6 py-3 text-center">
                        {allowed ? (
                          <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
