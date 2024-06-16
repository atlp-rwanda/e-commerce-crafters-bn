"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Product extends Model {
 [x: string]: any;
 public productId?: string;
 public vendorId: any;
 public name!: string;
 public description!: string;
 public image!: string;
 public discount!: number;
 public price!: number;
 public quantity!: number;
 public category!: string;
 public expiringDate?: Date;
 public expired!: boolean;
 public available!: boolean;
 static associate(models: any) {
  Product.belongsTo(models.Vendor,{
    foreignKey: "vendorId",
    as: "Vendor"
  })
  Product.hasMany(models.Wishlist, {
   foreignKey: "productId",
  });
  Product.hasMany(models.CartItem, {
   foreignKey: "productId",
  });
  Product.hasMany(models.Review, {
   foreignKey: "productId",
  });
 }
 static initModel(sequelize: Sequelize) {
  Product.init(
   {
    productId: {
     type: DataTypes.UUID,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
    },
    vendorId: {
     type: DataTypes.STRING,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    discount: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    expiringDate: { allowNull: true, type: DataTypes.DATE },
    expired: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
    available: {
     allowNull: false,
     type: DataTypes.BOOLEAN,
     defaultValue: true,
    },
   },
   {
    sequelize: connectSequelize,
    modelName: "Product",
    tableName: "Products",
    timestamps: true,
   }
  );
  return Product;
 }
}

Product.initModel(connectSequelize);
export default Product;
