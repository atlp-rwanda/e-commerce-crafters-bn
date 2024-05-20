'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";
import { ftruncate } from "fs";

  class Product  extends Model  {
    public productId?: number
    public name!: string
    public description!: string
    public discount!: string
    public price!: string
    public quantity!: number
    public vendorId: any
    static associate(models: any) {
       Product.hasMany(models.Wishlist,{
        foreignKey: 'productId',
        as: 'wishlists'
       })
       Product.hasMany(models.CartItem,{
        foreignKey: 'productId',
        as: 'wishlists'

       })
       Product.belongsTo(models.Vendor,{
        foreignKey: 'vendorId',
        as: 'vendor'
       })
    }
  }
  Product.init({
    vendorId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    storeName: {type:DataTypes.STRING,allowNull: false},
    address: {type:DataTypes.JSONB,allowNull: false},
    TIN: {type:DataTypes.INTEGER,allowNull: false},
    bankAccount: {type:DataTypes.INTEGER,allowNull: false},
    paymentDetails: {type:DataTypes.JSONB,allowNull: true},
  
  }, {
    sequelize: connectSequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true
  });

  export default Product
