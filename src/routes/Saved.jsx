import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Saved() {

    return (
        <div>
            <h2>Saved Itineraries</h2>
        </div>
    );
}

export default Saved;
