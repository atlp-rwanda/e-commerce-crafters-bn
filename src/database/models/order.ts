'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Order  extends Model  {
    public orderId?: string
    public deliveryAddress!: any
    public userId!: string
    public paymentMethod!: string
    public status!: string
    public products!: any
    public totalAmount!: number
    static associate(models: any) {
    }
  }
  Order.init({
    orderId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    deliveryAddress: {type:DataTypes.JSONB,allowNull: false},
    userId: {type:DataTypes.STRING,allowNull: false},
    paymentMethod: {type:DataTypes.INTEGER,allowNull: false},
    status: {type:DataTypes.STRING,allowNull: false},
    products: {type:DataTypes.JSONB,allowNull: false},
    totalAmount: {type:DataTypes.INTEGER,allowNull: false}
  
  }, {
    sequelize: connectSequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true
  });

  export default Order
