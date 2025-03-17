const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/roles', authMiddleware, roleMiddleware('admin'), roleController.createRole);
router.get('/roles', authMiddleware, roleMiddleware('admin'), roleController.getAllRoles);

module.exports = router;
// const express = require('express');
// const router = express.Router();

// router.post('/register', async (req, res) => {
//     try {
//         // Your user registration logic here
//         return res.status(201).json({ message: "User registered successfully!" });
//     } catch (error) {
//         return res.status(500).json({ message: "Error registering user", error });
//     }
// });

// module.exports = router;
