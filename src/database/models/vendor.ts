"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";
import { ftruncate } from "fs";

class Vendor extends Model {
  public vendorId?: string;
  public userId!: string;
  public storeName!: string;
  public address!: any;
  public TIN!: number;
  public bankAccount!: number;
  public paymentDetails!: any;
  public status!: string;
  static associate(models: any) {
    Vendor.hasMany(models.Product, {
      foreignKey: "vendorId",
      as: "vendor",
    });
    Vendor.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
  static initModel(sequelize: Sequelize) {
    Vendor.init(
      {
        vendorId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        userId: { type: DataTypes.STRING, allowNull: false },
        storeName: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.JSONB, allowNull: false },
        TIN: { type: DataTypes.INTEGER, allowNull: false },
        bankAccount: { type: DataTypes.INTEGER, allowNull: false },
        paymentDetails: { type: DataTypes.JSONB, allowNull: true },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "pending",
        },
      },
      {
        sequelize: connectSequelize,
        modelName: "Vendor",
        tableName: "Vendors",
        timestamps: true,
      }
    );
    return Vendor;
  }
}

Vendor.initModel(connectSequelize);

export default Vendor;
