const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/users', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware('admin'), userController.getUserById);
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), userController.updateUser);

module.exports = router;