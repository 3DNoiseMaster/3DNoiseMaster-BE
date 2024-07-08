// External module imports
const { Sequelize } = require('sequelize');

// Internal module imports
const config = require('../config/config');
const logger = require('../config/logger');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
});

/**
 * Connect to MySQL server
 * @return {object} Sequelize connection
 */
const connectDB = async () => {
  try {
    logger.info('Trying to connect with MySQL');

    await sequelize.authenticate();
    logger.info('MySQL Connected');

    // return sequelize connection
    return sequelize;
  } catch (error) {
    if (config.env === 'development') {
      return logger.error(error);
    }

    logger.error(`MySQL Connection Failed: ${error.message}`);
    logger.info('Force to close the MySQL connection');
    process.exit(1);
  }
};

// Module exports
module.exports = { connectDB };
