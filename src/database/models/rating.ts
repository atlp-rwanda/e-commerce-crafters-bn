'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Rating  extends Model  {
    public ratingId?: number
    public ratingScore!: number;
    public userId!: number;
    public vendorId!: number;
    static associate(models: any) {
    }
  }
  Rating.init({
    ratingId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    ratingScore: {type:DataTypes.INTEGER,allowNull: false},
    userId: {type:DataTypes.INTEGER,allowNull: false},
    vendorId: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Rating',
    tableName: 'Ratings',
    timestamps: true
  });

  export default Rating
