const { DataTypes, Op, Model } = require('sequelize');
const sequelize = require('../../config/database');
const { genUniqueId } = require('../utils/common');

class Task extends Model {
  static async findByTaskId(id) {
    return this.findOne({ where: { task_id: id } });
  }

  static async findAllTasks(userId, attributes) {
    return this.findAll({
      where: { user_id: userId },
      attributes: attributes,
    });
  }

  static async findUnprocessedOldest() {
    return this.findOne({
      where: {
        status: {
          [Op.lt]: 100,
        },
      },
    });
  }
}

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
    task_division: {
      type: DataTypes.ENUM('noise_gen', 'noise_rem', 'error_comp'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Division is required' },
        isIn: {
          args: [['noise_gen', 'noise_rem', 'error_comp']],
          msg: 'Division must be one of: noise_gen, noise_rem, error_comp',
        },
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: 'Status is required' },
        isInt: { msg: 'Status must be an integer' },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: { msg: 'User ID is required' },
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    freezeTableName: true,
    tableName: 'task',
    timestamps: false,
  }
);

module.exports = Task;
