import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

import Category from "./Category.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(280),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // FLOAT and DOUBLE in MySQL use binary floating point. 0.1 + 0.2 is not exactly 0.3 — it’s 0.30000000000000004.
    // In a financial context, these rounding errors accumulate. You’ll get order totals that are off by a cent,
    // and your accounting won’t reconcile.

    // DECIMAL(10, 2) is the traditional database answer, and it does work correctly.
    // But it introduces a second problem: JavaScript. When Sequelize reads a DECIMAL column, it returns it
    // as a string (like "29.99") to avoid floating-point conversion. You then have to parse it, and every
    // arithmetic operation in your application code risks converting it to a float. You’ll spend time writing
    // or importing a decimal math library.

    // Integers avoid both problems. 2999 is exact. Integer arithmetic in JavaScript is exact
    // (up to Number.MAX_SAFE_INTEGER, which is 9 quadrillion cents — you’re fine). You divide
    // by 100 only at the display layer. Every calculation, comparison, and aggregation happens on integers.

    // The one tradeoff: your API contract needs to be clear. Document that all price fields are
    // in cents and let your React frontend format them with something like (priceCents / 100).toFixed(2).
    // This is a “convention over cleverness” decision that every payment processor (Stripe, Square, etc.) already uses.
    priceCents: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    },
    stockQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    isActive: {
      // You can never hard-delete a product that has been ordered. The order history references it.
      // Soft-deletion via isActive: false keeps the data intact for order records while hiding the product from browsing
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    imageUrl: {
      // TODO: Update it later with image gallery table
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["isActive"] },
      { fields: ["priceCents"] },
      { type: "FULLTEXT", fields: ["name", "description"] },
    ],
  },
);

// Associations
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
