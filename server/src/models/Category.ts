import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<
  CategoryAttributes,
  "id" | "description" | "parentId" | "createdAt" | "updatedAt"
> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string | null;
  public parentId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Populated by associations — not database columns
  public readonly children?: Category[];
  public readonly parent?: Category;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "categories", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "categories",
    indexes: [
      { fields: ["parentId"] },
      // parentId index matters because "get all subcategories of X"
      // is one of your most frequent queries. Without it, MySQL
      // scans the entire table to find children.
    ],
  },
);

// Self-referential association for subcategories
Category.hasMany(Category, { as: "children", foreignKey: "parentId" });
Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });

export default Category;
