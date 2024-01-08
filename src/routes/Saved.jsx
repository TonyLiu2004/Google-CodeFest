import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Saved() {
    const [itineraries, setItineraries] = useState([]);

    const getSavedItineraries = async (userId) => {
        const allItineraries = collection(db, "itineraries"); //get all itineraries from the db
        const q = query(allItineraries, where("userId", "==", userId)); //query for specific itineraries
        const userItineraries = await getDocs(q); //get actual docs
        return userItineraries.docs.map(doc => doc.data().pdfUrl);
    }

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            getSavedItineraries(currentUser.uid)
                .then(setItineraries)
                .catch(error => console.error("Error fetching itineraries: ", error));
        }
    }, []);

    const navigate = useNavigate();

    return (
        <div>

            {itineraries.length > 0 ? (
                <ul>
                    {itineraries.map((url, index) => (
                        <li key={index}>
                            <a href={url} target="_blank"> View itinerary </a>
                            {console.log(url)}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <h1> No saved itineraries </h1>
                    <button onClick={() => navigate("/travel")}> To Travel Generator </button>
                </div>
            )}

        </div>
    );
}

export default Saved;
