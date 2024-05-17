'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class Order  extends Model  {
    public orderId?: number
    public userId!: number;
    public address!: any;
    public orderDate!: Date;
    public status!: string;
    public orderItems!: any;
    public totalAmount!: number;
    static associate(models: any) {
      Order.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Order.init({
    orderId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    address: {type:DataTypes.STRING,allowNull: false},
    orderDate: {type:DataTypes.DATE,allowNull: false},
    status: {type:DataTypes.STRING,allowNull: false,defaultValue: 'pending'},
    orderItems: {type:DataTypes.STRING,allowNull: false},
    totalAmount: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Order',
    tableName: 'orders'
  });

  export default Order
