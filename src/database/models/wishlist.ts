'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Wishlist  extends Model  {
    public wishlistId?: number
    public userId!: number;
    public productId!: any;

    static associate(models: any) {
      Wishlist.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'user'
      })
      Wishlist.belongsTo(models.Product,{
        foreignKey: 'productId',
        as:'product'
      })
    }
  }
  Wishlist.init({
    wishlistId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    productId: {type:DataTypes.STRING,allowNull: false},
  }, {
    sequelize: connectSequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists'
  });

  export default Wishlist
