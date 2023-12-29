import React from "react";
import { useNavigate } from 'react-router-dom';

function About() {

    const navigate = useNavigate();
    return (
        <div>
            This is an about page

            <br></br>

            <button onClick={() => navigate("/travel")}> Travel Generator </button>

        </div >
    )
}

export default About;