"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Rating extends Model {
  public ratingId?: string;
  public ratingScore?: number;
  public feedback?: string;
  public productId!: string;
  public name!: string;
  static associate(models: any) {
    Rating.belongsTo(models.Product, {
      foreignKey: "productId",
    });
  }
  static initModel(sequelize: Sequelize) {
    Rating.init(
      {
        ratingId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        ratingScore: { type: DataTypes.INTEGER, allowNull: true },
        feedback: { type: DataTypes.STRING, allowNull: true },
        productId: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "Rating",
        tableName: "Ratings",
        timestamps: true,
      }
    );
    return Rating;
  }
}

Rating.initModel(connectSequelize);

export default Rating;
