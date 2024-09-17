const express = require('express');
const cors = require('cors');  // Import the cors package
const app = express();
const restaurantRoutes = require('./routes/restaurantRoutes');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Use the restaurant routes for any request to /api/restaurants
app.use('/api/restaurants', restaurantRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// server.js or app.js
const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  };
  
  app.use(cors(corsOptions));
  