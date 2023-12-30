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
        if(sessionStorage.getItem("accessToken") == null){
            setUserAuth(
                <>
                    <Link to="/signin" className="nav-link"> Sign In </Link> 
                    <Link to="/signup" className="nav-link"> Sign Up </Link>
                </>
            );
        }else{
            setUserAuth(
                <Link className="nav-link" onClick={() => { sessionStorage.removeItem("accessToken"); location.reload(); }}> Logout </Link>
            );
        }
    },[])
    return (
        <nav>
            <Link to="/" className="nav-link">About</Link>
            <div className="auth-links">
                { userAuth }
            </div>
        </nav>
    );
}

export default Navbar;