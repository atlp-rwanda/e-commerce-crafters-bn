
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  "development": {
    "url": "postgresql://postgres:sevelin123@localhost:5432/postgres",
    "dialect": "postgres",
    "dialectOptions": {
      // "ssl": {
      //   "require": true,
      //   "rejectUnauthorized": true
      // }
    }
 
  },
  "test": {
    "url": process.env.DATABASE_TEST_URL,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": true
      }
    }
  },
  "production": {
    "url": process.env.DATABASE_PRODUCTION_URL,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": true
      }
    }
  }
}





