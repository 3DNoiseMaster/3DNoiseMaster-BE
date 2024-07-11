// models/ThreeD.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ThreeD extends Model {}

ThreeD.init(
  {
    threed_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_file: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Task file is required' },
        len: {
          args: [1, 100],
          msg: 'Task file must be between 1 and 100 characters long',
        },
      },
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Result is required' },
        len: {
          args: [1, 100],
          msg: 'Result must be between 1 and 100 characters long',
        },
      },
    },
    error_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: 'Error rate is required' },
        isDecimal: { msg: 'Error rate must be a decimal value' },
      },
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Task',
        key: 'task_id',
      },
      validate: {
        notNull: { msg: 'Task ID is required' },
        isUUID: 4,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      validate: {
        notNull: { msg: 'User ID is required' },
        isInt: { msg: 'User ID must be an integer' },
      },
    },
  },
  {
    sequelize,
    modelName: 'ThreeD',
    tableName: 'threed',
    timestamps: false
  }
);

module.exports = ThreeD;
