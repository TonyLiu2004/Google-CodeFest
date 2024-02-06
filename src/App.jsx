import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './routes/SignUp';
import SignIn from './routes/SignIn'
import Home from './routes/Home';
import About from './routes/About';
import Travel from './routes/Travel';
import Saved from './routes/Saved';
import FlightSearchComponent from './routes/PriceEstimator';
import DeleteAccount from './routes/Delete';
import ChangePassword from './routes/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/prices" element={<FlightSearchComponent />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App