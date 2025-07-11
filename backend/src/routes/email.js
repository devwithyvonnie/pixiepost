const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const emailController = require('../controllers/emailController');

router.post('/send', authMiddleware, emailController.sendEmailForTrip);

router.get('/scheduled', authMiddleware, emailController.getScheduledEmails);
router.delete('/scheduled/:id', authMiddleware, emailController.deleteScheduledEmail);

router.post('/draft', authMiddleware, emailController.saveDraftEmail);
router.patch('/draft/:id', authMiddleware, emailController.updateDraftEmail);
router.delete('/draft/:id', authMiddleware, emailController.deleteDraftEmail);


module.exports = router;
