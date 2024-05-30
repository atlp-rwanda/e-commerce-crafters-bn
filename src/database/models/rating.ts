"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Rating extends Model {
  public ratingId?: string;
  public ratingScore!: number;
  public userId!: string;
  public vendorId!: string;
  static associate(models: any) {}
  static initModel(sequelize: Sequelize) {
    Rating.init(
      {
        ratingId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        ratingScore: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        vendorId: { type: DataTypes.STRING, allowNull: false },
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
