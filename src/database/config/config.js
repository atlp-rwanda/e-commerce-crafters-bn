// const dotenv = require('dotenv')
// dotenv.config()
// module.exports = {
//   "development": {
//     "url": process.env.DATABASE_TEST_URL,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require": true,
//         "rejectUnauthorized": true
//       }
//     }
//   },
//   "test": {
//     "url": process.env.DATABASE_TEST_URL,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require": true,
//         "rejectUnauthorized": true
//       }
//     }
//   },
//   "production": {
//     "url": process.env.DATABASE_PRODUCTION_URL,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require": true,
//         "rejectUnauthorized": true
//       }
//     }
//   }
// }




const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
};
