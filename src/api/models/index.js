// models/index.js
const sequelize = require('../../config/database');
const User = require('./User');
const Task = require('./Task');
const ThreeD = require('./ThreeD');
const Token = require('./Token');

// User와 Task 관계 설정 (1:N)
User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

// Task와 ThreeD 관계 설정 (1:N)
Task.hasMany(ThreeD, { foreignKey: 'task_id' });
ThreeD.belongsTo(Task, { foreignKey: 'task_id' });

// User와 ThreeD 관계 설정 (1:N)
User.hasMany(ThreeD, { foreignKey: 'user_id' });
ThreeD.belongsTo(User, { foreignKey: 'user_id' });

// 기존의 Token 모델과 새로운 모델들을 포함하여 내보내기
module.exports = {
  sequelize,
  User,
  Task,
  ThreeD,
  Token,
};
