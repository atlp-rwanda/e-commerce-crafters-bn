"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Review extends sequelize_1.Model {
    static associate(models) {
        Review.belongsTo(models.User, {
            foreignKey: "userId",
            as: "User",
        });
        Review.belongsTo(models.Product, {
            foreignKey: "productId",
        });
    }
    static initModel(sequelize) {
        Review.init({
            reviewId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            feedback: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            productId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "Review",
            tableName: "Reviews",
            timestamps: true,
        });
        return Review;
    }
}
Review.initModel(db_config_1.default);
exports.default = Review;
