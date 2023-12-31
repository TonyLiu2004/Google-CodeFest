import { useState } from 'react'
import '../routes/Travel.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function DIM() {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;

    const [display, setDisplay] = useState(false);

    //If they know where they want to go
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const [activity, setActivity] = useState("");
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
            each_item.style = "whiteSpace: 'pre-wrap';";
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

            <div>
                <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} value={location} /> <br />

                <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br />

                <input type="text" placeholder="Activity" onChange={(event) => setActivity(event.target.value)} value={activity} /> <br />

                <button id="searchButton" onClick={handleSubmit}>Submit</button> <br />

                <br></br>
                {display && <button id="pdfButton" onClick={makePDF}>Generate PDF</button>}
                <div className='results' id='makepdf' style={{ whiteSpace: 'pre-wrap' }}></div>
            </div>

        </div>
    )
}

export default DIM;