// models/Task.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');
const { genUniqueId } = require('../utils/common')

class Task extends Model {}

Task.init(
  {
    task_id: {
        type: DataTypes.UUID,
        defaultValue: genUniqueId,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Task name is required' },
        len: {
          args: [1, 100],
          msg: 'Task name must be between 1 and 100 characters long',
        },
      },
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Division is required' },
        isAlpha: { msg: 'Division must only contain letters' },
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: 'User ID is required' },
        isInt: { msg: 'User ID must be an integer' },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
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
    modelName: 'Task',
    freezeTableName: true,
    tableName: 'user',
    timestamps: false
  }
);

module.exports = Task;
