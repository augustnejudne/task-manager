const router = require('express').Router();
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be .jpg, .jpeg, or .png'));
    }
    return cb(undefined, true);
  },
});
const authMiddleware = require('../middleware/auth.middleware.js');
const errorHandler = require('../middleware/errorHandler.middleware.js');
const {
  getUserProfile,
  getUserAvatar,
  registerUser,
  loginUser,
  logoutUser,
  logoutAllUserSessions,
  uploadFile,
  updateUserProfile,
  deleteUser,
  deleteAvatar,
} = require('../controllers/users.controllers.js');

// GET requests
router.get('/me', authMiddleware, getUserProfile);
router.get('/me/avatar', authMiddleware, getUserAvatar);

// POST requests
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/logout/all', authMiddleware, logoutAllUserSessions);
router.post('/me/avatar', authMiddleware, upload.single('avatar'), uploadFile, errorHandler);

// PUT requests
router.put('/me', authMiddleware, updateUserProfile);

// DELETE requests
router.delete('/me', authMiddleware, deleteUser);
router.delete('/me/avatar', authMiddleware, deleteAvatar);

module.exports = router;
