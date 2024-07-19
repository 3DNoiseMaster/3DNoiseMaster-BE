const { parentPort } = require('worker_threads');
const { Task, ThreeD, Noise } = require('../models');
const { exec } = require('child_process');
const path = require('path');
const config = require('../../config/config');

const processTask = async () => {
  try {
    const task = await Task.findUnprocessedOldest();
    if (!task) {
      parentPort.postMessage('No tasks to process');
      return;
    }
    const threed = await ThreeD.findByTaskId(task.task_id);
    let noise;
    if (task.task_division === 'noise_gen') {
        noise = await Noise.findByTaskId(task.task_id);
    }

    const cppExecutablePath = path.resolve(config.cpp_path, 'test.exe');
    const command = `"${cppExecutablePath}" ${task.task_division} ${threed.task_file}`;

    // C++ 코드 실행
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        parentPort.postMessage(`exec error: ${error.message}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      task.status = 100; // 예시: 100은 완료된 상태를 나타냄
      task.save();

      parentPort.postMessage(`Task ${task.task_id} Name: ${task.task_name} processed: ${stdout}`);
    });
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
  }
};

// 주기적으로 작업을 처리합니다.
setInterval(processTask, 10000); // 10초마다 작업 처리 시도
