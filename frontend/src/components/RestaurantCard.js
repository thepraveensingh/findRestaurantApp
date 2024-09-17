import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantDetails } from '../api/restaurantService';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
    const { id } = useParams(); // Get the restaurant ID from the URL parameters
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = await getRestaurantDetails(id);
                setRestaurant(details);
                setLoading(false);
            } catch (err) {
                setError('Error fetching restaurant details');
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    const cuisines = restaurant.cuisines.split(','); // Assuming cuisines are comma-separated

    if (!restaurant) return <p>No restaurant data available</p>;

    return (
        <div className="restaurant-details">
            <div className="restaurant-header">
                <div className="header-content">
                    <h1 className="restaurant-name">{restaurant.name}</h1>
                    <img src={restaurant.featured_image} alt={restaurant.name} className="featured-image" />
                </div>
            </div>
            <div className="restaurant-info">
                <div className="cuisines">
                    <h2>Cuisines</h2>
                    <ul className="cuisines-list">
                        {cuisines.map((cuisine, index) => (
                            <li key={index} className="cuisine-item">{cuisine.trim()}</li>
                        ))}
                    </ul>
                </div>
                <div className="details-cards">
                    <div className="details-card">
                        <p><strong>Average Cost for Two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}</p>
                    </div>
                    <div className="details-card">
                        <p><strong>Price Range:</strong> {restaurant.price_range}</p>
                    </div>
                    <div className="details-card">
                        <p><strong>Has Online Delivery:</strong> {restaurant.has_online_delivery ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="details-card">
                        <p><strong>Has Table Booking:</strong> {restaurant.has_table_booking ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="details-card">
                        <p><strong>Switch to Order Menu:</strong> {restaurant.switch_to_order_menu ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="details-card">
                        <p><strong>Currently Delivering:</strong> {restaurant.is_delivering_now ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
            <div className="restaurant-location">
                <div className="location-content">
                    <div className="location-grid">
                        <div className="location-item">
                            <span className="label">Address:</span>
                            <span className="value">{restaurant.address}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">City:</span>
                            <span className="value">{restaurant.location}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">Locality:</span>
                            <span className="value">{restaurant.locality}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">Zipcode:</span>
                            <span className="value">{restaurant.zipcode || 'N/A'}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">Country ID:</span>
                            <span className="value">{restaurant.country_id}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">Latitude:</span>
                            <span className="value">{restaurant.latitude}</span>
                        </div>
                        <div className="location-item">
                            <span className="label">Longitude:</span>
                            <span className="value">{restaurant.longitude}</span>
                        </div>
                    </div>
                </div>
                <div className="rating-content">
                    <div className="rating-stars">★★★★☆</div>
                    <div className="rating-value">{restaurant.aggregate_rating}</div>
                    <div className="votes-count">{restaurant.votes}</div>
                    <div className="votes-label">Votes</div>
                </div>
            </div>
            <div className="restaurant-links">
    <img src={restaurant.thumb} alt={restaurant.name} className="thumb-image" />
    <div className="links-content">
        <p><strong>Menu URL:</strong> <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer">View Menu</a></p>
        <p><strong>Events URL:</strong> <a href={restaurant.events_url} target="_blank" rel="noopener noreferrer">View Events</a></p>
        <p><strong>Photos URL:</strong> <a href={restaurant.photos_url} target="_blank" rel="noopener noreferrer">View Photos</a></p>
        <p><strong>Deep Link:</strong> <a href={restaurant.deeplink} target="_blank" rel="noopener noreferrer">View Restaurant</a></p>
        <p><strong>URL:</strong> <a href={restaurant.url} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
    </div>
</div>
        </div>
    );
};

export default RestaurantDetails;