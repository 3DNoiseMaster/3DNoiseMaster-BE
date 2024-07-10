const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');
const { allRoles } = require('../../config/roles');

class User extends Model {
  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }

  static async findByUsername(username) {
    return this.findOne({ where: { username } });
  }
}

User.init(
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
    username: {
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
    modelName: 'User',
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user
.password, salt);
        }
      },
    },
  }
);

module.exports = User;