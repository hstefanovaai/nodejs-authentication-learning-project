import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  passwordHash: string;
  resetToken?: string | null;
  resetTokenExpiration?: Date | null;
  isEmailVerified: boolean;
  emailVerificationTokenHash: string | null;
  emailVerificationExpires: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// role is optional on creation because it has a defaultValue
type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "role" | "createdAt" | "updatedAt"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare role: "user" | "admin";
  declare passwordHash: string;
  declare resetToken: string | null;
  declare resetTokenExpiration: Date | null;
  declare isEmailVerified: boolean;
  declare emailVerificationTokenHash: string | null;
  declare emailVerificationExpires: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public isAdmin(): boolean {
    return this.role === "admin";
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationTokenHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    emailVerificationExpires: { type: DataTypes.DATE, allowNull: true },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    resetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    //It prevents accidentally leaking hashes in API responses.
    // defaultScope: {
    //   attributes: { exclude: ["passwordHash"] },
    // },
    // scopes: {
    //   // Use this scope when you need the password (login flow)
    //   // User.scope('withPassword').findOne(...)
    //   withPassword: {
    //     attributes: { include: ["passwordHash"] },
    //   },
    // },
  },
);

export default User;
