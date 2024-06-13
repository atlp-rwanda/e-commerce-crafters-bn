"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Notification extends sequelize_1.Model {
    static initModel(sequelize) {
        Notification.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.UUIDV4,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            message: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            isRead: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
            },
            vendorId: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
        }, {
            sequelize: db_config_1.default,
            modelName: "Notification",
            tableName: "Notifications",
            timestamps: true,
        });
        return Notification;
    }
}
Notification.initModel(db_config_1.default);
exports.default = Notification;
