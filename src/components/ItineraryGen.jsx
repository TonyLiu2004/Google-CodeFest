import { useState, useEffect } from 'react'
import '../routes/Travel.css'
import React from 'react';
//import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from '../firebaseConfig.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import Card from "./Card.jsx";

function ItineraryGenerator({ dim }) {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;

    const [display, setDisplay] = useState(false);

    const [budget, setBudget] = useState(0);
    const [activities, setActivities] = useState("");
    const [otherActivities, setOtherActivities] = useState("");
    const [duration, setDuration] = useState(1);
    const [group, setGroup] = useState(1);
    const [style, setStyle] = useState("");
    const [climate, setClimate] = useState("");
    const [response, setResponse] = useState("");
    const [location, setLocation] = useState("");

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

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    function uncheckAllCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }

    const handleSubmitNDIM = () => {
        let activityString = "";
        setResponse("");
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

        // let selected_div = document.querySelector('.results');
        // selected_div.innerHTML = '';

        //formatting temp, temp is the prompt
        let temp = "";
        //let locationDetails = "";
        if (activityString == "") alert("Must choose an activity!");
        else temp = "I want to do these activities: " + activityString + ". "; /*locationDetails= "I want to do these activities: " + activityString + ". "*/
        if (climate != "") temp += "I want to do them in a place with a " + climate + " climate. ";



        if (style != "") temp += ". The style I am looking for in this trip is a " + style + " style. ";
        temp += "This trip will be " + duration + " days long, my group size is " + group + " and my budget is " + budget + " USD.";

        setDisplay(true);


        if (dim == "No") {
            temp += "Please mention one suitable country put the generated activities in a numbered list with a title and details. Include price rounded to the nearest whole number.";
        } else {
            if (location == "")
                alert("Location cannot be empty, try again");
            else
                temp += "I would like to do the aforementioned activities in " + location + ". Please put the generated activities in a numbered list (1.,2.,3.,etc.) each with a title and detailed bullet points. Go directly into the numbered list, no general title or anything else on the first line. Include price rounded to the nearest whole number.";
        }
        console.log(temp);
        //resetting inputs
        uncheckAllCheckboxes();
        if (dim == "No") {
            const climateSelect = document.getElementById('climate');
            climateSelect.value = '';
        }
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
                ret.push(input.substring(prev, i)
                    .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
                    .replace(/^(\s*)\* (.*)$/gm, '$1\t• $2'));
                n++;
                prev = i;
            }
        }
        ret.push(input.substring(prev, input.length)
            .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
            .replace(/^(\s*)\* (.*)$/gm, '$1\t• $2'));
        return ret;
    }


    async function fetchData(query) {
        try {
            const response = await fetch('http://localhost:3005/api/generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Full RESPONSE: ", data);

            let textContent = '';
            if (data && data.response && data.response.candidates && data.response.candidates.length > 0 &&
                data.response.candidates[0].content && data.response.candidates[0].content.parts &&
                data.response.candidates[0].content.parts.length > 0 && data.response.candidates[0].content.parts[0].text) {
                textContent = data.response.candidates[0].content.parts[0].text;
                console.log("Extracted Text: ", textContent);

                const filteredOutput = aiOutputFilter(textContent).filter(item => item.length != 0);
                console.log("Filtered Output: ", filteredOutput);

                setResponse(filteredOutput.join('\n'));
            } else {
                console.error("Invalid or missing text content in response", data);
                setResponse("ERROR, unexpected response format");
            }
        } catch (error) {
            console.error("ERROR: ", error);
            setResponse("ERROR, try again");
        }
    }



    /* 
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
 */
    // if (response != "") {
    //     let t = aiOutputFilter(response);
    //     let selected_div = document.querySelector('.results');
    //     for (let i = 0; i < t.length; i++) {
    //         var each_item = document.createElement('p');
    //         each_item.style = "whiteSpace: 'pre-wrap';";
    //         each_item.textContent = t[i];
    //         each_item.innerHTML += "<br/><br/>";
    //         selected_div.appendChild(each_item);
    //     }
    //     //setResponse("");
    // }
    const makePDF = () => {
        const cardContainer = document.createElement('div');
        cardContainer.innerHTML = document.getElementsByClassName("cards")[0].innerHTML;
        const modifiedHTML = cardContainer.innerHTML
            .replace(/<p id="card-text"/g, '<p style="white-space: pre-wrap; text-align: left; margin-right:30px; margin-left:10px; " id="card-text"')
            .replace(/<div class="card"/g, '<div style="display: flex; justify-content: space-between; border: 1px solid black; border-radius: 4px; background-color: rgba(56, 56, 56, 0.611); margin-bottom:10px"')
            .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, '<img style="width: 35%; height: auto; max-width: 400px; max-height: 400px;" src="$1" />');

        let mywindow = window.open("", "PRINT", "height=400,width=600");
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
                    ${modifiedHTML}
                </div>
            </body>
            </html>
        `);

        mywindow.document.close();
        mywindow.focus();
        let totalImages = cardContainer.querySelectorAll('img').length;

        setTimeout(() => {
            mywindow.print();
            mywindow.close();
        }, totalImages * 100);

        return modifiedHTML;
    }

    const [displayName, setDisplayName] = useState('');

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value);
    }


    const [loaderIteniery, setLoaderItinerary] = useState(false);

    const saveItinerary = async () => {
        setLoaderItinerary(true);
        const pdf = new jsPDF("p", "mm", "a4");
        const data = document.getElementById("cards");
        try {
            const canvas = await html2canvas(data, { logging: true, letterRendering: 1, useCORS: true });
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            const imgData = canvas.toDataURL("image/png");
            const totalPages = Math.ceil(imgHeight / pdf.internal.pageSize.getHeight());
            // Loop through pages
            for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
                // Add a new page for each iteration
                if (pageIndex > 0) {
                    pdf.addPage();
                }

                // Adjust y position based on the pageIndex
                const adjustedY = - (pageIndex * pdf.internal.pageSize.getHeight());

                pdf.addImage(imgData, "PNG", 0, adjustedY, imgWidth, imgHeight);
            }
            const pdfBlob = pdf.output('blob');
            const storage = getStorage();
            const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/itinerary-${Date.now()}.pdf`);

            await uploadBytes(storageRef, pdfBlob);
            const downloadURL = await getDownloadURL(storageRef);
            await savePdfUrlToFirestore(downloadURL, displayName);
            setLoaderItinerary(false);
            alert("Itinerary saved!");
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const savePdfUrlToFirestore = async (pdfUrl) => {
        await addDoc(collection(db, "itineraries"), {
            userId: auth.currentUser.uid,
            pdfUrl,
            displayName,
            createdAt: new Date()
        });
    }

    return (
        <div>
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

                {dim === "Yes" &&
                    <div>
                        <label htmlFor="location">Specific Location: &nbsp;</label>
                        <input type="text" id="location" value={location} placeholder="Enter a specific location" onChange={handleLocationChange} />
                        <br /><br />
                    </div>
                }

                {dim === "No" &&
                    <div>
                        <div>
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
                        </div>
                    </div>}

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

            <div id="cards" className="cards">
                {(display && response == "") ?
                    <div className="loader"></div>
                    : aiOutputFilter(response).map((item, index) => <Card key={index} index={index} input={item} />)
                }
            </div>
            <br />



            {display && <div>
                <button id="pdfButton" onClick={makePDF}>Generate PDF</button>
                <br />
                <br />

            </div>}

            {sessionStorage.getItem("accessToken") != null && display &&
                <div>
                    <input
                        type="text"
                        placeholder="Enter Display Name"
                        value={displayName}
                        onChange={handleDisplayNameChange}
                    />

                    <br />
                    <br />

                    {loaderIteniery && <><div className="loader"></div><br /></>}
                    <button onClick={saveItinerary}
                        disabled={!displayName.trim()}
                    >
                        Save Itinerary to Profile
                    </button>
                </div>}
        </div>
    )
}

export default ItineraryGenerator;