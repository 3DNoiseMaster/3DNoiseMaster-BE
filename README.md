```
3DNoiseMaster
├─ .gitignore
├─ .vscode
│  └─ launch.json
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
└─ src
   ├─ api
   │  ├─ controllers
   │  │  ├─ authController.js
   │  │  ├─ index.js
   │  │  ├─ userController.js
   │  │  └─ workspaceController.js
   │  ├─ lib
   │  │  └─ multer-uploader.js
   │  ├─ middlewares
   │  │  ├─ authentication
   │  │  │  ├─ auth.js
   │  │  │  ├─ authLimiter.js
   │  │  │  └─ index.js
   │  │  ├─ common
   │  │  │  ├─ errorHandler.js
   │  │  │  ├─ ignoreFavicon.js
   │  │  │  ├─ index.js
   │  │  │  └─ notFoundHandler.js
   │  │  ├─ permissions
   │  │  │  ├─ grantAccess.js
   │  │  │  ├─ index.js
   │  │  │  └─ users.permission.js
   │  │  └─ users
   │  │     └─ threeDFileUpload.js
   │  ├─ models
   │  │  ├─ index.js
   │  │  ├─ Token.js
   │  │  └─ User.js
   │  ├─ services
   │  │  ├─ authService.js
   │  │  ├─ index.js
   │  │  ├─ userService.js
   │  │  └─ workspaceService.js
   │  ├─ utils
   │  │  ├─ common.js
   │  │  ├─ ErrorResponse.js
   │  │  ├─ index.js
   │  │  ├─ mappedPermissions.js
   │  │  ├─ sendTokenResponse.js
   │  │  └─ SuccessResponse.js
   │  ├─ validators
   │  │  ├─ authValidate.js
   │  │  ├─ customValidate.js
   │  │  ├─ index.js
   │  │  ├─ memberValidate.js
   │  │  └─ validate.js
   │  └─ workers
   │     └─ index.js
   ├─ config
   │  ├─ compression.js
   │  ├─ config.js
   │  ├─ cors.js
   │  ├─ custom-http-status.js
   │  ├─ database.js
   │  ├─ logger.js
   │  ├─ morgan.js
   │  ├─ passport.js
   │  ├─ roles.js
   │  └─ tokens.js
   ├─ core
   │  ├─ app.js
   │  ├─ database.js
   │  ├─ server.js
   │  └─ workers.js
   └─ index.js

```