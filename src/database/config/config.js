const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  development: {
    database: "",
    username: "",
    password: "",
    dialect: "",
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      },
    },
  },
  production: {
    url: process.env.DATABASE_PRODUCTION_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      },
    },
  },
};
