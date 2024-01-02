import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Adjust these imports
import { collection, query, where, getDocs } from 'firebase/firestore';

function Saved() {
    const [itineraries, setItineraries] = useState([]);

    const fetchItineraries = async (userId) => {
        const itinerariesRef = collection(db, "itineraries"); //access itinerary collection
        const q = query(itinerariesRef, where("userId", "==", userId)); //getting itineraries for current user
        const querySnapshot = await getDocs(q); //getting all the itineraries for current user
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchItineraries(currentUser.uid)
                .then(setItineraries)
                .catch(error => console.error("Error fetching itineraries: ", error));
        }
    }, []);

    return (
        <div>
            <h2>Saved Itineraries</h2>
            {itineraries.length > 0 ? (
                <ul>
                    {itineraries.map(itinerary => (
                        <li key={itinerary.id}>
                            <a href={itinerary.pdfUrl} target="_blank" rel="noopener noreferrer">
                                View Itinerary
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved itineraries.</p>
            )}
        </div>
    );
}

export default Saved;
