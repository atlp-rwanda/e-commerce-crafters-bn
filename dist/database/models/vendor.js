"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Vendor extends sequelize_1.Model {
    static associate(models) {
        Vendor.hasMany(models.Product, {
            foreignKey: "vendorId",
            as: "vendor",
        });
        Vendor.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    }
    static initModel(sequelize) {
        Vendor.init({
            vendorId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            storeName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            address: { type: sequelize_1.DataTypes.JSONB, allowNull: false },
            TIN: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            bankAccount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            paymentDetails: { type: sequelize_1.DataTypes.JSONB, allowNull: true },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "pending",
            },
        }, {
            sequelize: db_config_1.default,
            modelName: "Vendor",
            tableName: "Vendors",
            timestamps: true,
        });
        return Vendor;
    }
}
Vendor.initModel(db_config_1.default);
exports.default = Vendor;
