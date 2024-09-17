// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">MEALMAP</Link>
                
            </div>
        </nav>
    );
};

export default NavBar;