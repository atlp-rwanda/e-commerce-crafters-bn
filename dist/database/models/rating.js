"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Rating extends sequelize_1.Model {
    static associate(models) {
        Rating.belongsTo(models.Product, {
            foreignKey: "productId",
        });
    }
    static initModel(sequelize) {
        Rating.init({
            ratingId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            ratingScore: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            feedback: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            productId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "Rating",
            tableName: "Ratings",
            timestamps: true,
        });
        return Rating;
    }
}
Rating.initModel(db_config_1.default);
exports.default = Rating;
