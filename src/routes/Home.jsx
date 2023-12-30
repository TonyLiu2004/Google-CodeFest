import React from "react";
import about1 from "../assets/about1.jpg"

import "./Home.css"

import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();
    return (
        <div className="home">
            <div className="home__heading">
                <div className="home__heading-image">
                <img src={about1} alt="hiking" />
                </div>
                <div className="home__heading-text">
                    <h1>Travel like a LOCO</h1>
                    <p>Plan your vacation efficiently with us</p>
                    <button onClick={() => navigate("/travel")}> Travel Generator </button>
                </div>
            </div>
            
            <br></br>

            

        </div >
    )
}

export default Home;