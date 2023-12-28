import { useState } from 'react'
import './App.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [activity, setActivity] = useState("");
  const [response, setResponse] = useState("");
  let formatted = "";
  const handleSubmit = () => {
    if (location != "" && budget != "" && activity != "") {
      setLocation("");
      setBudget("")
      setActivity("");
      let selected_div = document.querySelector('.results');
      selected_div.innerHTML = '';
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
    } catch (error) {
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
      <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} value={location} /> <br />
      <input type="text" placeholder="Budget" onChange={(event) => setBudget(event.target.value)} value={budget} /> <br />
      <input type="text" placeholder="Activity" onChange={(event) => setActivity(event.target.value)} value={activity} /> <br />
      <button id="searchButton" onClick={handleSubmit}>Submit</button> <br />
      <div className='results'></div>
    </div>
  )
}

export default App
