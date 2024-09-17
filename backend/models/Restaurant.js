const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    countryCode: { type: String },
    city: { type: String },
    address: { type: String },
    locality: { type: String },
    localityVerbose: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    cuisines: { type: String },
    averageCostForTwo: { type: Number },
    currency: { type: String },
    hasTableBooking: { type: Boolean },
    hasOnlineDelivery: { type: Boolean },
    isDeliveringNow: { type: Boolean },
    switchToOrderMenu: { type: String },
    priceRange: { type: String },
    aggregateRating: { type: Number },
    ratingColor: { type: String },
    ratingText: { type: String },
    votes: { type: Number }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
