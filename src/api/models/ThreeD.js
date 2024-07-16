// models/ThreeD.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ThreeD extends Model {
  static async findByTaskId(id) {
    return this.findOne({ where: { task_id : id } });
  }
}

ThreeD.init(
  {
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'task',
        key: 'task_id',
      },
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
