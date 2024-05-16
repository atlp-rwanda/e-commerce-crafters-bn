'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class Cart  extends Model  {
    public cartId?: number
    public userId!: number;
    static associate(models: any) {
      Cart.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'users'
      })  
    }
  }
  Cart.init({
    cartId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Cart',
    tableName: 'cart'
  });

  export default Cart
