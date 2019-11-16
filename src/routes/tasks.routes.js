const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const {
  getAllTasks,
  getOneTask,
  addOneTask,
  updateOneTask,
  deleteOneTask,
} = require('../controllers/tasks.controllers');

// GET requests
router.get('/', authMiddleware, getAllTasks);
router.get('/:id', authMiddleware, getOneTask);

// POST requests
router.post('/', authMiddleware, addOneTask);

// PUT requests
router.put('/:id', authMiddleware, updateOneTask);

// DELETE requests
router.delete('/:id', authMiddleware, deleteOneTask);

module.exports = router;
