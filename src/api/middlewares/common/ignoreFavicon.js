const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl && req.originalUrl.split('/').pop().includes('favicon.ico')) {
      return res.status(204).end();
    }
    return next();
  };
  
  // Module exports
  module.exports = ignoreFavicon;
  