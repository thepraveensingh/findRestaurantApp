import React, { useState } from 'react';
import { searchRestaurantsByImage } from '../api/restaurantService';

function ImageSearch() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const data = await searchRestaurantsByImage(image);
      setResults(data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <section id="image-search">
      <h2>Search Restaurants by Image</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={uploadImage}>Upload</button>
      <ul>
        {results.map(result => (
          <li key={result._id}>{result.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default ImageSearch;
