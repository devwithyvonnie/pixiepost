const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const emailController = require('../controllers/emailController');

router.post('/send', authMiddleware, emailController.sendEmailForTrip);

module.exports = router;
