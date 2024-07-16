const { Task, ThreeD, Noise } = require('../models');

const getTasks = async (memberId) => {
  // Implement logic to fetch tasks for the member
};

const getTaskCount = async (memberId) => {
  // Implement logic to count tasks for the member
};

const downloadTasks = async (memberId) => {
  // Implement logic to download tasks for the member
};

// 작업물 ID로 작업물 가져오기
const getTaskById = async (taskId) => {
  // Implement logic to getTask by Id
  // return Workspace.findByPk(taskId);
};

// 작업물 삭제
const deleteTask = async (taskId) => {
  // Implement logic to deleteTask
  // const task = await Workspace.findByPk(taskId);
  // if (task) {
  //   await task.destroy();
  // }
};

const requestNoiseRemoval = async (user_id, data) => {
  // validator 코드 넣으면 좋을듯
  const task = await Task.create({
    task_name: data.task_name,
    task_division: 'noise_rem',
    user_id: user_id,
  });
  const threeD = await ThreeD.create({
    task_file: data.file,
    task_id: task.task_id,
    user_id: user_id,
  });

  return task;
};

const requestNoiseGeneration = async (user_id, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    task_division: 'noise_gen',
    user_id: user_id,
  });
  const threeD = await ThreeD.create({
    task_file: data.file,
    task_id: task.task_id,
    user_id: user_id,
  });
  const noise = await Noise.create({
    task_id: task.task_id,
    noise_type: data.noiseType,
    noise_level: data.noiseLevel,
  })
  console.log(`Noise generate requested by user ${user_id} for task ${task.task_id}`);

  return task;
};

const requestErrorComparison = async (user_id, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    task_division: 'error_comp',
    user_id: user_id,
  });
  const threeD = await ThreeD.create({
    task_file: data.file1,
    result_file: data.file2,
    task_id: task.task_id,
    user_id: user_id,
  });
  console.log(`Error comp requested by user ${user_id} for task ${task.task_id}`);

  return task;
};

module.exports = {
  getTasks,
  getTaskCount,
  downloadTasks,
  getTaskById,
  deleteTask,
  requestNoiseRemoval,
  requestNoiseGeneration,
  requestErrorComparison,
};
