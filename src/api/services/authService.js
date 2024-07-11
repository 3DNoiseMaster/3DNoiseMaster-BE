const jwt = require('jsonwebtoken');
const userService = require('./userService');
const config = require('../../config/config'); // secret key를 config 파일에서 가져옵니다.

const registerUser = async (userData) => {
  const { name, phone, username, password } = userData;
  const newUser = await userService.createUser({ name, phone, username, password });
  return newUser;
};

const loginUser = async (username, password) => {
  const user = await userService.loginUser(username, password);
  if (!user) {
    return null;
  }
  const payload = { sub: user.id, type: 'ACCESS' };
  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
