'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Message  extends Model  {
    public contactId?: number
    public name!: number;
    public email!: string;
    public content!: string;
    public vendorId!: number;
    static associate(models: any) {
    }
  }
  Message.init({
    contactId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    name: {type:DataTypes.INTEGER,allowNull: false},
    email: {type:DataTypes.STRING,allowNull: false},
    content: {type:DataTypes.INTEGER,allowNull: false},


  }, {
    sequelize: connectSequelize,
    modelName: 'Message',
    tableName: 'Ratings',
    timestamps: true
  });

  export default Message
