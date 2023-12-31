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

    const beginGenerate = (event) => {
        event.preventDefault();
        let activityString = "";
        let monthString = "";

        for (let i = 0; i < activities.length; i++) {
            activityString += activities[i];
            if (i != activities.length - 1) {
                activityString += ", ";
            }
        }
        setActivityString(activityString);
        setActivities([]);

        for (let i = 0; i < months.length; i++) {
            monthString += months[i];
            if (i != months.length - 1) {
                monthString += ", ";
            }
        }
        setMonthString(monthString);
        setMonths([]);

        console.log(monthString);
        console.log(activityString);
        console.log(climate)
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

                <br></br>
                <button onClick={beginGenerate}> Generate </button>

            </div>
        </div>
    )
}

export default NDIM;