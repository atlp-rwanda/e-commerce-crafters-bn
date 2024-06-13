"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Subscription extends sequelize_1.Model {
    static associate(models) { }
    static initModel(sequelize) {
        Subscription.init({
            subscriptionId: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "Subscription",
            tableName: "Subscriptions",
            timestamps: true,
        });
        return Subscription;
    }
}
Subscription.initModel(db_config_1.default);
exports.default = Subscription;
