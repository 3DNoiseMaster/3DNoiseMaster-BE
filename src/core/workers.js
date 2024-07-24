// External module imports
const { Worker } = require('worker_threads');
const logger = require('../config/logger');
const path = require('path');

// // Internal module imports
// const { sequelize, Task } = require('../api/models');
// const { exec } = require('child_process');

const startWorkers = async () => {
  logger.info('Starting workers...');

  const worker = new Worker(path.resolve(__dirname, '../api/workers/workers.js'));

  worker.on('message', (message) => {
    logger.info(`Worker response: ${message}`);
  });

  worker.on('error', (error) => {
    logger.error(`Worker error: ${error}`);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      logger.error(`Worker stopped with exit code ${code}`);
    }
  });
};

// Module exports
module.exports = { startWorkers };
