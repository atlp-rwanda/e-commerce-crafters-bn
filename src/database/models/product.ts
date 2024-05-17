'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";



  class Product  extends Model  {
    public productId?: number
    public name!: number
    public description!: string;
    public price!: number;
    public discount?: number;
    public vendorId?: number;
    static associate(models: any) {
      Product.belongsTo(models.Vendor,{
        foreignKey:'vendorId',
        as: 'vendor'
      })
      Product.hasMany(models.CartItem)
    }
  }
  Product.init({
    productId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    name: {type:DataTypes.STRING,allowNull: false},
    description: {type:DataTypes.STRING,allowNull: false},
    price: {type:DataTypes.INTEGER,allowNull: false},
    discount: {type:DataTypes.INTEGER,allowNull: false},
    vendorId: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Product',
    tableName: 'products'
  });

  export default Product
