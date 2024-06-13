"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class CartItem extends sequelize_1.Model {
    static associate(models) {
        CartItem.belongsTo(models.Cart, {
            foreignKey: "cartId",
            as: "cart",
        });
    }
    static initModel(sequelize) {
        CartItem.init({
            cartitemsid: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            cartId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            productId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "CartItem",
            tableName: "CartItems",
            timestamps: true,
        });
        return CartItem;
    }
}
CartItem.initModel(db_config_1.default);
exports.default = CartItem;
