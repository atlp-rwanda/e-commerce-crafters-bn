'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Cart  extends Model  {
    public cartId?: string
    public userId!: string
    static associate(models: any) {
       Cart.hasMany(models.CartItem,{
        foreignKey: 'cartId',
        as: 'cartItems'
       })
    }
  }
  Cart.init({
    cartId: {type:DataTypes.UUID,primaryKey: true,defaultValue:DataTypes.UUIDV4},
    userId: {type:DataTypes.STRING,allowNull: false},
  
  }, {
    sequelize: connectSequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true
  });

  export default Cart
