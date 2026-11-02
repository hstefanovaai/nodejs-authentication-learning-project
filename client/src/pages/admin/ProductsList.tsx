import { useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_PRODUCTS } from "../../data/admin";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
  "Out of Stock": "bg-rose-50 text-rose-700",
};

export default function ProductsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = ADMIN_PRODUCTS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1">{ADMIN_PRODUCTS.length} products in your catalog</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 mb-6">
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name or SKU..."
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
            <option>Draft</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-t border-slate-100">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Sales</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-400">{p.author}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">€{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-rose-600 font-medium" : p.stock < 10 ? "text-amber-600 font-medium" : "text-slate-600"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.sales}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">No products match your filters.</div>
        )}
      </div>
    </div>
  );
}
