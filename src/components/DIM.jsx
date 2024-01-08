import { useState } from 'react'
import '../routes/Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';

function DIM({ dim }) {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const IMAGE_KEY = import.meta.env.IMAGE_KEY;

    const [display, setDisplay] = useState(false);
    //const [pdf, setPDF] = useState(null);
    //const [pdfURL, setPDFURL] = useState("");

    //If they know where they want to go
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState(0);
    const [activities, setActivities] = useState("");
    const [otherActivities, setOtherActivities] = useState("");

    const [duration, setDuration] = useState(1);
    const [group, setGroup] = useState(1);
    const [style, setStyle] = useState("");
    const [climate, setClimate] = useState("");
    const [response, setResponse] = useState("");


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

    const handleSubmit = () => {
        if (location != "" && budget != "" && activities != "") {
            setLocation("");
            setBudget("")
            setActivities("");
            let selected_div = document.querySelector('.results');
            selected_div.innerHTML = '';
            setDisplay(true);
            fetchData("I want to " + activities + " in " + location + ". My budget is " + budget + ". Put it in a numbered list with a title and details. Include price rounded to the nearest whole number.");
        }
    }

    function uncheckAllCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }
    const handleSubmitNDIM = () => {
        let activityString = "";
        if (activities != {} && activities != "") {
            activityString = activities.join(", ");
        }
        if (otherActivities != "") {
            if (activityString != "") activityString += ", " + otherActivities;
            else activityString += otherActivities;
        }

        if (isNaN(duration)) alert("Number of days must be a number above 1!");
        if (isNaN(group)) alert("Group size must be a number above 1!");
        if (isNaN(budget)) alert("Budget must be a number above 1!");

        let selected_div = document.querySelector('.results');
        selected_div.innerHTML = '';

        //formatting temp, temp is the prompt
        let temp = "";
        if (activityString == "") alert("Must choose an activity!");
        else temp = "I want to do these activities: " + activityString + ". ";
        if (climate != "") temp += "I want to do them in a place with a " + climate + " climate. ";
        if (style != "") temp += "The style I am looking for in this trip is a " + style + " style. ";
        temp += "This trip will be " + duration + " days long, my group size is " + group + " and my budget is " + budget + " USD. Please put it in a numbered list with a title and details. Include price rounded to the nearest whole number.";
        console.log(temp);
        setDisplay(true);

        //resetting inputs
        uncheckAllCheckboxes();
        const climateSelect = document.getElementById('climate');
        climateSelect.value = '';
        const styleSelect = document.getElementById('style');
        styleSelect.value = '';
        setDuration(1);
        setGroup(1);
        setBudget(0);
        setOtherActivities("");
        setClimate("");
        setActivities("");

        fetchData(temp);
    }
    const aiOutputFilter = (input) => { //split the ai output into a list of strings
        let ret = [];
        let n = 1;
        let prev = 0;
        for (let i = 0; i < input.length; i++) {
            let s = n + ".";
            if (input.substring(i, i + s.length) === s) {
                ret.push(input.substring(prev, i));
                n++;
                prev = i;
            }
        }
        ret.push(input.substring(prev, input.length));
        return ret;
    }
    async function fetchData(query) {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const results = await model.generateContent(query);
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
        let t = aiOutputFilter(response);
        let selected_div = document.querySelector('.results');
        for (let i = 0; i < t.length; i++) {
            var each_item = document.createElement('p');
            each_item.style = "whiteSpace: 'pre-wrap';";
            each_item.textContent = t[i];
            each_item.innerHTML = each_item.innerHTML.replace(/\*\*([\s\S]*?)\*\*/g, '[$1]');
            each_item.innerHTML = each_item.innerHTML.replace(/^(\s*)\* (.*)$/gm, '$1&#9; &bull; $2');
            each_item.innerHTML += "<br/><br/>";
            selected_div.appendChild(each_item);
        }
        //setResponse("");
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

    const saveItinerary = async () => {
        const doc = new jsPDF(); //using this so that it's automatically formatted for PDF

        // Formatting from GPT
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = 20;

        const lines = doc.splitTextToSize(response, pageWidth - 2 * margin);

        lines.forEach((line) => {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += 10;
        });

        const pdfBlob = doc.output('blob');

        const storage = getStorage();
        const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/itinerary-${Date.now()}.pdf`);

        try {
            await uploadBytes(storageRef, pdfBlob);
            const downloadURL = await getDownloadURL(storageRef);
            await savePdfUrlToFirestore(downloadURL);
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
        setResponse("");
    }

    const savePdfUrlToFirestore = async (pdfUrl) => {
        await addDoc(collection(db, "itineraries"), {
            userId: auth.currentUser.uid,
            pdfUrl,
            createdAt: new Date()
        });
    }

    return (
        <div>
            {dim === "Yes" &&
                <div>
                    <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} value={location} /> <br />

                    <input type="text" placeholder="Activity" onChange={(event) => setActivities(event.target.value)} value={activities} /> <br />

                    <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br /> <br />

                    <button id="searchButton" onClick={handleSubmit}> Generate Itinerary </button> <br />

                    <br></br>
                </div>
            }
            {dim === "No" &&
                <div id="theForm">
                    <form>
                        <div id="activitiesTop">
                            <h3 style={{ marginBottom: "0px" }}>Desired Activities:</h3>
                            <div style={{ display: "flex" }}>
                                <h3 style={{ marginBottom: "0px" }}> Other: &nbsp;</h3>
                                <input type="text" id="otherActivities" value={otherActivities} placeholder="Other Activities" onChange={(event) => setOtherActivities(event.target.value)}></input>
                            </div>
                        </div>
                        <div id="activitiesform">
                            <div className="subActivities">
                                <h4 style={{ marginBottom: "5px" }}>Outdoors</h4>
                                <label>
                                    <input type="checkbox" value="Camping" onChange={handleActivity} /> Camping
                                </label>
                                <label>
                                    <input type="checkbox" value="Biking" onChange={handleActivity} /> Biking
                                </label>
                                <label>
                                    <input type="checkbox" value="Hiking" onChange={handleActivity} /> Hiking
                                </label>
                                <label>
                                    <input type="checkbox" value="Swimming" onChange={handleActivity} /> Swimming
                                </label>
                            </div>
                            <div className="subActivities">
                                <h4 style={{ marginBottom: "5px" }}>Cultural</h4>
                                <label>
                                    <input type="checkbox" value="Museums and Art Galleries" onChange={handleActivity} /> Museums/Art
                                </label>
                                <label>
                                    <input type="checkbox" value="Historical tours" onChange={handleActivity} /> Historical tours
                                </label>
                                <label>
                                    <input type="checkbox" value="Local festivals" onChange={handleActivity} /> Local festivals
                                </label>
                                <label>
                                    <input type="checkbox" value="Performing arts" onChange={handleActivity} /> Performing arts
                                </label>
                            </div>
                            <div className="subActivities">
                                <h4 style={{ marginBottom: "5px" }}>City Exploration</h4>
                                <label>
                                    <input type="checkbox" value="City Tours" onChange={handleActivity} /> City Tours
                                </label>
                                <label>
                                    <input type="checkbox" value="Shopping" onChange={handleActivity} /> Shopping
                                </label>
                                <label>
                                    <input type="checkbox" value="Food" onChange={handleActivity} /> Food
                                </label>
                                <label>
                                    <input type="checkbox" value="Urban Parks" onChange={handleActivity} /> Urban Parks
                                </label>
                            </div>
                            <div className="subActivities">
                                <h4 style={{ marginBottom: "5px" }}>Nature</h4>
                                <label>
                                    <input type="checkbox" value="Safari Tours" onChange={handleActivity} /> Safari Tours
                                </label>
                                <label>
                                    <input type="checkbox" value="Bird Watching" onChange={handleActivity} /> Bird Watching
                                </label>
                                <label>
                                    <input type="checkbox" value="Nature Reserves" onChange={handleActivity} /> Nature Reserves
                                </label>
                                <label>
                                    <input type="checkbox" value="Sightseeing" onChange={handleActivity} /> Sightseeing
                                </label>
                            </div>
                            <div className="subActivities">
                                <h4 style={{ marginBottom: "5px" }}>Family</h4>
                                <label>
                                    <input type="checkbox" value="Amusement Parks" onChange={handleActivity} /> Amusement Parks
                                </label>
                                <label>
                                    <input type="checkbox" value="Zoos and Aquariums" onChange={handleActivity} /> Zoos and Aquariums
                                </label>
                                <label>
                                    <input type="checkbox" value="Beach" onChange={handleActivity} /> Beach
                                </label>
                                <label>
                                    <input type="checkbox" value="Cruise" onChange={handleActivity} /> Cruise
                                </label>
                            </div>
                        </div>
                    </form>

                    <hr /><br />
                    <label htmlFor="climate">Climate: &nbsp;</label>
                    <select style={{ fontSize: "14px" }} name="climate" id="climate" form="climateform" onChange={() => setClimate(document.getElementById("climate").value)}>
                        <option value="">No Preference</option>
                        <option value="Tropical">Tropical</option>
                        <option value="Dry">Dry</option>
                        <option value="Temperate">Temperate</option>
                        <option value="Continental">Continental</option>
                        <option value="Polar">Polar</option>
                    </select>
                    <br /><br />

                    <label htmlFor="style">Overall Style: &nbsp;</label>
                    <select style={{ fontSize: "14px" }} name="style" id="style" form="styleform" onChange={() => setStyle(document.getElementById("style").value)}>
                        <option value="">No Preference</option>
                        <option value="Adventurous">Adventurous</option>
                        <option value="Relaxed">Relaxed</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Urban">Urban</option>
                        <option value="Family">Family</option>
                    </select>
                    <br /><br />
                    <label htmlFor="days">Number of Days: &nbsp;</label>
                    <input
                        type="number"
                        id="days"
                        value={duration}
                        onChange={(event) => setDuration(Math.max(1, parseInt(event.target.value, 10)))}
                        min="1"
                    />
                    <br /><br />

                    <label htmlFor="groupSize">Group Size: &nbsp;</label>
                    <input
                        type="number"
                        id="groupSize"
                        value={group}
                        onChange={(event) => setGroup(Math.max(1, parseInt(event.target.value, 10)))}
                        min="1"
                    />
                    <br /><br />

                    <label htmlFor="budget">Budget (USD): &nbsp;</label>
                    <input
                        type="number"
                        id="budget"
                        placeholder="Enter your budget in USD"
                        value={budget}
                        onChange={(event) => setBudget(Math.max(0, parseInt(event.target.value, 10)))}
                    />
                    <br /><br /><hr /><br />
                    <button style={{ display: "block", margin: "0 auto" }} onClick={handleSubmitNDIM}> Generate Itinerary </button>
                    <br />
                </div>
            }
            <div className='results' id='makepdf' style={{ whiteSpace: 'pre-wrap' }}></div>


            {display && <div>
                <button id="pdfButton" onClick={makePDF}>Generate PDF</button>
                <br />
                <br />
                <button onClick={saveItinerary}> Save Itinerary to Profile </button>
            </div>}
        </div>
    )
}

export default DIM;