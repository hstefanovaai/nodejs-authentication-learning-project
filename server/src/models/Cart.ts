import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

import User from "./User.js";
import Product from "./Product.js";

// Why the cart does NOT store prices: The cart references live products. 
// When a user views their cart, you join to the products table and show the current price. 
// If the price changed since they added it, they see the new price. 
// This is intentional — the cart is not a commitment, it’s a scratchpad. 
// The price only gets locked in when the order is placed

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true, // One active cart per user
  },
});

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
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
      defaultValue: 1,
    },
  },
  {
    indexes: [{ unique: true, fields: ["cartId", "productId"] }], //["cartId", "productId"] prevents a user from having two separate rows for the same product.
    //When they “add to cart” a product that’s already there, you increment the quantity rather than inserting a duplicate row.
  },
);

// Associations
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });
