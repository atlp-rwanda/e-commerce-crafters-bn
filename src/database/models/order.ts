"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Order extends Model {
  public orderId?: string;
  public deliveryAddress!: any;
  public userId!: string;
  public paymentMethod!: string;
  public status!: string;
  public products!: any;
  static associate(models: any) {}
  static initModel(sequelize: Sequelize) {
    Order.init(
      {
        orderId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        deliveryAddress: { type: DataTypes.JSONB, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        paymentMethod: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        products: { type: DataTypes.JSONB, allowNull: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "Order",
        tableName: "Orders",
        timestamps: true,
      }
    );
    return Order;
  }
}
Order.initModel(connectSequelize);

export default Order;
