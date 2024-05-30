"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";
import User from "./user";

class Review extends Model {
  public reviewId?: string;
  public rating!: number;
  public feedback!: string;
  public userId!: string;
  public productId!: string;
  static associate(models: any) {
    Review.belongsTo(models.User, {
      foreignKey: "userId",
      as: "User",
    });
    Review.belongsTo(models.Product, {
      foreignKey: "productId",
    });
  }
  static initModel(sequelize: Sequelize) {
    Review.init(
      {
        reviewId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        rating: { type: DataTypes.INTEGER, allowNull: false },
        feedback: { type: DataTypes.STRING, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "Review",
        tableName: "Reviews",
        timestamps: true,
      }
    );
    return Review;
  }
}

Review.initModel(connectSequelize);

export default Review;
