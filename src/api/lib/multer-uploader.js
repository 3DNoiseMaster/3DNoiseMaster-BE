// External module imports
const multer = require('multer');

// Internal module imports
const { ErrorResponse } = require('../utils');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

const mappedErrors = (err) => {
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    err.message = 'Invalid field or too many files';
  }
  const errors = {
    [err.field]: {
      msg: err.message,
      param: err.field,
      location: 'file',
    },
  };
  return errors;
};

const onErrorHandler = (err, next) => {
  const errors = mappedErrors(err);
  return next(new ErrorResponse(httpStatus.BAD_REQUEST, httpMessage[httpStatus.BAD_REQUEST], errors));
};

// define multer memory storage
const memoryStorage = () => {
  return multer.memoryStorage();
};

const upload = (folder = '/tmp', allowedMimeTypes = [], maxFileSize = 1048576) => {
  const storage = memoryStorage(); // 메모리 저장소 사용
  const limits = { fileSize: maxFileSize };
  const fileFilter = (req, file, cb) => {
    let errorMessage = null;
    if (allowedMimeTypes.length === 0) {
      return cb(null, false);
    }
    const isFileAllowed = allowedMimeTypes.every(
      (allowedMimeType) => allowedMimeType.field === file.fieldname && allowedMimeType.types.includes(file.mimetype)
    );
    if (isFileAllowed) {
      return cb(null, true);
    }
    allowedMimeTypes.forEach((allowedMimeType) => {
      if (allowedMimeType.field === file.fieldname && !allowedMimeType.types.includes(file.mimetype)) {
        errorMessage = allowedMimeType.message || 'An unknown error occurred';
      }
    });
    const errors = { field: file.fieldname, message: errorMessage };
    return cb(errors);
  };
  return multer({ storage, limits, fileFilter });
};

const uploadSingleFile = (fieldName, { folder, allowedMimeTypes, maxFileSize }) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    uploader.single(fieldName)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

const uploadManyFiles = (fieldName, maxCount, { folder, allowedMimeTypes, maxFileSize }) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    uploader.array(fieldName, maxCount)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

const uploadMixedFiles = (fields, { folder, allowedMimeTypes, maxFileSize }) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    uploader.fields(fields)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

module.exports = {
  upload,
  uploadSingleFile,
  uploadManyFiles,
  uploadMixedFiles,
};
