'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class Product  extends Model  {
    public productId?: number
    public name!: number
    public description!: string;
    public price!: number;
    public discount?: number;
    public vendorId?: number;
    static associate(models: any) {
    }
  }
  Product.init({
    productId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    name: {type:DataTypes.STRING,allowNull: false},
    description: {type:DataTypes.STRING,allowNull: false},
    price: {type:DataTypes.INTEGER,allowNull: false},
    discount: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Product',
    tableName: 'products'
  });

  export default Product
