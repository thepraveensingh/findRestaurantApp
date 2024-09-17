const API_BASE_URL = 'http://localhost:5000/api';

// Fetch restaurant list with pagination and optional filters
export const getRestaurantList = async (page, limit, city = '', lat = '', lon = '', radius = 10, name = '') => {
    const url = new URL(`${API_BASE_URL}/restaurants`);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);

    if (city) {
        url.searchParams.append('city', city);
    }

    if (lat && lon) {
        url.searchParams.append('lat', lat);
        url.searchParams.append('lon', lon);
        url.searchParams.append('radius', radius);
    }

    if (name) {
        url.searchParams.append('name', name);
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Restaurant list not found.');
            if (response.status === 500) throw new Error('Internal Server Error.');
            throw new Error(`Unexpected error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching restaurant list: ${error.message}`, { page, limit, city, lat, lon, radius, name });
        throw error;
    }
};

// Fetch restaurant details by ID
export const getRestaurantDetails = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Restaurant not found.');
            if (response.status === 500) throw new Error('Internal Server Error.');
            throw new Error(`Unexpected error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || typeof data !== 'object' || !data.id) {
            throw new Error('Unexpected data format received for restaurant details.');
        }

        return data;
    } catch (error) {
        console.error(`Error fetching restaurant details for ID ${id}: ${error.message}`);
        throw error;
    }
};
// Import the fetch function if needed
// import fetch from 'node-fetch'; // Only if using Node.js environment with fetch

export const uploadCuisineImage = async (formData) => {
    try {
        const response = await fetch('http://localhost:5000/api/restaurants/detectCuisine', {
            method: 'POST',
            body: formData,
            // Do not set headers manually; FormData handles it internally
        });

        if (!response.ok) {
            throw new Error('Failed to upload image or process cuisine recognition.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading image for cuisine recognition:', error);
        throw error; // Re-throw to handle errors upstream if needed
    }
};