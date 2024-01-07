import { useState } from 'react'
import '../routes/Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';

function DIM({dim}) {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const IMAGE_KEY = import.meta.env.IMAGE_KEY;

    const [display, setDisplay] = useState(false);
    //const [pdf, setPDF] = useState(null);
    //const [pdfURL, setPDFURL] = useState("");

    //If they know where they want to go
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const [activity, setActivity] = useState("");

    const [duration, setDuration] = useState("");
    const [group, setGroup] = useState(0);
    const [style, setStyle] = useState("");
    const [interests, getInterests] = useState("");
    const [climate, setClimate] = useState("");
    const [response, setResponse] = useState("");

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

    const handleSubmitNDIM = () => {
        console.log("handlesubmit ndim");
        console.log("CLIMATE: ", climate);
    }
    const aiOutputFilter = (input) => { //split the ai output into a list of strings
        let ret = [];
        let n = 1;
        let prev = 0;
        for(let i = 0;i < input.length; i++){
            let s = n + ".";
            if(input.substring(i,i + s.length) === s){
                ret.push(input.substring(prev,i));
                n++;
                prev = i;
            }
        }
        ret.push(input.substring(prev,input.length));
        return ret;
    }
    async function fetchData() {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const results = await model.generateContent("I want to " + activity + " in " + location + ". My budget is " + budget + ". Put it in a numbered list with a title and details. Include price rounded to the nearest whole number.");
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
        console.log(t)
        let selected_div = document.querySelector('.results');
        for(let i = 1; i < t.length; i++){ // ignore i=0 because it's the title
            var each_item = document.createElement('p');
            each_item.style = "whiteSpace: 'pre-wrap';";
            each_item.textContent = t[i];
            each_item.innerHTML = each_item.innerHTML.replace(/\*\*(.*?)\*\*/g, '[$1]');
            each_item.innerHTML = each_item.innerHTML.replace('\*', '&#9; &bull;');
            each_item.innerHTML += "<br/><br/>";
            selected_div.appendChild(each_item);
        }
        // let list = response.split("\n");
        // for (let i = 0; i < list.length; i++) {
        //     var each_item = document.createElement('p');
        //     each_item.style = "whiteSpace: 'pre-wrap';";
        //     each_item.textContent = list[i];
        //     each_item.innerHTML = each_item.innerHTML.replace(/\*\*(.*?)\*\*/g, '[$1]');
        //     each_item.innerHTML = each_item.innerHTML.replace('\*', '&#9; &bull;');
        //     selected_div.appendChild(each_item);
        // }
        // list = {};
        setResponse("");
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

                    <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br />

                    <input type="text" placeholder="Activity" onChange={(event) => setActivity(event.target.value)} value={activity} /> <br /> <br />

                    <button id="searchButton" onClick={handleSubmit}> Generate Itinerary </button> <br />

                    <br></br>
                    <div className='results' id='makepdf' style={{ whiteSpace: 'pre-wrap' }}></div>

                    <br />
                </div>
            }
            {dim === "No" && 
                <div>
                    <label htmlFor="activities">Activities:</label><br/>
                    <select multiple name = "activities" id="activities" form="activitiesform" onChange={() => setActivity(document.getElementById("activities").value)}>
                        <option value="">No Preference</option>
                        <optgroup label = "Outdoors" >
                            <option value="Camping">Camping</option>
                            <option value="Hiking">Hiking</option>
                            <option value="Rock Climbing">Climbing</option>
                            <option value="Biking">Cycling</option>
                            <option value="Swimming">Swimming</option>
                        </optgroup>
                    </select>

                    <br/>
                    <label htmlFor="climate">Climate:</label>
                    <select name="climate" id="climate" form="climateform" onChange={() => setClimate(document.getElementById("climate").value)}>
                        <option value="">No Preference</option>
                        <option value="Tropical">Tropical</option>
                        <option value="Dry">Dry</option>
                        <option value="Temperate">Temperate</option>
                        <option value="Continental">Continental</option>
                        <option value="Polar">Polar</option>
                    </select>
                    <br/>

                    <button onClick={handleSubmitNDIM}> Generate Itinerary </button>
                </div>
            }


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