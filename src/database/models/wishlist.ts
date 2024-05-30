'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Wishlist  extends Model  {
    public wishlistId?: string
    public userId!: string;
    static associate(models: any) {
      Wishlist.hasMany(models.WishlistItem,{
        foreignKey:'WishlistId',
        as: 'WhislistItems'
      })
    }
  }
  Wishlist.init({
    wishlistId: {type:DataTypes.UUID,primaryKey: true,defaultValue: DataTypes.UUIDV4},
    userId: {type:DataTypes.STRING,allowNull: false},
    
  }, {
    sequelize: connectSequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true
  });

  export default Wishlist
