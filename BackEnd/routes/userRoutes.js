const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/users', userController.getAllUsers);
router.get('/users/driver-count', userController.fetchDriverCount);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser); //roleMiddleware('admin')

module.exports = router;