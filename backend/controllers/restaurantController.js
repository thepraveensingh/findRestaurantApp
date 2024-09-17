const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
require('dotenv').config();

// Set up multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Google Generative AI and file manager
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const fileManager = new GoogleAIFileManager(API_KEY);

// List of all JSON file paths
const jsonFiles = [
    path.join(__dirname, '..', 'data', 'file1.json'),
    path.join(__dirname, '..', 'data', 'file2.json'),
    path.join(__dirname, '..', 'data', 'file3.json'),
    path.join(__dirname, '..', 'data', 'file4.json'),
    path.join(__dirname, '..', 'data', 'file5.json')
];

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Function to load all restaurant data
const loadRestaurants = () => {
    let allRestaurants = [];

    jsonFiles.forEach((filePath) => {
        try {
            const jsonData = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(jsonData);

            if (Array.isArray(parsedData)) {
                parsedData.forEach((item) => {
                    if (item.restaurants && Array.isArray(item.restaurants)) {
                        allRestaurants = allRestaurants.concat(
                            item.restaurants.map((r) => ({
                                id: r.restaurant.R.res_id,
                                name: r.restaurant.name,
                                cuisines: r.restaurant.cuisines,
                                location: r.restaurant.location.city,
                                featured_image: r.restaurant.featured_image,
                                latitude: parseFloat(r.restaurant.location.latitude),
                                longitude: parseFloat(r.restaurant.location.longitude),
                               
                                
                                    address: r.restaurant.location.address,
                                   
                                    city_id: r.restaurant.location.city_id,
                                    country_id: r.restaurant.location.country_id,
                                    latitude: parseFloat(r.restaurant.location.latitude),
                                    locality: r.restaurant.location.locality,
                                    locality_verbose: r.restaurant.location.locality_verbose,
                                    longitude: parseFloat(r.restaurant.location.longitude),
                                    zipcode: r.restaurant.location.zipcode || '',
                             
                                
                                average_cost_for_two: r.restaurant.average_cost_for_two,
                                currency: r.restaurant.currency,
                                deeplink: r.restaurant.deeplink,
                                establishment_types: r.restaurant.establishment_types || [],
                                events_url: r.restaurant.events_url,
                                has_online_delivery: r.restaurant.has_online_delivery,
                                has_table_booking: r.restaurant.has_table_booking,
                                is_delivering_now: r.restaurant.is_delivering_now,
                                menu_url: r.restaurant.menu_url,
                                offers: r.restaurant.offers || [],
                                photos_url: r.restaurant.photos_url,
                                price_range: r.restaurant.price_range,
                                switch_to_order_menu: r.restaurant.switch_to_order_menu,
                                thumb: r.restaurant.thumb,
                                url: r.restaurant.url,
                                
                                    aggregate_rating: r.restaurant.user_rating.aggregate_rating,
                                    rating_color: r.restaurant.user_rating.rating_color,
                                    rating_text: r.restaurant.user_rating.rating_text,
                                    votes: r.restaurant.user_rating.votes
                                
                            }))
                        );
                    }
                });
            } else {
                console.error(`Invalid data structure in file: ${filePath}`);
            }
        } catch (parseError) {
            console.error(`Error parsing file: ${filePath}`, parseError);
        }
    });

    return allRestaurants;
};

// GET /restaurants - Fetch restaurants with filters and pagination
exports.getRestaurants = (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 per page
    const city = req.query.city || ''; // City filter
    const lat = parseFloat(req.query.lat); // Latitude for proximity search
    const lon = parseFloat(req.query.lon); // Longitude for proximity search
    const radius = parseFloat(req.query.radius) || 10; // Radius in km (default is 10 km)
    const name = req.query.name ? req.query.name.toLowerCase() : ''; // Name filter (case-insensitive)
    const cuisine = req.query.cuisine ? req.query.cuisine.toLowerCase() : ''; // Cuisine filter (case-insensitive)

    let allRestaurants = loadRestaurants();

    let filteredRestaurants = allRestaurants;

    if (city) {
        filteredRestaurants = filteredRestaurants.filter(
            (restaurant) =>
                restaurant.location &&
                restaurant.location.toLowerCase() === city.toLowerCase()
        );
    }

    if (lat && lon) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => {
            const distance = haversineDistance(
                lat,
                lon,
                restaurant.latitude,
                restaurant.longitude
            );
            return distance <= radius;
        });
    }

    if (name) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(name)
        );
    }

    if (cuisine) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) =>
            restaurant.cuisines.toLowerCase().includes(cuisine)
        );
    }

    // Remove duplicate restaurants based on ID
    const seenIds = new Set();
    filteredRestaurants = filteredRestaurants.filter((restaurant) => {
        if (seenIds.has(restaurant.id)) {
            return false;
        } else {
            seenIds.add(restaurant.id);
            return true;
        }
    });

    const totalRestaurants = filteredRestaurants.length;
    const totalPages = Math.ceil(totalRestaurants / limit);
    const startIndex = (page - 1) * limit;
    const paginatedRestaurants = filteredRestaurants.slice(
        startIndex,
        startIndex + limit
    );

    res.json({
        restaurants: paginatedRestaurants,
        totalRestaurants,
        totalPages,
        currentPage: page,
    });
};

// GET /restaurants/:id - Fetch restaurant details by ID
exports.getRestaurantById = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        // Load all restaurants from the data source
        const allRestaurants = loadRestaurants();

        // Find the restaurant with the given ID
        const restaurant = allRestaurants.find(r => r.id == restaurantId);

        // Check if the restaurant was found
        if (restaurant) {
            // Return the restaurant details as JSON
            res.json({
                ...restaurant,
                location: restaurant.location,
                user_rating: restaurant.user_rating
            });
        } else {
            // If not found, return a 404 error with a message
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        // Handle and log any errors that occur during the process
        console.error('Error reading or parsing the data files:', error);
        res.status(500).json({ error: 'Error reading or parsing the data files' });
    }
};
// POST /restaurants/detectCuisine - Upload image and detect cuisine using Gemini API
exports.detectCuisine = [
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const imagePath = req.file.path;
            console.log('Uploaded image path:', imagePath);

            // Call Gemini API to predict cuisine
            const recognizedCuisine = await predictCuisineWithGemini(imagePath);

            fs.unlinkSync(imagePath); // Delete the uploaded image after processing

            const allRestaurants = loadRestaurants();
            let filteredRestaurants = allRestaurants.filter((restaurant) =>
                restaurant.cuisines
                    .toLowerCase()
                    .includes(recognizedCuisine.toLowerCase())
            );

            // Remove duplicate restaurants based on ID
            const seenIds = new Set();
            filteredRestaurants = filteredRestaurants.filter((restaurant) => {
                if (seenIds.has(restaurant.id)) {
                    return false;
                } else {
                    seenIds.add(restaurant.id);
                    return true;
                }
            });

            res.json({
                cuisine: recognizedCuisine,
                restaurants: filteredRestaurants,
            });
        } catch (error) {
            console.error('Error detecting cuisine:', error);
            res
                .status(500)
                .json({ error: 'Failed to detect cuisine from the image' });
        }
    },
];

// Function to predict cuisine using Gemini AI
const predictCuisineWithGemini = async (imagePath) => {
    try {
        // Upload the image file
        const uploadResult = await fileManager.uploadFile(imagePath, {
            mimeType: 'image/jpeg', // Adjust if needed based on image file type
            displayName: 'Food Image',
        });

        // Define the prompt for Google Generative AI
        const prompt = 'Answer in one word: Tell the name of the cuisine represented in the image from the given food?';

        // Generate content using the uploaded file
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri,
                },
            },
            { text: prompt },
        ]);

        // Process the response to get the cuisine
        const filterCuisine = result.response.text().replace('Answer:', '').trim();

        // Delete the uploaded file from Google AI file manager
        await fileManager.deleteFile(uploadResult.file.name);
        console.log(`Deleted ${uploadResult.file.displayName}`);

        // Delete the local file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error occurred while trying to delete the file:', err);
                return;
            }
            console.log('File deleted successfully');
        });

        return filterCuisine;
    } catch (error) {
        console.error('Error predicting cuisine:', error);
        throw error; // Re-throw the error for handling by the caller
    }
};