// External module imports
const { Worker } = require('worker_threads');
const path = require('path');

// // Internal module imports
// const { sequelize, Task } = require('../api/models');
// const { exec } = require('child_process');

const startWorkers = async () => {
  console.log('Starting workers...');

  const worker = new Worker(path.resolve(__dirname, '../api/workers/workers.js'));

  worker.on('message', (message) => {
    console.log('Worker response:', message);
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};

// Module exports
module.exports = { startWorkers };
