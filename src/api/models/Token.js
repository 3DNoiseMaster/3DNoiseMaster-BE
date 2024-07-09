// External module imports
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

// Internal module imports
const { tokenTypes } = require('../../config/tokens');

/**
 * Token Model
 */
class Token extends Model {
  static async findToken({ userId, deviceId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.findOne({
      where: {
        userId,
        deviceId,
        type,
        blacklisted,
      },
    });
  }

  static async deleteOneToken({ userId, deviceId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.destroy({
      where: {
        userId,
        deviceId,
        type,
        blacklisted,
      },
    });
  }

  static async deleteManyToken({ userId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.destroy({
      where: {
        userId,
        type,
        blacklisted,
      },
    });
  }
}

Token.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Members', // should match the table name
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(tokenTypes)],
          msg: 'Invalid token type',
        },
      },
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Token',
  }
);

module.exports = Token;
