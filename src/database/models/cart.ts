'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Cart  extends Model  {
    public cartId?: number
    public userId!: number
    static associate(models: any) {
       Cart.hasMany(models.CartItem,{
        foreignKey: 'cartId',
        as: 'cartItems'
       })
    }
  }
  Cart.init({
    cartId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.STRING,allowNull: false},
  
  }, {
    sequelize: connectSequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true
  });

  export default Cart
