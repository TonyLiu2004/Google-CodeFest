import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
            <br />
            {itineraries.length > 0 ? (
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', listStyleType: 'none', padding: 0, }}>
                    {itineraries.map((item) => (
                        <li key={item.id} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', backgroundColor: '#36454f' }}>
                            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">{item.displayName}</a>
                            <iframe
                                src={item.pdfUrl}
                                style={{ width: '100%', height: '400px' }}
                                title={item.displayName}
                            ></iframe>
                            <button onClick={() => deleteItinerary(item.id)}>Delete</button>
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
