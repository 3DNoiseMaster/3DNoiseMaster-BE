// Internal module imports
const { multerUploader } = require('../../lib');
const config = require('../../../config/config');

// 단일 파일 업로드 설정
const singleFileUpload = (req, res, next) => {
  const fieldName = 'file'; // 클라이언트가 전송하는 파일의 필드 이름
  const options = {
    folder: config.upload_path, // 파일을 저장할 폴더 경로
    allowedMimeTypes: [
      {
        field: fieldName,
        types: ['model/obj'], // OBJ 파일 MIME 타입
        message: 'Only .obj format allowed!',
      },
    ],
    maxFileSize: 10485760, // 10 MB
  };
  
  // 업로드 설정을 위해 uploadSingleFile 함수 사용
  multerUploader.uploadSingleFile(fieldName, options)(req, res, next);
};

// 두 개의 파일 업로드 설정
const multipleFileUpload = (req, res, next) => {
  const fieldNames = ['file1', 'file2']; // 클라이언트가 전송하는 파일의 필드 이름들
  const options = {
    folder: config.upload_path, // 파일을 저장할 폴더 경로
    allowedMimeTypes: [
      {
        field: 'file1',
        types: ['model/obj'], // OBJ 파일 MIME 타입
        message: 'Only .obj format allowed for file1!',
      },
      {
        field: 'file2',
        types: ['model/obj'], // OBJ 파일 MIME 타입
        message: 'Only .obj format allowed for file2!',
      },
    ],
    maxFileSize: 10485760, // 10 MB
  };

  // 업로드 설정을 위해 uploadMixedFiles 함수 사용
  multerUploader.uploadMixedFiles(
    [
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 }
    ],
    options
  )(req, res, next);
};

// Module exports
module.exports = {
  singleFileUpload,
  multipleFileUpload,
};
