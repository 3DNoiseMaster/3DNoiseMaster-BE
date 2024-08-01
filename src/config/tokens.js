// define token types
const tokenTypes = {
    ACCESS: 'ACCESS',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
  };
  
  // list of types
  const types = Object.values(tokenTypes);
  
  // Module exports
  module.exports = {
    tokenTypes,
    types,
    secretKey: 'your-secret-key',  // 추가된 JWT 비밀 키
    expiresIn: '1h',  // 추가된 토큰 만료 시간
  };
  