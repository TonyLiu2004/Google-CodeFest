import { useState } from 'react'
import './Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
//import { db } from './firebaseConfig';
//import { collection, addDoc } from 'firebase/firestore';

function Travel() {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;

    const [destinationInMind, setDIM] = useState("");
    const [display, setDisplay] = useState(false);

    //If they know where they want to go
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const [activity, setActivity] = useState("");
    const [response, setResponse] = useState("");

    //To help create
    const [climate, setClimate] = useState(""); // maybe remove
    const [activities, setActivities] = useState([]); // they can select multiple activities
    const [activityString, setActivityString] = useState("");

    const [months, setMonths] = useState([]); // they can select multiple months
    const [monthString, setMonthString] = useState("");

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

    const handleSubmit = () => {
        if (location != "" && budget != "" && activity != "") {
            setLocation("");
            setBudget("")
            setActivity("");
            let selected_div = document.querySelector('.results');
            selected_div.innerHTML = '';
            setDisplay(true);
            fetchData();
        }
    }

    async function fetchData() {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const results = await model.generateContent("I want to " + activity + " in " + location + ". My budget is " + budget + ". Put it in a list with a title and details");
            console.log("RESULTS: ", results);
            const response = results.response;
            console.log("RESPONSE: ", response);
            const text = response.text();
            console.log("TEXT: \n", text);
            setResponse(text);
        }
        catch (error) {
            setResponse("ERROR, try again");
            console.log("ERROR: ", error);
        }
    }
    
    if (response != "") {
        let selected_div = document.querySelector('.results');
        let list = response.split("\n");
        for (let i = 0; i < list.length; i++) {
            var each_item = document.createElement('p');
            each_item.style="whiteSpace: 'pre-wrap';";
            each_item.textContent = list[i];
            each_item.innerHTML = each_item.innerHTML.replace(/\*\*(.*?)\*\*/g, '[$1]');
            each_item.innerHTML = each_item.innerHTML.replace('\*', '&#9; &bull;');
            selected_div.appendChild(each_item);
        }
        setResponse("");
        list = {};
    }

    const makePDF = () => {

        let pdfButton = document.getElementById("pdfButton");
        let makepdf = document.getElementById("makepdf");
        let mywindow = window.open("", "PRINT",
            "height=400,width=600");

  mywindow.document.write(`
    <html>
      <head>
        <style>
          .bordered-container {
            border: 1px solid #000; 
            border-radius: 5px;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        <div class="bordered-container">
          ${makepdf.innerHTML}
        </div>
      </body>
    </html>
  `);

        mywindow.document.close();
        mywindow.focus();

        mywindow.print();
        mywindow.close();

        return true;
    }

    return (
        <div>

            <h1>
                Travel Planner
            </h1>

            {destinationInMind === "" &&

                <h2>
                    Do you have a destination in mind?
                </h2>
            }


            {destinationInMind === "" &&
                <button onClick={() => setDIM("Yes")}> Yes </button>
            }

            {destinationInMind === "" && <br />}

            {destinationInMind === "" &&
                <button onClick={() => setDIM("No")}> No </button>}

            {destinationInMind === "No" &&
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

                </div>}

            {destinationInMind === "Yes" && <div>
                <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} value={location} /> <br />

                <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br />

                <input type="text" placeholder="Activity" onChange={(event) => setActivity(event.target.value)} value={activity} /> <br />

                <button id="searchButton" onClick={handleSubmit}>Submit</button> <br />

                <br></br>
                {display && <button id="pdfButton" onClick={makePDF}>Generate PDF</button>}
                <div className='results' id='makepdf' style={{ whiteSpace: 'pre-wrap' }}></div>
            </div>}

        </div>
    )
}

export default Travel;