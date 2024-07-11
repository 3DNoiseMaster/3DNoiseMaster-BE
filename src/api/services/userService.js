const { User } = require('../models');

const createUser = async (userData) => {
  return await User.create(userData);
};

const loginUser = async (user_name, password) => {
  const user = await User.findOne({ where: { user_name } });
  if (user && (await user.isPasswordMatch(password))) {
    return user;
  }
  return null;
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
};
