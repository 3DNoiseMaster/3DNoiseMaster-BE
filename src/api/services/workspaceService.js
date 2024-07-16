const { Task, ThreeD, Noise } = require('../models');

const getTasks = async (user_id) => {
  // Implement logic to fetch tasks for the member
};

const getTaskCount = async (user_id) => {
  // Implement logic to count tasks for the member
};

const downloadTasks = async (user_id, task_id) => {
  const threed = await ThreeD.findByTaskId(task_id);
  if (!threed) {
    return null;
  }
  if (threed.user_id !== user_id) {
    return null;
  }
  return threed.result_file;
};

const getTaskNameById = async (user_id, task_id) => {
  const task = await Task.findByTaskId(task_id);
  if (!task) {
    return null;
  }
  if (task.user_id !== user_id) {
    return null;
  }
  return task.task_name;
};

// 작업물 삭제
const deleteTask = async (user_id, task_id) => {
  const task = await Task.findByTaskId(task_id);
  const threed = await ThreeD.findByTaskId(task_id);
  if (task.division == 'noise_rem') {
    const noise = await Noise.findByTaskId(task_id);
    if (!task || !threed || !noise) {
      return { status: 404 };
    }
    await noise.destroy();
  }
  if (!task || !threed) {
    return { status: 404 };
  }
  await task.destroy();
  await threed.destroy();
  return { status: 200 };
};

const requestNoiseRemoval = async (user_id, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    division: 'noise_rem',
    user_id: memberId,
  });
  const threeD = await ThreeD.create({
    task_file: data.file,
    task_id: task.task_id,
    user_id: user_id,
  });
  console.log(`Noise removal requested by member ${userId} for task ${task.task_id}`);

  return task;
};

const requestNoiseGeneration = async (userId, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    division: 'noise_gen',
    user_id: memberId,
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
  console.log(`Noise generate requested by member ${userId} for task ${task.task_id}`);

  return task;
};

const requestErrorComparison = async (userId, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    division: 'error_comp',
    user_id: memberId,
  });
  const threeD = await ThreeD.create({
    task_file: data.file1,
    result_file: data.file2,
    task_id: task.task_id,
    user_id: user_id,
  });
  console.log(`Error comp requested by member ${userId} for task ${task.task_id}`);

  return task;
};

module.exports = {
  getTasks,
  getTaskCount,
  downloadTasks,
  getTaskNameById,
  deleteTask,
  requestNoiseRemoval,
  requestNoiseGeneration,
  requestErrorComparison,
};
