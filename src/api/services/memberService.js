const { Member } = require('../models');

const createMember = async (memberData) => {
  return await Member.create(memberData);
};

const loginMember = async (membername, password) => {
  const member = await Member.findOne({ where: { membername } });
  if (member && (await member.isPasswordMatch(password))) {
    return member;
  }
  return null;
};

const getMemberById = async (id) => {
  return await Member.findByPk(id);
};

module.exports = {
  createMember,
  loginMember,
  getMemberById,
};
