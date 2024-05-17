'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class Message  extends Model  {
    public messageId?: number
    public senderName!: string;
    public email!: string;
    public content!: Text;
    static associate(models: any) {

    }
  }
  Message.init({
    messageId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    senderName: {type:DataTypes.STRING,allowNull: false},
    email: {type:DataTypes.STRING,allowNull: false},
    content: {type:DataTypes.TEXT,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Message',
    tableName: 'messages'
  });

  export default Message
