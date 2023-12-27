import { useState } from 'react'
import './App.css'
import React from 'react';
function App() {
  const [input, setInput] = useState("");
  const handleSubmit = () => {
    console.log(input);
  }
  return (
    <div>
      <input type="text" onChange={(event) => setInput(event.target.value)}/> <br/>
      <button id = "searchButton" onClick = {handleSubmit}>Submit</button>
    </div>
  )
}

export default App
