const { parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

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
      setTimeout(processTask, 10000);
      return;
    }

    const threed = await ThreeD.findByTaskId(task.task_id);
    const taskFilePath = path.join(config.file_temp_path, 'mesh1.obj');
    await fs.writeFile(taskFilePath, threed.task_file, 'utf8');

    let noise;
    if (task.task_division === 'noise_gen') {
        noise = await Noise.findByTaskId(task.task_id);
    } else if (task.task_division === 'error_comp') {
      const taskFilePath2 = path.join(config.file_temp_path, 'mesh2.obj');
      await fs.writeFile(taskFilePath2, threed.result_file, 'utf8');
    }

    const cppExecutablePath = path.resolve(config.cpp_path, config.cpp_file_name);
    const args = [
      task.task_id,
      task.task_division,
      config.file_temp_path,
      noise ? noise.noise_type : '0',
      noise ? noise.noise_level : '0',
    ];

    // C++ 코드 실행
    const child = spawn(cppExecutablePath, args);
    parentPort.postMessage(`${task.task_name} Process Start!`);

    child.stdout.on('data', async (data) => {
      const dataString = data.toString();

      for (const line of dataString.split('\n')) {
        if (line.startsWith('STATUS: ')) {
          const status = parseInt(line.replace('STATUS: ', ''), 10);
          task.status = status;
          await task.save();
          parentPort.postMessage(`Task Processing, status: ${status}`);
        } else if (line.startsWith('LOG: ')) {
          const logMessage = line.replace('LOG: ', '');
          parentPort.postMessage(`Log: ${logMessage}`);
        } else if (line.startsWith('ERROR RATE: ')) {
          const errorRate = parseFloat(line.replace('ERROR RATE: ', ''));
          threed.error_rate = errorRate;
          await threed.save();
          parentPort.postMessage(`Task Processing, Error Rate: ${errorRate}`);
        }
      }
    });

    child.stderr.on('data', async (data) => {
      const stderrString = decodeUTF_8(data);
      parentPort.postMessage(`Task ${task.task_id} stderr: ${stderrString}`);
    });

    child.on('close', async (code) => {
      if (code === 0) {
        task.status = 100;
        await task.save();

        const resultFilePath = path.join(config.file_temp_path, 'mesh2.obj');
        const resultFileContent = await fs.readFile(resultFilePath, 'utf8');
        threed.result_file = resultFileContent;
        await threed.save();

        parentPort.postMessage(`Task {${task.task_id}} Name: {${task.task_name}} processed successfully`);
      } else {
        task.status = 200;
        await task.save();
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
