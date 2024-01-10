import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Navbar() {
    const [userAuth, setUserAuth] = useState(
        <>
            <Link to="/signin" className="nav-link"> Sign In </Link>
            <Link to="/signup" className="nav-link"> Sign Up </Link>
        </>
    );
    useEffect(() => {
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
                    <Link to="/saved" className="nav-link"> Saved </Link>
                    <Link className="nav-link" onClick={() => { sessionStorage.removeItem("accessToken"); location.reload(); }}> Logout </Link>
                </>
            );
        }
    }, [])
    return (
        <nav>
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