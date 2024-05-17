import { Sequelize } from "sequelize";
const config = require('./config')
import dotenv from "dotenv"
dotenv.config()


const MODE:any = process.env.MODE || 'development'


const connectSequelize:Sequelize = new Sequelize(config[`${MODE}`].url,{
    dialect: config[`${MODE}`].dialect,
    dialectOptions: {
      }
  
}) 

export default connectSequelize