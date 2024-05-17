"use strict";
import { Model, DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";

class User extends Model {
  public userId?: number;
  public firstName!: string;
  public lastName!: string;
  public userName!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public contactInfo!: string;
  public address?: string;
  public totalSpent?: string;
  public wishlist?: string;
  public shoppingCart?: number;
  public orderHistory?: string;
  public isVerfied?: boolean;
  public dateJoined?: Date;
  public lastLogin?: Date;

  static associate(models: any) {
    User.hasOne(models.Cart, {
      foreignKey: "userId",
      as: "carts",
    });
    User.hasOne(models.Wishlist, {
      foreignKey: "userId",
      as: "wish",
    });
  }
}
User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false, },
    lastName: { type: DataTypes.STRING, allowNull: false },
    userName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false,defaultValue: 'buyer' },
    contactInfo: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    totalSpent: { type: DataTypes.STRING, allowNull: false },
    wishlist: { type: DataTypes.STRING, allowNull: false },
    shoppingCart: { type: DataTypes.STRING, allowNull: false },
    orderHistory: { type: DataTypes.STRING, allowNull: false },
    isVerfied: { type: DataTypes.BOOLEAN, allowNull: false,defaultValue: false },
    dateJoined: { type: DataTypes.DATE, allowNull: true },
    lastLogin: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize: connectSequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
