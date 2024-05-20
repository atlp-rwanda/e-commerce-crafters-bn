'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";
import { ftruncate } from "fs";

  class Vendor  extends Model  {
    public vendorId?: number
    public userId!: number
    public storeName!: string
    public address!: any
    public TIN!: number
    public bankAccount!: number
    public paymentDetails!: any
    static associate(models: any) {
       Vendor.hasMany(models.Product,{
        foreignKey: 'vendorId',
        as: 'vendor'
       })
    }
  }
  Vendor.init({
    vendorId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    storeName: {type:DataTypes.STRING,allowNull: false},
    address: {type:DataTypes.JSONB,allowNull: false},
    TIN: {type:DataTypes.INTEGER,allowNull: false},
    bankAccount: {type:DataTypes.INTEGER,allowNull: false},
    paymentDetails: {type:DataTypes.JSONB,allowNull: true},
  
  }, {
    sequelize: connectSequelize,
    modelName: 'Vendor',
    tableName: 'Vendors',
    timestamps: true
  });

  export default Vendor
