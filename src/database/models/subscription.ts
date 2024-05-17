'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Subscription  extends Model  {
    public roleId?: number
    public roleName!: string;
    static associate(models: any) {
      Subscription.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Subscription.init({
    roleId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    roleName: {type:DataTypes.STRING,allowNull: false}
  }, {
    sequelize: connectSequelize,
    modelName: 'Subscription',
    tableName: 'subscription'
  });

  export default Subscription
