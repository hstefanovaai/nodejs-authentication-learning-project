import { BOOKS } from "./books";

export interface AdminProduct {
  id: number;
  title: string;
  author: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  status: "Active" | "Draft" | "Out of Stock";
  sales: number;
}

export const ADMIN_PRODUCTS: AdminProduct[] = BOOKS.slice(0, 30).map((b, i) => ({
  id: b.id,
  title: b.title,
  author: b.author,
  price: b.price,
  sku: `BK-${String(b.id).padStart(5, "0")}`,
  stock: [120, 0, 45, 8, 200, 3, 67, 0, 150, 12, 88, 5, 300, 25, 0, 90, 42, 7, 160, 55, 0, 33, 78, 110, 15, 200, 60, 2, 95, 140][i],
  category: b.category,
  status: [120, 0, 45, 8, 200, 3, 67, 0, 150, 12, 88, 5, 300, 25, 0, 90, 42, 7, 160, 55, 0, 33, 78, 110, 15, 200, 60, 2, 95, 140][i] === 0
    ? "Out of Stock"
    : i % 7 === 0
      ? "Draft"
      : "Active",
  sales: Math.floor(b.popularity * 3.7 + i * 11),
}));

export type AdminOrderStatus = "Processing" | "Shipped" | "Delivered" | "Completed" | "Refunded" | "Cancelled";

export interface AdminOrder {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: AdminOrderStatus;
  items: number;
  paymentMethod: string;
  shippingAddress: string;
}

const CUSTOMER_NAMES = [
  "Elena Petrova", "Marcus Chen", "Sofia Rodriguez", "James Wilson",
  "Aisha Patel", "Oliver Schmidt", "Mia Tanaka", "Lucas Silva",
  "Emma Johansson", "Noah Kim", "Isabella Costa", "Liam O'Brien",
  "Charlotte Müller", "Ethan Park", "Amelia Dubois", "Alexander Ivanov",
  "Grace Nakamura", "Benjamin Torres", "Lily Andersson", "Daniel Lee",
];

const ADDRESSES = [
  "123 Main St, London, UK", "456 Oak Ave, Berlin, DE", "789 Pine Rd, Paris, FR",
  "321 Elm St, Sofia, BG", "654 Maple Dr, Vienna, AT", "987 Cedar Ln, Madrid, ES",
  "147 Birch Way, Rome, IT", "258 Walnut Ct, Amsterdam, NL", "369 Spruce Pl, Stockholm, SE",
  "741 Ash Blvd, Prague, CZ",
];

const PAYMENT_METHODS = ["Visa •••• 4242", "Mastercard •••• 8210", "PayPal", "Cash on Delivery", "Stripe", "Bank Transfer"];

export const ADMIN_ORDERS: AdminOrder[] = Array.from({ length: 50 }, (_, i) => {
  const id = 50 - i;
  const d = new Date(2026, 9, 30);
  d.setDate(d.getDate() - i * 2);
  const statuses: AdminOrderStatus[] = ["Processing", "Shipped", "Delivered", "Completed", "Refunded", "Cancelled"];
  return {
    id,
    orderNumber: `ORD-${String(10000 + id).slice(1)}`,
    customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
    email: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length].toLowerCase().replace(/[' ]/g, ".") + "@email.com",
    date: d.toISOString().slice(0, 10),
    total: Math.round((15 + Math.random() * 180) * 100) / 100,
    status: i < 3 ? "Processing" : i < 8 ? "Shipped" : i < 30 ? "Delivered" : i < 40 ? "Completed" : i < 45 ? "Refunded" : "Cancelled",
    items: 1 + (i % 5),
    paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    shippingAddress: ADDRESSES[i % ADDRESSES.length],
  };
});

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: "Active" | "Banned" | "Inactive";
  lastOrder: string;
  city: string;
}

export const ADMIN_CUSTOMERS: AdminCustomer[] = CUSTOMER_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  email: name.toLowerCase().replace(/[' ]/g, ".") + "@email.com",
  joinDate: new Date(2024, i % 12, 1 + i).toISOString().slice(0, 10),
  orders: Math.floor(Math.random() * 25) + 1,
  totalSpent: Math.round((50 + Math.random() * 2000) * 100) / 100,
  status: i === 5 ? "Banned" : i === 11 ? "Inactive" : "Active",
  lastOrder: new Date(2026, 9, 30 - i * 3).toISOString().slice(0, 10),
  city: ADDRESSES[i % ADDRESSES.length].split(", ")[1],
}));

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  parentId: number | null;
  order: number;
}

export const ADMIN_CATEGORIES: AdminCategory[] = [
  { id: 1, name: "Fiction", slug: "fiction", productCount: 5, parentId: null, order: 1 },
  { id: 2, name: "Literary Fiction", slug: "literary-fiction", productCount: 3, parentId: 1, order: 1 },
  { id: 3, name: "Historical Fiction", slug: "historical-fiction", productCount: 2, parentId: 1, order: 2 },
  { id: 4, name: "Non-Fiction", slug: "non-fiction", productCount: 5, parentId: null, order: 2 },
  { id: 5, name: "Memoirs", slug: "memoirs", productCount: 3, parentId: 4, order: 1 },
  { id: 6, name: "Essays", slug: "essays", productCount: 2, parentId: 4, order: 2 },
  { id: 7, name: "Science Fiction", slug: "science-fiction", productCount: 5, parentId: null, order: 3 },
  { id: 8, name: "Fantasy", slug: "fantasy", productCount: 5, parentId: null, order: 4 },
  { id: 9, name: "Mystery & Thriller", slug: "mystery-thriller", productCount: 5, parentId: null, order: 5 },
  { id: 10, name: "Romance", slug: "romance", productCount: 5, parentId: null, order: 6 },
  { id: 11, name: "Biography", slug: "biography", productCount: 5, parentId: null, order: 7 },
  { id: 12, name: "History", slug: "history", productCount: 5, parentId: null, order: 8 },
  { id: 13, name: "Science", slug: "science", productCount: 5, parentId: null, order: 9 },
  { id: 14, name: "Self-Help", slug: "self-help", productCount: 5, parentId: null, order: 10 },
  { id: 15, name: "Children's Books", slug: "childrens-books", productCount: 5, parentId: null, order: 11 },
  { id: 16, name: "Poetry", slug: "poetry", productCount: 5, parentId: null, order: 12 },
];

export interface AdminCollection {
  id: number;
  name: string;
  description: string;
  productCount: number;
  status: "Active" | "Draft" | "Scheduled";
  startDate?: string;
  endDate?: string;
}

export const ADMIN_COLLECTIONS: AdminCollection[] = [
  { id: 1, name: "Summer Reading", description: "Best picks for summer 2026", productCount: 12, status: "Active", startDate: "2026-06-01", endDate: "2026-09-30" },
  { id: 2, name: "Best Sellers", description: "Top selling books of all time", productCount: 20, status: "Active" },
  { id: 3, name: "Staff Picks", description: "Curated by our team", productCount: 8, status: "Active" },
  { id: 4, name: "New Arrivals", description: "Latest additions to our catalog", productCount: 15, status: "Active" },
  { id: 5, name: "Holiday Gift Guide", description: "Perfect gifts for book lovers", productCount: 10, status: "Draft" },
  { id: 6, name: "Back to School", description: "Essential reads for students", productCount: 18, status: "Scheduled", startDate: "2027-01-15", endDate: "2027-02-28" },
];

export interface AdminDiscount {
  id: number;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  status: "Active" | "Expired" | "Scheduled";
  startDate: string;
  endDate: string;
  appliesTo: string;
}

export const ADMIN_DISCOUNTS: AdminDiscount[] = [
  { id: 1, code: "SUMMER20", type: "Percentage", value: 20, minOrder: 30, usageLimit: 500, used: 342, status: "Active", startDate: "2026-06-01", endDate: "2026-12-31", appliesTo: "All Products" },
  { id: 2, code: "WELCOME10", type: "Percentage", value: 10, minOrder: 0, usageLimit: 0, used: 1205, status: "Active", startDate: "2026-01-01", endDate: "2027-01-01", appliesTo: "All Products" },
  { id: 3, code: "FICTION5", type: "Fixed Amount", value: 5, minOrder: 25, usageLimit: 200, used: 88, status: "Active", startDate: "2026-09-01", endDate: "2026-11-30", appliesTo: "Fiction" },
  { id: 4, code: "HOLIDAY25", type: "Percentage", value: 25, minOrder: 50, usageLimit: 300, used: 0, status: "Scheduled", startDate: "2026-12-01", endDate: "2026-12-31", appliesTo: "All Products" },
  { id: 5, code: "FREESHIP", type: "Fixed Amount", value: 4.99, minOrder: 40, usageLimit: 1000, used: 756, status: "Active", startDate: "2026-01-01", endDate: "2026-12-31", appliesTo: "Shipping" },
  { id: 6, code: "SCIFI15", type: "Percentage", value: 15, minOrder: 20, usageLimit: 100, used: 100, status: "Expired", startDate: "2026-03-01", endDate: "2026-06-30", appliesTo: "Science Fiction" },
  { id: 7, code: "BDAY30", type: "Percentage", value: 30, minOrder: 0, usageLimit: 50, used: 12, status: "Active", startDate: "2026-10-01", endDate: "2026-10-31", appliesTo: "All Products" },
  { id: 8, code: "FLASH50", type: "Percentage", value: 50, minOrder: 100, usageLimit: 20, used: 20, status: "Expired", startDate: "2026-08-15", endDate: "2026-08-15", appliesTo: "All Products" },
];

export interface ShippingZone {
  id: number;
  name: string;
  countries: string[];
  rates: { method: string; type: "Flat" | "Weight-based" | "Price-based"; cost: number; freeAbove?: number }[];
}

export const ADMIN_SHIPPING_ZONES: ShippingZone[] = [
  { id: 1, name: "Domestic (Bulgaria)", countries: ["Bulgaria"], rates: [
    { method: "Standard (3-5 days)", type: "Flat", cost: 1.49, freeAbove: 30 },
    { method: "Express (1-2 days)", type: "Flat", cost: 4.99 },
    { method: "Same-day Delivery", type: "Flat", cost: 9.99 },
  ]},
  { id: 2, name: "EU Countries", countries: ["Germany", "France", "Italy", "Spain", "Netherlands", "Austria", "Sweden"], rates: [
    { method: "Standard (5-10 days)", type: "Weight-based", cost: 5.99, freeAbove: 75 },
    { method: "Express (3-5 days)", type: "Flat", cost: 12.99 },
  ]},
  { id: 3, name: "UK", countries: ["United Kingdom"], rates: [
    { method: "Standard (7-14 days)", type: "Flat", cost: 8.99, freeAbove: 100 },
    { method: "Express (5-7 days)", type: "Flat", cost: 15.99 },
  ]},
  { id: 4, name: "Rest of World", countries: ["USA", "Canada", "Australia", "Japan"], rates: [
    { method: "Standard (14-21 days)", type: "Weight-based", cost: 14.99 },
    { method: "Express (7-10 days)", type: "Flat", cost: 24.99 },
  ]},
];

export interface AdminTransaction {
  id: number;
  orderId: string;
  customer: string;
  amount: number;
  gateway: string;
  status: "Completed" | "Pending" | "Refunded" | "Failed";
  date: string;
  transactionId: string;
}

export const ADMIN_TRANSACTIONS: AdminTransaction[] = Array.from({ length: 25 }, (_, i) => {
  const gateways = ["Stripe", "PayPal", "Bank Transfer", "Cash on Delivery"];
  const statuses: AdminTransaction["status"][] = ["Completed", "Completed", "Completed", "Pending", "Refunded", "Failed"];
  const d = new Date(2026, 9, 30);
  d.setDate(d.getDate() - i);
  return {
    id: i + 1,
    orderId: `ORD-${String(10000 + 50 - i).slice(1)}`,
    customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
    amount: Math.round((15 + Math.random() * 180) * 100) / 100,
    gateway: gateways[i % gateways.length],
    status: statuses[i % statuses.length],
    date: d.toISOString().slice(0, 10),
    transactionId: `TXN-${String(Math.random()).slice(2, 14)}`,
  };
});

export interface AdminReview {
  id: number;
  productId: number;
  productTitle: string;
  customer: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

export const ADMIN_REVIEWS: AdminReview[] = [
  { id: 1, productId: 12, productTitle: "Project Hail Mary", customer: "Elena Petrova", rating: 5, title: "Absolutely incredible!", comment: "One of the best sci-fi books I've ever read. Couldn't put it down.", date: "2026-10-28", status: "Approved" },
  { id: 2, productId: 46, productTitle: "Atomic Habits", customer: "Marcus Chen", rating: 4, title: "Very practical advice", comment: "Great framework for building habits. Some parts felt repetitive but overall excellent.", date: "2026-10-27", status: "Approved" },
  { id: 3, productId: 11, productTitle: "Dune", customer: "Sofia Rodriguez", rating: 5, title: "A masterpiece", comment: "Herbert's world-building is unmatched. The political intrigue is fascinating.", date: "2026-10-26", status: "Pending" },
  { id: 4, productId: 3, productTitle: "The Great Gatsby", customer: "James Wilson", rating: 2, title: "Overrated", comment: "I don't understand the hype. The characters are all terrible people.", date: "2026-10-25", status: "Pending" },
  { id: 5, productId: 51, productTitle: "Harry Potter and the Sorcerer's Stone", customer: "Aisha Patel", rating: 5, title: "Timeless classic", comment: "Re-read it for the fifth time and it still feels magical.", date: "2026-10-24", status: "Approved" },
  { id: 6, productId: 22, productTitle: "Gone Girl", customer: "Oliver Schmidt", rating: 4, title: "Twisted and gripping", comment: "The plot twists kept me guessing. Dark but brilliant.", date: "2026-10-23", status: "Approved" },
  { id: 7, productId: 36, productTitle: "Sapiens", customer: "Mia Tanaka", rating: 3, title: "Interesting but biased", comment: "Some interesting ideas but Harari makes sweeping claims without enough evidence.", date: "2026-10-22", status: "Pending" },
  { id: 8, productId: 1, productTitle: "The Midnight Library", customer: "Lucas Silva", rating: 1, title: "Disappointing", comment: "The premise is great but the execution is shallow. Felt like a self-help book disguised as fiction.", date: "2026-10-21", status: "Rejected" },
  { id: 9, productId: 19, productTitle: "The Way of Kings", customer: "Emma Johansson", rating: 5, title: "Epic fantasy at its finest", comment: "Sanderson delivers an incredible start to the Stormlight Archive. The magic system is brilliant.", date: "2026-10-20", status: "Approved" },
  { id: 10, productId: 31, productTitle: "Becoming", customer: "Noah Kim", rating: 5, title: "Inspiring and honest", comment: "Michelle Obama's memoir is both heartwarming and empowering. A must-read.", date: "2026-10-19", status: "Approved" },
  { id: 11, productId: 41, productTitle: "A Brief History of Time", customer: "Isabella Costa", rating: 4, title: "Mind-blowing", comment: "Hawking makes complex physics accessible. Some chapters require re-reading though.", date: "2026-10-18", status: "Pending" },
  { id: 12, productId: 5, productTitle: "Circe", customer: "Liam O'Brien", rating: 5, title: "Beautiful retelling", comment: "Miller brings Greek mythology to life with gorgeous prose. Circe is an unforgettable character.", date: "2026-10-17", status: "Approved" },
];

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor" | "Fulfillment";
  status: "Active" | "Inactive";
  lastLogin: string;
}

export const ADMIN_USERS: AdminUser[] = [
  { id: 1, name: "Admin User", email: "admin@bookstore.com", role: "Super Admin", status: "Active", lastLogin: "2026-10-30" },
  { id: 2, name: "Sarah Editor", email: "sarah@bookstore.com", role: "Editor", status: "Active", lastLogin: "2026-10-29" },
  { id: 3, name: "John Fulfillment", email: "john@bookstore.com", role: "Fulfillment", status: "Active", lastLogin: "2026-10-28" },
  { id: 4, name: "Maria Admin", email: "maria@bookstore.com", role: "Admin", status: "Active", lastLogin: "2026-10-27" },
  { id: 5, name: "Tom Editor", email: "tom@bookstore.com", role: "Editor", status: "Inactive", lastLogin: "2026-09-15" },
  { id: 6, name: "Lisa Fulfillment", email: "lisa@bookstore.com", role: "Fulfillment", status: "Active", lastLogin: "2026-10-30" },
];

export const DASHBOARD_STATS = {
  totalOrders: 1247,
  revenue: 28459.92,
  newCustomers: 48,
  lowStockProducts: 6,
  pendingOrders: 12,
  conversionRate: 3.2,
  avgOrderValue: 22.82,
  returningCustomers: 62,
};

export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 18200, orders: 95 },
  { month: "Feb", revenue: 21400, orders: 112 },
  { month: "Mar", revenue: 19800, orders: 103 },
  { month: "Apr", revenue: 24500, orders: 128 },
  { month: "May", revenue: 22100, orders: 115 },
  { month: "Jun", revenue: 26800, orders: 140 },
  { month: "Jul", revenue: 23500, orders: 122 },
  { month: "Aug", revenue: 25200, orders: 131 },
  { month: "Sep", revenue: 27800, orders: 145 },
  { month: "Oct", revenue: 28459, orders: 152 },
];

export const TOP_SELLING = ADMIN_PRODUCTS.sort((a, b) => b.sales - a.sales).slice(0, 5);

export const RECENT_ACTIVITY = [
  { id: 1, type: "order", message: "New order #ORD-0050 placed by Elena Petrova", time: "2 minutes ago" },
  { id: 2, type: "review", message: "New review pending for 'Project Hail Mary'", time: "15 minutes ago" },
  { id: 3, type: "stock", message: "Low stock alert: 'The Immortal Life of Henrietta Lacks' (0 units)", time: "1 hour ago" },
  { id: 4, type: "customer", message: "New customer registered: Daniel Lee", time: "2 hours ago" },
  { id: 5, type: "order", message: "Order #ORD-0048 shipped via Speedy", time: "3 hours ago" },
  { id: 6, type: "refund", message: "Refund processed for order #ORD-0035 (€45.90)", time: "5 hours ago" },
  { id: 7, type: "stock", message: "Low stock alert: 'Neuromancer' (0 units)", time: "6 hours ago" },
  { id: 8, type: "order", message: "Order #ORD-0047 marked as delivered", time: "8 hours ago" },
];
