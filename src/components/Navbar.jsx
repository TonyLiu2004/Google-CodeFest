import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [showSettings, setShowSettings] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const navigate = useNavigate();

    const [userAuth, setUserAuth] = useState(
        <>
            <Link to="/signin" className="nav-link"> Sign In </Link>
            <Link to="/signup" className="nav-link"> Sign Up </Link>
        </>
    );
    useEffect(() => {
        setShowIcon(sessionStorage.getItem("accessToken") != null)
        if (sessionStorage.getItem("accessToken") == null) {
            setUserAuth(
                <>
                    <Link to="/travel" className="nav-link">Guest-Mode</Link>
                    <Link to="/signin" className="nav-link"> Sign In </Link>
                    <Link to="/signup" className="nav-link"><button>Sign Up</button>  </Link>
                </>
            );
        } else {
            setUserAuth(
                <>
                    <Link to="/prices" className="nav-link"> Price Esimator </Link>
                    <Link to="/saved" className="nav-link"> Saved </Link>
                    <Link className="nav-link" onClick={() => { sessionStorage.removeItem("accessToken"); location.reload(); navigate('/'); }}> Logout </Link>
                </>
            );
        }
    }, [])

    const handleSettingsHover = () => {
        setShowSettings(!showSettings);
    };

    const SettingsMenu = () => {
        return (
            <div className="settings-dropdown">
                <Link to="/change-password" className="settings-link">Change Password</Link>
                <Link to="/delete-account" className="settings-link">Delete Account</Link>
            </div>
        );
    };

    return (
        <nav className="nav-container" style={{ padding: "12px" }}>
            {showIcon &&
                <div className="settings-icon" onMouseEnter={handleSettingsHover} onMouseLeave={handleSettingsHover}>
                    <FiSettings size={20} />
                    {showSettings && <SettingsMenu />}
                </div>
            }
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">Mission</Link>
            </div>
            <div className="auth-links">
                {userAuth}
            </div>
        </nav>
    );
}

export default Navbar;