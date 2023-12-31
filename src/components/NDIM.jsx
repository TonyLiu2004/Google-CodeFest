import { useState } from 'react'
import '../routes/Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
//import { db } from './firebaseConfig';
//import { collection, addDoc } from 'firebase/firestore';

function NDIM() {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;

    const [display, setDisplay] = useState(false);

    //To help create
    const [climate, setClimate] = useState(""); // maybe remove

    const [activities, setActivities] = useState([]); // they can select multiple activities
    const [activityString, setActivityString] = useState("");

    const [months, setMonths] = useState([]); // they can select multiple months
    const [monthString, setMonthString] = useState("");

    const [days, setDays] = useState(0);

    const handleActivity = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setActivities([...activities, value]);
        }
        else {
            setActivities(activities.filter((item) => item !== value));
        }
    }

    const handleMonth = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMonths([...months, value]);
        }
        else {
            setMonths(months.filter((item) => item !== value));
        }
    }

    const handleClimate = (event) => {
        setClimate(event.target.value);
    }

    const handleDaysInput = (event) => {
        setDays(event.target.value);
    }

    const beginGenerate = (event) => {
        event.preventDefault();
        let activityString1 = "";
        let monthString1 = "";

        for (let i = 0; i < activities.length; i++) {
            activityString1 += activities[i];
            if (i != activities.length - 1) {
                activityString1 += ", ";
            }
        }
        setActivityString(activityString1);
        setActivities([]);

        for (let i = 0; i < months.length; i++) {
            monthString1 += months[i];
            if (i != months.length - 1) {
                monthString1 += ", ";
            }
        }
        setMonthString(monthString1);
        setMonths([]);

        fetchData();
    }

    async function fetchData() {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const results = await model.generateContent("Create an itinerary for a location that matches the following criteria: " + activityString + " in " + monthString + " with a " + climate + " climate for " + days + " days");
            console.log("RESULTS: ", results);
            const response = results.response;
            console.log("RESPONSE: ", response);
            const text = response.text();
            console.log("TEXT: \n", text);
            //setResponse(text);
        }
        catch (error) {
            setResponse("ERROR, try again");
            console.log("ERROR: ", error);
        }
    }

    return (
        <div>
            <div>
                <form>
                    <h3>Desired Activities:</h3>
                    <label>
                        <input type="checkbox" value="Food and Drinks" onChange={handleActivity} /> Food and Drinks
                    </label>
                    <br></br>
                    <label>
                        <input type="checkbox" value="Sightseeing" onChange={handleActivity} /> Sightseeing
                    </label>
                    <br></br>
                    <label>
                        <input type="checkbox" value="Outdoor adventures" onChange={handleActivity} /> Outdoor adventures
                    </label>
                    <br></br>
                    <label>
                        <input type="checkbox" value="Shopping" onChange={handleActivity} /> Shopping
                    </label>
                </form>
                <br />

                <form>
                    <h3>Desired month(s):</h3>
                    <label>
                        <input type="checkbox" value="January" onChange={handleMonth} /> January
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="February" onChange={handleMonth} /> February
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="March" onChange={handleMonth} /> March
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="April" onChange={handleMonth} /> April
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="May" onChange={handleMonth} /> May
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="June" onChange={handleMonth} /> June
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="July" onChange={handleMonth} /> July
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="August" onChange={handleMonth} /> August
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="September" onChange={handleMonth} /> September
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="October" onChange={handleMonth} /> October
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="November" onChange={handleMonth} /> November
                    </label>

                    <br />

                    <label>
                        <input type="checkbox" value="December" onChange={handleMonth} /> December
                    </label>

                    <br />
                </form>

                <div className='climate'>
                    <label htmlFor="climate">Choose a Climate:</label>
                    <select name="climate" id="climate" form="climateform" onChange={handleClimate}>
                        <option value="Tropical">Tropical</option>
                        <option value="Dry">Dry</option>
                        <option value="Temperate">Temperate</option>
                        <option value="Continental">Continental</option>
                        <option value="Polar">Polar</option>
                    </select>
                </div>

                <label htmlFor="days">Number of Days:</label>
                <input
                    type="number"
                    id="days"
                    value={days}
                    onChange={handleDaysInput}
                    min="1"
                    max="30"
                />

                <br></br>
                <button onClick={beginGenerate}> Generate </button>

            </div>
        </div>
    )
}

export default NDIM;