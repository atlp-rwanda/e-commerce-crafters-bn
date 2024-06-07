require('dotenv').config();

const config = {
  development: {
    url: process.env.DATABASE_DEVELOPMENT_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },

    }
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_PRODUCTION_URL,
    dialect: 'postgres'
  }
};

module.exports = config;