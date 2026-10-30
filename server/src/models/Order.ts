import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./User.js";
import Product from "./Product.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    // Snapshot of total at time of order, in cents
    totalCents: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
    ],
  },
);

// Why OrderItem duplicates priceCents and productName from the product:
// This is the most important architectural decision in the entire data model.
// An order is a historical record — a receipt. If the product’s price changes tomorrow,
// your order history must still show what the customer actually paid. This is non-negotiable.
// If you reference the live product price, every price update retroactively changes every past order total.
// That’s not just a bug; in many jurisdictions it would be a legal compliance failure.
// The same logic applies to the product name: if an admin renames “Widget Pro” to “Widget Pro v2,”
// past orders should still say what the customer originally bought.

// The productId foreign key is still there even though we snapshot the name and price.
// This lets you link to the product page from order history (“view this product again”)
// and lets admins trace which product an order item refers to. If the product gets soft-deleted,
// the link becomes a reference rather than a navigation, but the order data is self-contained.

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  // SNAPSHOT: price at time of purchase, in cents
  priceCents: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

// Associations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
