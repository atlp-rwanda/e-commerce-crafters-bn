import { Sequelize } from "sequelize";
const config = require("./config");
import dotenv from "dotenv";
dotenv.config();

const MODE: any = process.env.MODE || "development";

// const connectSequelize:Sequelize = new Sequelize(config[`${MODE}`].database,config[`${MODE}`].name,config[`${MODE}`].password,{
//     dialect: config[`${MODE}`].dialect,
//     dialectOptions: {
//       }

// })
const connectSequelize = new Sequelize("reset", "postgres", `postgres`, {
  host: "localhost",
  dialect: "postgres",
});

export default connectSequelize;
