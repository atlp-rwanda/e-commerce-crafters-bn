"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class WishlistItem extends sequelize_1.Model {
    static associate(models) {
        WishlistItem.belongsTo(models.Wishlist, {
            foreignKey: "wishlistId",
            as: "wishlist",
        });
    }
}
WishlistItem.init({
    wishlistItemsId: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    wishlistId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    productId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    sequelize: db_config_1.default,
    modelName: "WishlistItem",
    tableName: "WishlistItems",
    timestamps: true,
});
exports.default = WishlistItem;
