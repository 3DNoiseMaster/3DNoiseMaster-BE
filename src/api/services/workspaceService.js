const { Task, ThreeD, Noise } = require('../models');

  const getTasks = async (user_id) => {
    const tasks = await Task.findAllTasks(user_id, ['task_id', 'task_name', 'status', 'date', 'task_division']);
    const results = await Promise.all(tasks.map(async (task) => {
      const threed = await ThreeD.findErrorRateById(task.task_id)
  
      return {
        ...task.toJSON(),
        error_rate: threed ? threed.error_rate : null,
      };
    }));
    return results;
  };

  const getTaskOne = async (user_id, task_id) => {
    const task = await Task.findByTaskId(task_id);
    if (!task) {
      return null;
    }
    if (task.user_id !== user_id) {
      return null;
    }

    let taskWithDetails = task.toJSON();
    
    if (task.task_division == 'noise_gen') {
      const noise = await Noise.findByTaskId(task_id);
      taskWithDetails = {
        ...taskWithDetails,
        noise: noise ? {
          noise_type: noise.noise_type,
          noise_level: noise.noise_level,
        } : null,
      };
    }
    return taskWithDetails;
  }

  const getTaskCount = async (user_id) => {
    const tasks = await Task.findAllTasks(user_id, ['status']);
  
    let beforeCount = 0;
    let doneCount = 0;
  
    tasks.forEach(task => {
      if (task.status === 0) {
        beforeCount += 1;
      } else if (task.status === 100) {
        doneCount += 1;
      }
    });
  
    const totalCount = tasks.length;
    let runningCount = totalCount - beforeCount - doneCount;
  
    return { 
      totalCount,
      beforeCount,
      runningCount,
      doneCount,
    };
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
  if (!task) {
    return { status: 404 };
  }
  
  await task.destroy();
  return { status: 200 };
};


const requestNoiseRemoval = async (user_id, data) => {
  // validator 코드 넣으면 좋을듯
  const task = await Task.create({
    task_name: data.task_name,
    task_division: 'noise_rem',
    user_id: user_id,
  });
  await ThreeD.create({
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
  await ThreeD.create({
    task_file: data.file, 
    task_id: task.task_id,
    user_id: user_id,
  });
  await Noise.create({
    task_id: task.task_id,
    noise_type: data.noiseType,
    noise_level: data.noiseLevel,
  });
  console.log(`Noise generate requested by user ${user_id} for task ${task.task_id}`);
  
  return task;
};


const requestErrorComparison = async (user_id, data) => {
  const task = await Task.create({
    task_name: data.task_name,
    task_division: 'error_comp',
    user_id: user_id,
  });
  await ThreeD.create({
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
  getTaskOne,
  getTaskCount,
  downloadTasks,
  getTaskNameById,
  deleteTask,
  requestNoiseRemoval,
  requestNoiseGeneration,
  requestErrorComparison,
};
