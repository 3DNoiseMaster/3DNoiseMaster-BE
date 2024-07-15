const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Noise extends Model {}

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
      type: DataTypes.STRING,
      allowNull: false,
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
