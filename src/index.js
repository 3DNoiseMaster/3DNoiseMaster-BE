// Internal module imports
npm
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