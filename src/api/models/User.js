const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');
const { allRoles } = require('../../config/roles');
const { genUniqueId } = require('../utils/common')

class User extends Model {
  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }

  static async findById(id) {
    return this.findOne({ where: { user_id : id } });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      defaultValue: genUniqueId,
      allowNull: false,
      unique: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Username is required' },
        isAlphanumeric: { msg: 'Username must contain only letters and numbers' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        len: {
          args: [8],
          msg: 'Password must be at least 8 characters long',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Phone number is required' },
        is: {
          args: /^[0-9]{10,}$/,
          msg: 'Phone number must be at least 10 digits',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: allRoles.USER.alias,
      validate: {
        isIn: {
          args: [Object.values(allRoles).map(role => role.alias)],
          msg: 'Invalid role',
        },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    tableName: 'user',
    timestamps: false,
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
