// External module imports
const { Member } = require('../models');
const { allRoles, roles } = require('../../config/roles');

// check whether id is a valid UUID or not (assuming UUID is used for Member ID in MySQL)
const isObjectId = (id) => {
  // UUID 형식이 유효한지 확인 (UUID를 사용하는 경우)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return true;
  }
  return Promise.reject(new Error('Invalid value'));
};

// check whether member already exists or not
const isMembernameTaken = (membername) => {
  return Member.findOne({ where: { membername } }).then((member) => {
    if (member) {
      return Promise.reject(new Error('Membername already exists'));
    }
  });
};

// check whether member role is valid or not
const isInRoles = (role, { req }) => {
  if (!role) {
    return Promise.reject(new Error('Role is required'));
  }
  if (req.baseUrl.includes('auth')) {
    return role === allRoles.MEMBER.alias
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
  isMembernameTaken,
  isInRoles,
};
