"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Cart extends sequelize_1.Model {
    static associate(models) {
        Cart.hasMany(models.CartItem, {
            foreignKey: "cartId",
            as: "cartItems",
        });
    }
    static initModel(sequelize) {
        Cart.init({
            cartId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "Cart",
            tableName: "Carts",
            timestamps: true,
        });
        return Cart;
    }
}
Cart.initModel(db_config_1.default);
exports.default = Cart;
