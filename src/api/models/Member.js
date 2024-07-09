// External module imports
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../config/database');

// Internal module imports
const config = require('../../config/config');
const { allRoles } = require('../../config/roles');

/**
 * Member Model
 */
class Member extends Model {
  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }

  static async findByUsername(id) {
    return this.findOne({ where: { id } });
  }
}

Member.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required' },
        isAlpha: { msg: 'Name must only contain letters' },
      },
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'ID is required' },
        isAlphanumeric: { msg: 'ID must contain only letters and numbers' },
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
          args: [Object.values(allRoles).map((role) => role.alias)],
          msg: 'Invalid role',
        },
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Member',
    hooks: {
      beforeSave: async (member, options) => {
        if (member.changed('password')) {
          const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
          member.password = await bcrypt.hash(member.password, salt);
        }
      },
    },
  }
);

module.exports = Member;
