const httpStatus = require('http-status');

// define custom http messages
const httpMessage = {
  // basic http messages
  [httpStatus.OK]: 'Everything worked as expected.',
  [httpStatus.CREATED]: 'Resource created successfully.',
  [httpStatus.BAD_REQUEST]:
    'The request was unacceptable, often due to invalid JSON format.',
  [httpStatus.NOT_FOUND]: "The requested resource doesn't exist.",
  [httpStatus.UNAUTHORIZED]: 'No valid token provided.',
  [httpStatus.FORBIDDEN]:
    "Access denied, you don't have permission to access on this server",
  [httpStatus.UNPROCESSABLE_ENTITY]:
    'The request unprocessable, often due to invalid parameters.',
  [httpStatus.INTERNAL_SERVER_ERROR]: 'The service is temporarily unavailable.',
  [httpStatus.SERVICE_UNAVAILABLE]: 'The service is currently unavailable.',

  // custom messages
  'InvalidLogin': 'Invalid username or password',
  'userLogged_in': 'user log in',
};

// Module exports
module.exports = {
  httpStatus,
  httpMessage,
};
