// Internal module imports
const { multerUploader } = require('../../lib');

const threeDFileUpload = (req, res, next) => {
  const fieldName = 'file'; // 클라이언트가 전송하는 파일의 필드 이름
  const options = {
    folder: '/uploads/3d-files', // 파일을 저장할 폴더 경로
    allowedMimeTypes: [
      {
        field: fieldName,
        types: ['application/octet-stream', 'model/stl', 'application/sla'], // 3D 파일 MIME 타입
        message: 'Only .obj, .stl, or .fbx format allowed!',
      },
    ],
    maxFileSize: 52428800, // 50 MB
  };
  
  // uploads file to local storage
  multerUploader.uploadSingleFile(fieldName, options)(req, res, next);
};

// Module exports
module.exports = threeDFileUpload;
