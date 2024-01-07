import { useState } from 'react'
import './Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
//import { db } from './firebaseConfig';
//import { collection, addDoc } from 'firebase/firestore';
import DIM from '../components/DIM';
import NDIM from '../components/NDIM';

function Travel() {
    const [destinationInMind, setDIM] = useState("");

    return (
        <div>
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
                <DIM dim = {destinationInMind}/>
                {/* <NDIM/> */}
            </div>}

        </div>
    )
}

export default Travel;