// Internal module imports
const { startServer } = require('./core/server');
const { startWorkers } = require('./core/workers');
const { connectDB } = require('./core/database');

const init = async () => {
  // database connection
  await connectDB();

  // start the server
  await startServer();

  // start the workers
  await startWorkers();
};

/**
 * Start the process
 */
init();