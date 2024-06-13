"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
(0, dotenv_1.config)();
const NODE_ENV = process.env.NODE_ENV || "development";
const HOST_MODE = process.env.HOST_MODE || "remote";
function getURL() {
    switch (NODE_ENV) {
        case "development":
            return process.env.DATABASE_DEVELOPMENT_URL;
        case "test":
            return process.env.DATABASE_TEST_URL;
        default:
            return process.env.DATABASE_PRODUCTION_URL;
    }
}
function getDialectOptions() {
    return HOST_MODE === "local"
        ? {}
        : {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
}
const connectSequelize = new sequelize_1.Sequelize(getURL(), {
    dialect: "postgres",
    dialectOptions: getDialectOptions(),
    logging: false,
});
exports.default = connectSequelize;
