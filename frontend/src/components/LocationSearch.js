import React, { useState } from 'react';
import { searchRestaurantsByLocation } from '../api/restaurantService';

function LocationSearch() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [results, setResults] = useState([]);

  const searchByLocation = async (e) => {
    e.preventDefault();
    try {
      const data = await searchRestaurantsByLocation(latitude, longitude, radius);
      setResults(data);
    } catch (error) {
      console.error('Error searching by location:', error);
    }
  };

  return (
    <section id="location-search">
      <h2>Search Restaurants by Location</h2>
      <form onSubmit={searchByLocation}>
        <label>
          Latitude:
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            step="any"
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            step="any"
            required
          />
        </label>
        <label>
          Radius (km):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            step="any"
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map(result => (
          <li key={result._id}>{result.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default LocationSearch;
