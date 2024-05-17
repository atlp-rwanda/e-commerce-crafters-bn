'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";

  class Vendor  extends Model  {
    public vendorId?: number
    public userId!: number;
    public businessName!: string;
    public bankAccount!: number;
    public addressProof!: string;
    public TIN!: number;
    public license!: string;
    public salesHistory!: string;

    static associate(models: any) {
      Vendor.belongsTo(models.User,{
        foreignKey: "userId",
        as: 'user'
      })
      Vendor.hasMany(models.Product)
    }
  }
  Vendor.init({
    vendorId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.STRING,allowNull: false},
    businessName: {type:DataTypes.STRING,allowNull: false},
    bankAccount: {type:DataTypes.INTEGER,allowNull: false},
    addressProof: {type:DataTypes.STRING,allowNull: false},
    TIN: {type:DataTypes.INTEGER,allowNull: false},
    license: {type:DataTypes.STRING,allowNull: false},
    salesHistory: {type:DataTypes.STRING,allowNull: true},
  }, {
    sequelize: connectSequelize,
    modelName: 'Vendor',
    tableName: 'vendor'
  });

  export default Vendor
