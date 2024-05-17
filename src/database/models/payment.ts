'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";
  class Payment  extends Model  {
    public paymentId?: number
    public orderId!: number
    public userId?: number;
    public amount!: string;
    public paymentMethod!: string;
    static associate(models: any) {
      Payment.belongsTo(models.Order,{
        foreignKey:'orderId',
        as: 'order'
      })
      Payment.belongsTo(models.Product,{
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Payment.init({
    paymentId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    orderId: {type:DataTypes.STRING,allowNull: false},
    userId: {type:DataTypes.STRING,allowNull: false},
    Amount: {type:DataTypes.INTEGER,allowNull: false},
    paymentMethod: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });

  export default Payment
