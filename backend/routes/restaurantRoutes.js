const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Define routes
router.get('/', restaurantController.getRestaurants); // Fetch restaurants with optional filters
router.get('/:id', restaurantController.getRestaurantById); // Fetch restaurant details by ID

// New route for cuisine detection using image upload
router.post('/detectCuisine', restaurantController.detectCuisine);

module.exports = router;