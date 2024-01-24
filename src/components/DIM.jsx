import { useState, useEffect } from 'react'
import '../routes/Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';
import NDIM from './NDIM';
import Card from "./Card.jsx"
import axios from 'axios';

function DIM({ dim }) {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const IMAGE_KEY = import.meta.env.IMAGE_KEY;

    const amadeusApiKey = import.meta.env.VITE_AMADEUS_API_KEY;
    const amadeusApiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);


    const [display, setDisplay] = useState(false);
    //const [pdf, setPDF] = useState(null);
    //const [pdfURL, setPDFURL] = useState("");

    //If they know where they want to go
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

    /*const handleSubmit = () => {
        if (location != "" && budget != "" && activities != "") {
            setLocation("");
            setBudget("")
            setActivities("");
            let selected_div = document.querySelector('.results');
            selected_div.innerHTML = '';
            setDisplay(true);
            fetchData("I want to " + activities + " in " + location + ". My budget is " + budget + ". Put it in a numbered list with a title and details. Include price rounded to the nearest whole number.");
        }
    }*/

    function uncheckAllCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }




    /*let location ="";
    
    function generateLocation(prompt) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
        return model.generateContent(prompt)
            .then(results => {
                console.log("LRESULTS: ", results);
                const response = results.response;
                console.log(":RESPONSE: ", response);
                const text = response.text();
                console.log("LTEXT: \n", text);
                location = text;
            })
            .catch(error => {
                setLocation("ERROR, try again");
                console.log("ERROR: ", error);
            });
    }*/

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

        let selected_div = document.querySelector('.results');
        selected_div.innerHTML = '';

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
            if (selectedCountry == "")
                alert("Location cannot be empty, try again");
            else
                temp += "I would like to do the aforementioned activities in " + selectedCountry + ". Please put the generated activities in a numbered list (1.,2.,3.,etc.) each with a title and detailed bullet points. Go directly into the numbered list, no general title or anything else on the first line. Include price rounded to the nearest whole number.";
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
                    .replace(/\*\*([\s\S]*?)\*\*/g, '[$1]')
                    .replace(/^(\s*)\* (.*)$/gm, '$1\t• $2'));
                n++;
                prev = i;
            }
        }
        ret.push(input.substring(prev, input.length)
            .replace(/\*\*([\s\S]*?)\*\*/g, '[$1]')
            .replace(/^(\s*)\* (.*)$/gm, '$1\t• $2'));
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

    const [displayName, setDisplayName] = useState('');

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value);
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
            await savePdfUrlToFirestore(downloadURL, displayName);
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
        setResponse("");
    }

    const savePdfUrlToFirestore = async (pdfUrl) => {
        await addDoc(collection(db, "itineraries"), {
            userId: auth.currentUser.uid,
            pdfUrl,
            displayName,
            createdAt: new Date()
        });
    }

    const [selectedCountry, setSelectedCountry] = useState('');
    if (dim == "Yes") {
        var country_list = ["None", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

        useEffect(() => {
            const countrySelect = document.getElementById("country");
            console.log(countrySelect);
            country_list.forEach(country => {
                const option = document.createElement("option");
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            }, []);


        })
    }
    const CountryHandleChange = (event) => {
        console.log(event.target.value);
        setSelectedCountry(event.target.value);
    }

    const getAccessToken = async () => {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');

            params.append('client_id', amadeusApiKey);

            params.append('client_secret', amadeusApiSecret);

            const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setToken(response.data.access_token)
            console.log(response.data.access_token);

        } catch (error) {
            console.error('Error getting access token:', error);
        }
    };

    const testFetch = async () => {
        const url = 'https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=PAR&maxPrice=200';
        const accessToken = token;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            //setData(responseData.data[0]);
            setData(responseData.data);
            console.log(data)

        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };

    return (
        <div>

            <button onClick={getAccessToken}> TEST </button>
            <br />
            <button onClick={testFetch}> Test 2 </button>

            {/* <Card input="cookie"></Card> */}
            {dim === "Yes" &&
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
                    <div>
                        <>
                            <label htmlFor="country">Country Name: &nbsp;</label>
                            <select id="country" onChange={CountryHandleChange}></select>
                            <br /><br />
                        </>
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


            {/* {(display && response == "") &&
                <div class="loader"></div>
            } */}
            <div className='results' id='makepdf' style={{ whiteSpace: 'pre-wrap' }}>
                {(display && response == "") &&
                    <div className="loader"></div>
                }
            </div>


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

                    <button onClick={saveItinerary}
                        disabled={!displayName.trim()}
                    >
                        Save Itinerary to Profile
                    </button>
                </div>}

            {response != "" && aiOutputFilter(response).map((item) => <Card input={item} />)}
        </div>
    )
}

export default DIM;