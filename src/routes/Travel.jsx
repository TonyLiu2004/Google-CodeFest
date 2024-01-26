import { useState } from 'react'
import './Travel.css'
import React from 'react';
import ItineraryGenerator from '../components/ItineraryGen';

function Travel() {
    const [destinationInMind, setDIM] = useState("");

    return (
        <div className='travel'>
            <h1>
                Travel Planner
            </h1>

            {destinationInMind === "" && <div>
                <h2>
                    Do you have a destination in mind?
                </h2>

                <button onClick={() => setDIM("Yes")}> Yes </button>
                <br />
                <button onClick={() => setDIM("No")}> No </button>

            </div>}

            {destinationInMind != "" && <div>
                <ItineraryGenerator dim={destinationInMind} />
            </div>}

        </div>
    )
}

export default Travel;