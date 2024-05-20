'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class CartItem  extends Model  {
    public cartitemsId?: number
    public cartId!: number
    public productId!: number
    public quantity!: number
    public price!: number
    static associate(models: any) {
    }
  }
  CartItem.init({
    cartitemsId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    cartId: {type:DataTypes.INTEGER,allowNull: false},
    productId: {type:DataTypes.INTEGER,allowNull: false},
    quantity: {type:DataTypes.INTEGER,allowNull: false},
    price: {type:DataTypes.INTEGER,allowNull: false},
  
  }, {
    sequelize: connectSequelize,
    modelName: 'CartItem',
    tableName: 'CartItems',
    timestamps: true
  });

  export default CartItem
