'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class CartItem  extends Model  {
    public cartItemId?: number
    public cartId?: number
    public productId!: number;
    public quantity!: number;
    static associate(models: any) {
      CartItem.belongsTo(models.Cart,{
        foreignKey: 'cartId',
        as: 'user'
      })
      CartItem.belongsTo(models.productId,{
        foreignKey: 'productId',
        as: 'product'
      })  
    }
  }
  CartItem.init({
    cartItemId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    cartId: {type:DataTypes.INTEGER,allowNull: false},
    productId: {type:DataTypes.INTEGER,allowNull: false},
    quantity: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'CartItem',
    tableName: 'cartitem'
  });

  export default CartItem
