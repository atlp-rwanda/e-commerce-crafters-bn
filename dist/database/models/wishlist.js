"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Wishlist extends sequelize_1.Model {
    static associate(models) {
        Wishlist.hasMany(models.WishlistItem, {
            foreignKey: "wishlistId"
        });
    }
    static initModel(sequelize) {
        Wishlist.init({
            wishlistId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            productId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        }, {
            sequelize: db_config_1.default,
            modelName: "Wishlist",
            tableName: "Wishlists",
            timestamps: true,
        });
        return Wishlist;
    }
}
Wishlist.initModel(db_config_1.default);
exports.default = Wishlist;
