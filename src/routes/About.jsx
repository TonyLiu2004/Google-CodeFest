import React from "react";
import about1 from "../assets/about1.jpg"

import "./About.css"

import { useNavigate } from 'react-router-dom';

function About() {

    const navigate = useNavigate();
    return (
        <div className="about">
            <div className="about__heading">
                <div className="about__heading-image">
                <img src={about1} alt="hiking" />
                </div>
                <div className="about__heading-text">
                    <h1>Travel like a LOCO</h1>
                    <p>Plan your vacation efficiently with us</p>
                    <button onClick={() => navigate("/travel")}> Travel Generator </button>
                </div>
            </div>
            
            <br></br>

            

        </div >
    )
}

export default About;