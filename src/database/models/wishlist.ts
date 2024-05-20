'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Wishlist  extends Model  {
    public wishlistId?: number
    public userId!: number;
    static associate(models: any) {
      Wishlist.hasMany(models.WishlistItem,{
        foreignKey:'WishlistItemId',
        as: 'WhislistItem'
      })
    }
  }
  Wishlist.init({
    wishlistId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    productId: {type:DataTypes.INTEGER,allowNull: false},
  }, {
    sequelize: connectSequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true
  });

  export default Wishlist
