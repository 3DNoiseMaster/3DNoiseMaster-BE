const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  logging: config.env === 'development' ? console.log : false,
});

module.exports = sequelize;
