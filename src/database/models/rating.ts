'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";



  class Rating  extends Model  {
    public ratingId?: number
    public userId!: number;
    public ratingScore!: number;
    static associate(models: any) {
      Rating.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'users'
      })
    }
  }
  Rating.init({
    cartId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    userId: {type:DataTypes.INTEGER,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Rating',
    tableName: 'ratings'
  });

  export default Rating
