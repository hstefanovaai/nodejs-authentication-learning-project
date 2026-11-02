import { Link, useParams } from "react-router-dom";
import { ADMIN_PRODUCTS } from "../../data/admin";
import { CATEGORIES } from "../../data/books";

export default function ProductEdit() {
  const { id } = useParams();
  const product = id && id !== "new" ? ADMIN_PRODUCTS.find((p) => p.id === Number(id)) : null;
  const isNew = id === "new";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isNew ? "Add New Product" : "Edit Product"}</h1>
          {product && <p className="text-slate-500 mt-0.5">{product.sku}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  defaultValue={product?.title ?? ""}
                  placeholder="Enter product title"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <input
                  type="text"
                  defaultValue={product?.author ?? ""}
                  placeholder="Enter author name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={5}
                  defaultValue={product ? `A captivating book by ${product.author}. This ${product.category.toLowerCase()} title has become a favorite among readers worldwide.` : ""}
                  placeholder="Enter product description"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={product?.price ?? ""}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Compare-at Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input
                  type="text"
                  defaultValue={product?.sku ?? ""}
                  placeholder="BK-00000"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  defaultValue={product?.stock ?? ""}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (g)</label>
                <input
                  type="number"
                  defaultValue="350"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                <input
                  type="text"
                  defaultValue={product ? `978-0-${String(product.id).padStart(3, "0")}-${String(product.id * 7).padStart(5, "0")}-${product.id % 10}` : ""}
                  placeholder="978-0-000-00000-0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  defaultValue={product ? `${product.title} by ${product.author} | Bookstore` : ""}
                  placeholder="SEO page title"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  defaultValue={product ? `Buy ${product.title} by ${product.author}. Fast delivery across Europe. Best price guaranteed.` : ""}
                  placeholder="SEO meta description"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Handle</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-400">/products/</span>
                  <input
                    type="text"
                    defaultValue={product?.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "") ?? ""}
                    placeholder="url-handle"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-slate-500 mb-1">Drag and drop images here, or click to browse</p>
              <p className="text-xs text-slate-400">PNG, JPG up to 5MB each</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Status</h2>
            <select
              defaultValue={product?.status ?? "Draft"}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Out of Stock</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Category</h2>
            <select
              defaultValue={product?.category ?? ""}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tags</h2>
            <input
              type="text"
              placeholder="Add tags separated by commas"
              defaultValue={product ? `${product.category.toLowerCase()}, bestseller` : ""}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {product && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{product.category.toLowerCase()}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">bestseller</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              {isNew ? "Create Product" : "Save Changes"}
            </button>
            {!isNew && (
              <button className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Delete Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
