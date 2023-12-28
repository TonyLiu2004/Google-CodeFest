import { useState } from 'react'
import './App.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const handleSubmit = () => {
    if(input != "") {
      console.log(input);
      setInput("");
      fetchData();
    }
  }

  async function fetchData(){
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const results = await model.generateContent(input);
      console.log("RESULTS: ", results);
      const response = results.response;
      console.log("RESPONSE: ", response);
      const text = response.text();
      console.log("TEXT: ", text);
      setResponse(text);
    } catch (error){
      setResponse("ERROR, try again");
      console.log("ERROR: ", error);
    }
  }

  return (
    <div>
      <input type="text" onChange={(event) => setInput(event.target.value)} value={input}/> <br/>
      <button id = "searchButton" onClick = {handleSubmit}>Submit</button> <br/>
      {response}
    </div>
  )
}

export default App
