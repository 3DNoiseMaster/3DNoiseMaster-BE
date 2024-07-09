// External module imports
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

// Internal module imports
const { tokenTypes } = require('../../config/tokens');

/**
 * Token Model
 */
class Token extends Model {
  static async findToken({ memberId, deviceId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.findOne({
      where: {
        memberId,
        deviceId,
        type,
        blacklisted,
      },
    });
  }

  static async deleteOneToken({ memberId, deviceId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.destroy({
      where: {
        memberId,
        deviceId,
        type,
        blacklisted,
      },
    });
  }

  static async deleteManyToken({ memberId, type = tokenTypes.REFRESH, blacklisted = false }) {
    return this.destroy({
      where: {
        memberId,
        type,
        blacklisted,
      },
    });
  }
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
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
    expires: {
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
