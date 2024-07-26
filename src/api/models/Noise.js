const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Noise extends Model {
  static async findByTaskId(id) {
    return this.findOne({ where: { task_id : id } });
  }
}

Noise.init(
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
    noise_type: {
      type: DataTypes.ENUM('Gaussian', 'Impursive'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Noise Type is required' },
        isIn: {
          args: [['Gaussian', 'Impursive']],
          msg: 'Noise Type must be one of: Gaussian, Impursive',
        },
      },
    },
    noise_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Noise',
    freezeTableName: true,
    tableName: 'noise',
    timestamps: false,
  }
);

module.exports = Noise;
