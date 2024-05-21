'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Rating  extends Model  {
    public ratingId?: string
    public ratingScore!: number;
    public userId!: string;
    public vendorId!: string;
    static associate(models: any) {
    }
  }
  Rating.init({
    ratingId: {type:DataTypes.UUID,primaryKey: true,defaultValue: DataTypes.UUIDV4},
    ratingScore: {type:DataTypes.INTEGER,allowNull: false},
    userId: {type:DataTypes.STRING,allowNull: false},
    vendorId: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Rating',
    tableName: 'Ratings',
    timestamps: true
  });

  export default Rating
