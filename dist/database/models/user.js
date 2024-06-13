"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class User extends sequelize_1.Model {
    static associate(models) {
        User.hasMany(models.Review, {
            foreignKey: "userId",
        });
    }
    static initModel(sequelize) {
        User.init({
            userId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            status: { type: sequelize_1.DataTypes.STRING, defaultValue: "active" },
            wishlistId: { type: sequelize_1.DataTypes.STRING },
            cartId: { type: sequelize_1.DataTypes.STRING },
            role: { type: sequelize_1.DataTypes.STRING, defaultValue: "buyer" },
            profile: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
            },
            resetPasswordToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            resetPasswordExpires: { type: sequelize_1.DataTypes.DATE, allowNull: true },
            isTwoFactorEnabled: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "User",
            tableName: "Users",
            timestamps: true,
        });
        return User;
    }
}
User.initModel(db_config_1.default);
exports.default = User;
