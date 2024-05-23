import { Sequelize } from "sequelize";
const config = require('./config')
import dotenv from "dotenv"
dotenv.config()


const MODE:any = process.env.MODE || 'development'


const currentConfig = config[`${MODE}`];

const connectSequelize: Sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    dialectOptions: {},
  }
);


export default connectSequelize
