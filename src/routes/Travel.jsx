import { useState } from 'react'
import './Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
//import { db } from './firebaseConfig';
//import { collection, addDoc } from 'firebase/firestore';

function Travel() {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;

    const [destinationInMind, setDIM] = useState("");

    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const [activity, setActivity] = useState("");
    const [response, setResponse] = useState("");

    const [count, setCount] = useState(0); // will change display of questions
    const [display, setDisplay] = useState(false);
    //const [season, setSeason] = useState(""); // maybe change to month
    //const [temp, setTemp] = useState("");
    //const [weather, setWeather] = useState(""); // maybe remove
    const [activityType, setActivityType] = useState([]); //they can pick multiple activities
    const [activityString, setActivityString] = useState("");

    const handleCheck = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setActivityType([...activityType, value]);
        }
        else {
            setActivityType(activityType.filter((item) => item !== value));
        }
    }

    const activitySubmit = (event) => {
        event.preventDefault();
        let activityString = "";

        for (let i = 0; i < activityType.length; i++) {
            activityString += activityType[i];
            if (i != activityType.length - 1) {
                activityString += ", ";
            }
        }

        setCount(count + 1);
        setActivityString(activityString);
        setActivityType([]);
        console.log(activityString);
    }



    let formatted = "";

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

            const results = await model.generateContent("I want to " + activity + " in " + location + ". My budget is " + budget);
            console.log("RESULTS: ", results);
            const response = results.response;
            console.log("RESPONSE: ", response);
            const text = response.text();
            console.log("TEXT: ", text);
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
            each_item.textContent = list[i];
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

        mywindow.document.write(makepdf.innerHTML);

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

            {destinationInMind != "No" && destinationInMind != "Yes" &&

                <h2>
                    Do you have a destination in mind?
                </h2>
            }


            {destinationInMind != "No" && destinationInMind != "Yes" &&
                <button onClick={() => setDIM("Yes")}> Yes </button>
            }

            {destinationInMind != "No" && destinationInMind != "Yes" && <br />}

            {destinationInMind != "No" && destinationInMind != "Yes" &&
                <button onClick={() => setDIM("No")}> No </button>}

            {destinationInMind === "No" && <div>
                {count === 0 && <form>

                    <label>

                        <input type="checkbox" value="Food and Drinks" onChange={handleCheck} /> Food and Drinks

                    </label>

                    <br></br>

                    <label>

                        <input type="checkbox" value="Sightseeing" onChange={handleCheck} /> Sightseeing

                    </label>

                    <br></br>

                    <label>

                        <input type="checkbox" value="Outdoor adventures" onChange={handleCheck} /> Outdoor adventures

                    </label>

                    <br></br>

                    <label>

                        <input type="checkbox" value="Shopping" onChange={handleCheck} /> Shopping

                    </label>

                    <br></br>
                    <button onClick={activitySubmit}> Submit </button>
                </form>
                }
            </div>}

            {destinationInMind === "Yes" && <div>
                <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} value={location} /> <br />

                <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br />

                <input type="text" placeholder="Activity" onChange={(event) => setActivity(event.target.value)} value={activity} /> <br />

                <button id="searchButton" onClick={handleSubmit}>Submit</button> <br />

                <br></br>
                {display && <button id="pdfButton" onClick={makePDF}>Generate PDF</button>}

                <div className='results' id='makepdf'></div>
            </div>}

        </div>
    )
}

export default Travel;