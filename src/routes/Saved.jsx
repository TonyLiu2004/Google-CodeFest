import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

    return (
        <div>

            {itineraries.length > 0 ? (
                <ul>
                    {itineraries.map((url, index) => (
                        <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer"> View itinerary </a>
                            {console.log(url)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved itineraries</p>
            )}

        </div>
    );
}

export default Saved;
