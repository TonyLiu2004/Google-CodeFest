import { useState } from 'react'
import './App.css'
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './routes/SignUp';
import SignIn from './routes/SignIn';
import About from './routes/About';
import Travel from './routes/Travel';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Additional routes can be added here */}
      </Routes>
    </BrowserRouter>
  )
}

export default App