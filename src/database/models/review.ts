'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Review  extends Model  {
    public reviewId?: string
    public rating!: number;
    public feedback!: string;
    public userId!: string;
    public productId!: string;
    static associate(models: any) {
      Review.belongsTo(models.User,{
        foreignKey: "userId",
        as: "User"
      })
      Review.belongsTo(models.Product,{
        foreignKey: "ProductId",
        as: "Product"
      })
    }
  }
  Review.init({
    reviewId: {type:DataTypes.UUID,primaryKey: true,defaultValue: DataTypes.UUIDV4},
    rating: {type:DataTypes.INTEGER,allowNull: false},
    feedback: {type:DataTypes.STRING,allowNull: false},
    userId: {type:DataTypes.STRING,allowNull: false},
    productId: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    timestamps: true
  });

  export default Review
