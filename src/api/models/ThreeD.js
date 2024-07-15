// models/ThreeD.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');
const { genUniqueId } = require('../utils/common');

class ThreeD extends Model {}

ThreeD.init(
  {
    threed_id: {
      type: DataTypes.UUID,
      defaultValue: genUniqueId,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    task_file: {
      type: DataTypes.BLOB,
      allowNull: false,
      validate: {
        notNull: { msg: 'Task file is required' },
      },
    },
    result_file: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    error_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: { msg: 'Error rate must be a decimal value' },
      },
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'task', 
        key: 'task_id',
      },
      validate: {
        notNull: { msg: 'Task ID is required' },
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id',
      },
      validate: {
        notNull: { msg: 'User ID is required' },
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
