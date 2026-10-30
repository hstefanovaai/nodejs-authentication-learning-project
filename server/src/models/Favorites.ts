import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Product from "./Product.js";
import User from "./User.js";

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  indexes: [
    { unique: true, fields: ['userId', 'productId'] },
  ],
});

// The composite unique index prevents duplicate favorites. Sequelize’s belongsToMany gives 
// you convenience methods like user.addFavorite(product) and user.getFavorites().
// A note on belongsToMany vs explicit hasMany: We use belongsToMany here because favorites 
// are a pure join — no extra data on the relationship. If we later wanted to add notes or a sort order to favorites,
// we'd switch to explicitly defining the Favorite model with hasMany/belongsTo on both sides.

// Associations — through table pattern
User.belongsToMany(Product, { through: Favorite, as: 'favorites' });
Product.belongsToMany(User, { through: Favorite, as: 'favoritedBy' });