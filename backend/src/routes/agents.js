const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// New endpoint to update credentials:
router.put('/me/credentials', agentController.updateCredentials);

// Analytics
router.get('/me/analytics/trends', authMiddleware, agentController.getTripTrends);
router.get('/me/analytics', authMiddleware, agentController.getAnalytics);
router.get('/me/analytics/top-destinations', authMiddleware, agentController.getTopDestinations);


module.exports = router;
