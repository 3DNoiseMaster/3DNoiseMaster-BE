// Internal module imports
const { startServer } = require('./core/server');
const { startWorkers } = require('./core/workers');
const { connectDB } = require('./core/database');

const init = async () => {
  // database connection
  await connectDB();

  // start the workers
  await startWorkers();

  // start the server
  await startServer();
};

/**
 * Start the process
 */
init();