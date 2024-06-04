'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Subscription  extends Model  {
    public subscriptionId?: string
    public email!: string;
    static associate(models: any) {
    }
  }
  Subscription.init({
    subscriptionId: {type:DataTypes.STRING,primaryKey: true,defaultValue: DataTypes.UUIDV4},
    email: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Subscription',
    tableName: 'Subscriptions',
    timestamps: true
  });

  export default Subscription
