"use strict";
import { Model, DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

class WishlistItem extends Model {
  public wishlistItemsId?: string;
  public wishlistId!: string;
  public productId!: string;

  static associate(models: any) {
    WishlistItem.belongsTo(models.Wishlist, {
      foreignKey: "wishlistId",
      as: "wishlist",
    });
  }
}
WishlistItem.init(
  {
    wishlistItemsId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    wishlistId: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: connectSequelize,
    modelName: "WishlistItem",
    tableName: "WishlistItems",
    timestamps: true,
  }
);

export default WishlistItem;
