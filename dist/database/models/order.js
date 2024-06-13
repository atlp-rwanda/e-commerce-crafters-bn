"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Order extends sequelize_1.Model {
    static associate(models) { }
    static initModel(sequelize) {
        Order.init({
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            deliveryAddress: { type: sequelize_1.DataTypes.JSONB, allowNull: false },
            userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            paymentMethod: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            products: { type: sequelize_1.DataTypes.JSONB, allowNull: false },
            totalAmount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            expectedDeliveryDate: { type: sequelize_1.DataTypes.DATE, allowNull: true }
        }, {
            sequelize: db_config_1.default,
            modelName: "Order",
            tableName: "Orders",
            timestamps: true,
        });
        return Order;
    }
}
Order.initModel(db_config_1.default);
exports.default = Order;
