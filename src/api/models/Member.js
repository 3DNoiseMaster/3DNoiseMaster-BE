const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');
const { allRoles } = require('../../config/roles');

class Member extends Model {
  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }

  static async findByMembername(membername) {
    return this.findOne({ where: { membername } });
  }
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    membername: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Membername is required' },
        isAlphanumeric: { msg: 'Membername must contain only letters and numbers' },
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required' },
        isAlpha: { msg: 'Name must only contain letters' },
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
  },
  {
    sequelize,
    modelName: 'Member',
    hooks: {
      beforeSave: async (member, options) => {
        if (member.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          member.password = await bcrypt.hash(member.password, salt);
        }
      },
    },
  }
);

module.exports = Member;
