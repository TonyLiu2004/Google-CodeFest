import React from "react";
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>

            <Link to="/" className="nav-link">About</Link>

            <div className="auth-links">

                <Link to="/signin" className="nav-link"> Sign In </Link> /

                <Link to="/signup" className="nav-link"> Sign Up </Link>

            </div>
        </nav>
    );
}

export default Navbar;