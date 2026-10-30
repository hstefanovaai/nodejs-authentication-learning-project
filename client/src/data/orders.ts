import { BOOKS } from "./books";

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

export interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

export interface TrackingEvent {
  date: string;
  time: string;
  description: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  deliveryDate?: string;
  expectedDelivery?: string;
  courier?: string;
  shippingCost?: number;
  paymentMethod?: string;
  trackingEvents?: TrackingEvent[];
}

function pickBooks(seed: number, count: number): OrderItem[] {
  const items: OrderItem[] = [];
  for (let i = 0; i < count; i++) {
    const book = BOOKS[(seed + i * 7) % BOOKS.length];
    const qty = ((seed + i) % 3) + 1;
    items.push({ bookId: book.id, title: book.title, quantity: qty, price: book.price });
  }
  return items;
}

function total(items: OrderItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

const COURIERS = ["FedEx", "UPS", "DHL", "Speedy", "Econt"];
const PAYMENT_METHODS = ["Visa •••• 4242", "Mastercard •••• 8210", "PayPal", "Cash on Delivery"];

function buildTrackingEvents(
  orderDate: string,
  status: OrderStatus,
  deliveryDate?: string,
): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const d = new Date(orderDate);

  events.push({
    date: orderDate,
    time: `${9 + (d.getDate() % 8)}:${String(d.getMonth() * 7 % 60).padStart(2, "0")}`,
    description: "Order placed",
  });

  if (status === "Cancelled") {
    const cancel = new Date(d);
    cancel.setDate(cancel.getDate() + 1);
    events.push({
      date: cancel.toISOString().slice(0, 10),
      time: "14:22",
      description: "Order cancelled",
    });
    return events;
  }

  if (status === "Processing") return events;

  const ship = new Date(d);
  ship.setDate(ship.getDate() + 1);
  events.push({
    date: ship.toISOString().slice(0, 10),
    time: "09:37",
    description: "Shipped to logistics center",
  });

  events.push({
    date: ship.toISOString().slice(0, 10),
    time: "18:09",
    description: "Handed over to courier",
  });

  if (status === "Delivered" && deliveryDate) {
    events.push({
      date: deliveryDate,
      time: "21:27",
      description: "Order delivered",
    });
  }

  return events;
}

interface RawOrder {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryDate?: string;
  expectedDelivery?: string;
  courier?: string;
}

const raw: RawOrder[] = [
  { id: 1, orderNumber: "15635258", date: "2026-09-23", status: "Delivered", items: pickBooks(1, 2), deliveryDate: "2026-09-25" },
  { id: 2, orderNumber: "15468890", date: "2026-09-03", status: "Shipped", items: pickBooks(5, 3), expectedDelivery: "Sep 11 – Sep 12", courier: "Speedy" },
  { id: 3, orderNumber: "15401122", date: "2026-08-18", status: "Delivered", items: pickBooks(9, 1), deliveryDate: "2026-08-21" },
  { id: 4, orderNumber: "15322010", date: "2026-07-05", status: "Cancelled", items: pickBooks(12, 2) },
  { id: 5, orderNumber: "15210445", date: "2026-06-14", status: "Delivered", items: pickBooks(3, 4), deliveryDate: "2026-06-18" },
  { id: 6, orderNumber: "15100332", date: "2026-05-02", status: "Delivered", items: pickBooks(8, 1), deliveryDate: "2026-05-05" },
  { id: 7, orderNumber: "14988776", date: "2026-03-22", status: "Delivered", items: pickBooks(14, 2), deliveryDate: "2026-03-26" },
  { id: 8, orderNumber: "14877210", date: "2026-01-10", status: "Delivered", items: pickBooks(20, 3), deliveryDate: "2026-01-14" },
  { id: 9, orderNumber: "14750098", date: "2025-11-29", status: "Delivered", items: pickBooks(2, 2), deliveryDate: "2025-12-03" },
  { id: 10, orderNumber: "14622334", date: "2025-09-15", status: "Delivered", items: pickBooks(6, 1), deliveryDate: "2025-09-18" },
  { id: 11, orderNumber: "14500112", date: "2025-06-08", status: "Delivered", items: pickBooks(11, 3), deliveryDate: "2025-06-12" },
  { id: 12, orderNumber: "14388990", date: "2025-03-19", status: "Cancelled", items: pickBooks(17, 1) },
  { id: 13, orderNumber: "14200445", date: "2024-12-20", status: "Delivered", items: pickBooks(22, 2), deliveryDate: "2024-12-24" },
  { id: 14, orderNumber: "14100223", date: "2024-08-11", status: "Delivered", items: pickBooks(30, 1), deliveryDate: "2024-08-14" },
  { id: 15, orderNumber: "13988110", date: "2024-04-05", status: "Delivered", items: pickBooks(35, 4), deliveryDate: "2024-04-10" },
  { id: 16, orderNumber: "13800556", date: "2024-01-22", status: "Delivered", items: pickBooks(40, 2), deliveryDate: "2024-01-26" },
  { id: 17, orderNumber: "13655443", date: "2023-10-14", status: "Delivered", items: pickBooks(15, 1), deliveryDate: "2023-10-18" },
  { id: 18, orderNumber: "13500221", date: "2023-06-30", status: "Delivered", items: pickBooks(25, 3), deliveryDate: "2023-07-04" },
  { id: 19, orderNumber: "13400110", date: "2023-02-17", status: "Delivered", items: pickBooks(33, 2), deliveryDate: "2023-02-21" },
  { id: 20, orderNumber: "14950001", date: "2026-10-28", status: "Processing", items: pickBooks(7, 2) },
  { id: 21, orderNumber: "14960055", date: "2026-10-15", status: "Delivered", items: pickBooks(19, 1), deliveryDate: "2026-10-18" },
];

export const ORDERS: Order[] = raw
  .map((o) => ({
    ...o,
    total: total(o.items),
    shippingCost: o.items.length > 2 ? 0 : 1.49,
    paymentMethod: PAYMENT_METHODS[o.id % PAYMENT_METHODS.length],
    courier: o.courier || COURIERS[o.id % COURIERS.length],
    trackingEvents: buildTrackingEvents(o.date, o.status, o.deliveryDate),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));
