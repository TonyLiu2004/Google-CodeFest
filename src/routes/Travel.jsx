import { useState, useEffect } from 'react'
import './Travel.css'
import React from 'react';
import ItineraryGenerator from '../components/ItineraryGen';

function Travel() {
    const [destinationInMind, setDIM] = useState("");
    useEffect(() => {
        document.body.classList.add('travel-page-background');
        return () => {
            document.body.classList.remove('travel-page-background');
        };
    }, []);

    return (
        <div className='travel'>
            {destinationInMind === "" && <div>
                <h1 id="travel-title" style={{color:"black"}}>
                    Travel Planner 
                </h1>
                <h2 id="travel-subtitle" style={{color:"black"}}>
                    Do you have a destination in mind? 
                </h2>

                <div id="travel-button-container">
                    <button className="travel-button" style={{backgroundColor:"rgba(0,140,255,255)"}}onClick={() => setDIM("Yes")}> 
                        <h2 className="button-title">Yes</h2> &nbsp;&nbsp;&nbsp;&nbsp;<p>I know where I want to go!</p>
                    </button>
                    <br/>
                    <button className="travel-button" style={{backgroundColor:"rgba(201,201,201,255)"}} onClick={() => setDIM("No")}> 
                        <h2 className="button-title">No</h2> &nbsp;&nbsp;&nbsp;&nbsp;<p>Find me a location!</p> 
                    </button>
                </div>

            </div>}

            {destinationInMind != "" && <div>
                <ItineraryGenerator dim={destinationInMind} />
            </div>}

        </div>
    )
}

export default Travel;