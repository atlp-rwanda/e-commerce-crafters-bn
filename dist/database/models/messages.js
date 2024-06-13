"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Message extends sequelize_1.Model {
    static associate(models) { }
    static initModel(sequelize) {
        Message.init({
            contactId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            name: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            content: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "Message",
            tableName: "Ratings",
            timestamps: true,
        });
        return Message;
    }
}
Message.initModel(db_config_1.default);
exports.default = Message;
