const dotenv = require('dotenv')
dotenv.config()
module.exports = {
  "development": {
    "database": "postgres",
    "dialect": "postgres",
    "username": "postgres",
    "password": "sevelin123",
    "dialectOptions": {
     
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





