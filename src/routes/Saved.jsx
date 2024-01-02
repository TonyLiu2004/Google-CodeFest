import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Adjust these imports
import { collection, query, where, getDocs } from 'firebase/firestore';

function Saved() {

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
