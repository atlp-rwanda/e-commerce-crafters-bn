"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Product extends sequelize_1.Model {
    static associate(models) {
        Product.belongsTo(models.Vendor, {
            foreignKey: "vendorId",
            as: "Vendor"
        });
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
    static initModel(sequelize) {
        Product.init({
            productId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            vendorId: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            image: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            discount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            category: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            expiringDate: { allowNull: true, type: sequelize_1.DataTypes.DATE },
            expired: { allowNull: false, type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            available: {
                allowNull: false,
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            sequelize: db_config_1.default,
            modelName: "Product",
            tableName: "Products",
            timestamps: true,
        });
        return Product;
    }
}
Product.initModel(db_config_1.default);
exports.default = Product;
