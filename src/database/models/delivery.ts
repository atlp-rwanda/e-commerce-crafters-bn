'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";



  class Delivery  extends Model  {
    public deliveryId?: number
    public orderId!: number;
    public deliveryMethod!: string;
    public deliveryStatus!: string;
    public deliveryAddress!: string;
    static associate(models: any) {
      Delivery.belongsTo(models.Order,{
        foreignKey: 'orderId',
        as: 'order'
      })
    }
  }
  Delivery.init({
    delivertId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    orderId: {type:DataTypes.INTEGER,allowNull: false},
    deliveryMethod: {type:DataTypes.STRING,allowNull: false},
    deliveryStatus: {type:DataTypes.DATE,allowNull: false},
    deliveryAddress: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Delivery',
    tableName: 'delivery'
  });

  export default Delivery
