import React from "react";
import { Link } from 'react-router-dom';
import "../css/Footer.css";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-main">
                {/* Brand / About */}
                <div className="footer-section footer-about">
                    <h3 className="footer-title">MarketPlace</h3>
                    <p>A modern marketplace for buying and selling listings.</p>
                </div>

                {/* Navigation links */}
                <div className="footer-section footer-links">
                    <h4>Quick links</h4>
                    <Link to="/catalog">Catalog</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/my-listings">My Listings</Link>
                </div>

                {/* Support / Resources */}
                <div className="footer-section footer-support">
                    <h4>Support</h4>
                    <Link to="/profile">Profile</Link>
                    <Link to="/login">Login</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {year} MarketPlace — Built by Martin</p>
            </div>
        </footer>
    );
}
