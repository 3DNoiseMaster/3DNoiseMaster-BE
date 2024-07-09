// External module imports
const mongoose = require('mongoose');

// Internal module imports
const { User } = require('../models');
const { allRoles, roles } = require('../../config/roles');

// check whether id is mongo ObjectId or not
const isObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return true;
  }
  return Promise.reject(new Error('Invalid value'));
};

// check whether username already exists or not
const isUsernameTaken = (username) => {
  return User.findByUsername(username).then((user) => {
    if (user) {
      return Promise.reject(new Error('Username already exists'));
    }
  });
};

// check whether user role valid or not
const isInRoles = (role, { req }) => {
  if (!role) {
    return Promise.reject(new Error('Role is required'));
  }
  if (req.baseUrl.includes('auth')) {
    return role === allRoles.USER.alias
      ? true
      : Promise.reject(new Error('Invalid role'));
  }
  return roles.indexOf(role) > -1
    ? true
    : Promise.reject(new Error('Invalid role'));
};

// Module exports
module.exports = {
  isObjectId,
  isUsernameTaken,
  isInRoles,
};
