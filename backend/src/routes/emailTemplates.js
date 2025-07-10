const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplateController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Create a template
router.post('/', emailTemplateController.createTemplate);

// Get all templates for the logged-in agent
router.get('/', emailTemplateController.getTemplates);

// Get a template by type
router.get('/:templateType', emailTemplateController.getTemplateByType);

// Update a template by type
router.put('/:templateType', emailTemplateController.updateTemplateByType);

// Delete a template by type
router.delete('/:templateType', emailTemplateController.deleteTemplateByType);

module.exports = router;
