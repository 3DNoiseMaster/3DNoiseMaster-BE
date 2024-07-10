// External module imports
const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');
const { Sequelize } = require('sequelize');

// init dotenv path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(5000).description('Server port number'),
    HOST: Joi.string().default('localhost').description('Server hostname/ip address'),
    PROTOCOL: Joi.string().valid('http', 'https').default('http').description('Server protocol'),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    APP_NAME: Joi.string().description('Application name'),
    DB_NAME: Joi.string().required().description('Database name'),
    DB_USER: Joi.string().required().description('Database username'),
    DB_PASS: Joi.string().required().description('Database password'),
    DB_HOST: Joi.string().required().description('Database host'),
    ADMIN_EMAIL: Joi.string().default('admin@example.com').description('Admin registration email'),
    BCRYPT_SALT_ROUNDS: Joi.number().default(15).description('Bcrypt salt rounds'),
    JWT_ISSUER: Joi.string().required().description('JWT issuer'),
    JWT_ACCESS_SECRET: Joi.string().required().description('JWT access token secret'),
    JWT_REFRESH_SECRET: Joi.string().required().description('JWT refresh token secret'),
    JWT_RESET_PASSWORD_SECRET: Joi.string().required().description('JWT reset password token secret'),
    JWT_VERIFY_EMAIL_SECRET: Joi.string().required().description('JWT verify email token secret'),
    JWT_SESSION: Joi.string().valid('true', 'false').default('false').description('JWT session'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('minutes after which refresh tokens expire'),
    JWT_COOKIE_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which verify email token expires'),
  })
  .unknown();

// validations
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

// error handler
if (error) {
  throw new Error(`Config Validation Error: ${error.message}`);
}

// Sequelize 연결 설정
const sequelize = new Sequelize(envVars.DB_NAME, envVars.DB_USER, envVars.DB_PASS, {
  host: envVars.DB_HOST,
  dialect: 'mysql',
  logging: envVars.NODE_ENV === 'development' ? console.log : false,
});

// 데이터베이스 연결 테스트
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // 여기서부터 추가적인 데이터베이스 작업을 수행할 수 있습니다.

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Module exports
module.exports = {
  port: envVars.PORT,
  host: envVars.HOST,
  protocol: envVars.PROTOCOL,
  env: envVars.NODE_ENV,
  appName: envVars.APP_NAME,
  database: {
    name: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    host: envVars.DB_HOST,
  },
  adminEmail: envVars.ADMIN_EMAIL,
  bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
  jwt: {
    issuer: envVars.JWT_ISSUER,
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    resetPasswordSecret: envVars.JWT_RESET_PASSWORD_SECRET,
    verifyEmailSecret: envVars.JWT_VERIFY_EMAIL_SECRET,
    session: envVars.JWT_SESSION,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    cookieExpirationDays: envVars.JWT_COOKIE_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
};
