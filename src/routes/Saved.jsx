import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Saved.css';

function Saved() {
    const [itineraries, setItineraries] = useState([]);

    const getSavedItineraries = async (userId) => {
        const allItineraries = collection(db, "itineraries");
        const q = query(allItineraries, where("userId", "==", userId));
        const userItineraries = await getDocs(q);
        return userItineraries.docs.map(doc => ({
            id: doc.id,
            pdfUrl: doc.data().pdfUrl,
            displayName: doc.data().displayName
        }));
    }

    const deleteItinerary = async (itineraryId) => {
        try {
            await deleteDoc(doc(db, "itineraries", itineraryId));
            setItineraries(itineraries.filter(item => item.id !== itineraryId));
        } catch (error) {
            console.error("Error deleting itinerary: ", error);
        }
    };

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
                <div className="itinerary-binder">
                    {itineraries.map((item, index) => (
                        <div className="itinerary-card" key={index}>
                            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">{item.displayName}</a>
                            <iframe
                                src={item.pdfUrl}
                                width="100%"
                                height="100%"
                                title={item.displayName}
                            ></iframe>
                            <button onClick={() => deleteItinerary(item.id)}>Delete</button>
                        </div>
                    ))}
                </div>
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
