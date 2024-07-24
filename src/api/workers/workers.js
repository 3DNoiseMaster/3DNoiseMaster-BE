const { parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

const { Task, ThreeD, Noise } = require('../models');
const { decodeUTF_8 } = require('../utils').common;
const config = require('../../config/config');

let isProcessing = false;

const processTask = async () => {
  if (isProcessing) {
    parentPort.postMessage('Processing in progress, skipping new task');
    return;
  }

  isProcessing = true;

  try {
    const task = await Task.findUnprocessedOldest();
    if (!task) {
      parentPort.postMessage('No tasks to process');
      isProcessing = false;
      setTimeout(processTask, 10000); // 10초 후에 다시 작업 탐색
      return;
    }

    const threed = await ThreeD.findByTaskId(task.task_id);
    let noise;
    if (task.task_division === 'noise_gen') {
        noise = await Noise.findByTaskId(task.task_id);
    }

    const cppExecutablePath = path.resolve(config.cpp_path, 'test.exe');
    const args = [task.task_division, threed.task_file];

    // C++ 코드 실행
    const child = spawn(cppExecutablePath, args);
    parentPort.postMessage(`${task.task_name} Process Start!`);

    child.stdout.on('data', (data) => {
      task.status = parseInt(data, 10);
      task.save();
      parentPort.postMessage(`Tast Processing, status : ${data}`);
    });

    child.stderr.on('data', (data) => {
      const stderrString = decodeUTF_8(data);
      parentPort.postMessage(`Task ${task.task_id} stderr: ${stderrString}`);
    });

    child.on('close', (code) => {
      if (code === 0) {
        parentPort.postMessage(`Task {${task.task_id}} Name: {${task.task_name}} processed successfully`);
      } else {
        parentPort.postMessage(`Task ${task.task_id} Name: ${task.task_name} failed with exit code ${code}`);
      }
      isProcessing = false;
      processTask(); // 작업 종료 후 즉시 다음 작업 처리
    });

  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
    isProcessing = false;
    setTimeout(processTask, 10000); // 에러 발생 시 10초 후에 다시 작업 탐색
  }
};

// 초기 작업 탐색 시작
processTask();
