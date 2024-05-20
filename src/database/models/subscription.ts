'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Subscription  extends Model  {
    public subscriptionId?: number
    public email!: number;
    static associate(models: any) {
    }
  }
  Subscription.init({
    subscriptionId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    email: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Subscription',
    tableName: 'Subscriptions',
    timestamps: true
  });

  export default Subscription
