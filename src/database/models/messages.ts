"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";

class Message extends Model {
  public contactId?: string;
  public name!: number;
  public email!: string;
  public content!: string;
  static associate(models: any) {}
  static initModel(sequelize: Sequelize) {
    Message.init(
      {
        contactId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: { type: DataTypes.INTEGER, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.INTEGER, allowNull: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "Message",
        tableName: "Messages",
        timestamps: true,
      }
    );
    return Message;
  }
}
Message.initModel(connectSequelize);
export default Message;
