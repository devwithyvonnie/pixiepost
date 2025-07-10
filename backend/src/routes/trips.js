const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// POST /api/trips
router.post('/', tripController.createTrip);

// GET /api/trips
router.get('/', tripController.getTrips);

// GET /api/trips/:id
router.get('/:id', tripController.getTrip);

// PUT /api/trips/:id
router.put('/:id', tripController.updateTrip);

// DELETE /api/trips/:id
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
