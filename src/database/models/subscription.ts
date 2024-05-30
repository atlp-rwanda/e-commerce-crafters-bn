"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Subscription extends Model {
  public subscriptionId?: string;
  public email!: string;
  static associate(models: any) {}
  static initModel(sequelize: Sequelize) {
    Subscription.init(
      {
        subscriptionId: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        email: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "Subscription",
        tableName: "Subscriptions",
        timestamps: true,
      }
    );
    return Subscription;
  }
}
Subscription.initModel(connectSequelize);

export default Subscription;
