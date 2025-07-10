const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// POST /api/guests
router.post('/', guestController.createGuest);

// GET /api/guests
router.get('/', guestController.getGuests);

// GET /api/guests/:id
router.get('/:id', guestController.getGuest);

// PUT /api/guests/:id
router.put('/:id', guestController.updateGuest);

// DELETE /api/guests/:id
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
