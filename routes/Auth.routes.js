const express = require('express');
const router = express.Router();
const { register, login, registerAttorney } = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/invite-user', authMiddleware, registerAttorney)

module.exports = router;
