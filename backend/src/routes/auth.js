const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// THESE SHOULD NOT REQUIRE AUTH:
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
