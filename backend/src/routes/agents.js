const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// New endpoint to update credentials:
router.put('/me/credentials', agentController.updateCredentials);

// Endpoint to gather data
router.get('/me/analytics', authMiddleware, agentController.getAnalytics);

module.exports = router;
