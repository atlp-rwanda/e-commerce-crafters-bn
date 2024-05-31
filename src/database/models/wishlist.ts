"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Wishlist extends Model {
  public wishlistId?: string;
  public userId!: string;
  public productId!: string;
  static associate(models: any) {
    Wishlist.hasMany(models.WishlistItem,{
      foreignKey:"wishlistId"
    })
  }
  static initModel(sequelize: Sequelize) {
    Wishlist.init(
      {
        wishlistId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        userId: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize: connectSequelize,
        modelName: "Wishlist",
        tableName: "Wishlists",
        timestamps: true,
      }
    );
    return Wishlist;
  }
}
Wishlist.initModel(connectSequelize);
export default Wishlist;
