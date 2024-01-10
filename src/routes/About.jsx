import React from "react";
import Feature from "../components/Feature";
import "./About.css"

import pencil from "../assets/pencil_logo-removebg-preview.png"
import puzzle from "../assets/puzzle_icon-removebg-preview.png"
import sneaker from "../assets/sneaker_icon-removebg-preview.png"
import { useNavigate } from 'react-router-dom';

function About() {
    return (
        <div className="about">
            <div className="about__heading">
                <h1>What we do</h1>
            </div>
            <div className="about__contents">
                <Feature imgUrl = {pencil} title="Plan" desc="A vacation shouldn't be stressful to plan, let us do all the work for you" />
                <Feature imgUrl = {puzzle} title="Customize" desc='From hiking to museums to restaurants, we customize the itinerary entirely to how you want your vacation to look like' />
                <Feature imgUrl = {sneaker} title="Go" desc='Create, save and download your favorite plans at any time from any where. Share the plan with your loved ones as well so they can share the journey with you.' />
            </div>
        </div >
    )
}

export default About;