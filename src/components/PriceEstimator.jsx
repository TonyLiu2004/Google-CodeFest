import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
const TOKEN_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

const amadeusApiKey = import.meta.env.VITE_AMADEUS_API_KEY;
const amadeusApiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

const FlightSearchComponent = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [nonStop, setNonStop] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flightClass, setFlightClass] = useState('ECONOMY');
    const [flights, setFlights] = useState([]);

    const fetchAccessToken = async () => {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', amadeusApiKey);
        params.append('client_secret', amadeusApiSecret);

        try {
            const response = await axios.post(TOKEN_URL, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const getCheapestFlights = async (token) => {
        try {
            const response = await axios.get(`${API_URL}?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&children=${children}&infants=${infants}&nonStop=${nonStop}&currencyCode=USD&max=2`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFlights(response.data.data);
        } catch (error) {
            console.error("Error fetching flights", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = await fetchAccessToken();
            await getCheapestFlights(token);
        } catch (error) {
            console.error('Error in handleSearch:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />

                <br />

                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />

                <br />

                <input type="number" value={adults} onChange={(e) => setAdults(e.target.value)} />

                <br />

                <input type="number" value={children} onChange={(e) => setChildren(e.target.value)} />

                <br />

                <input type="number" value={infants} onChange={(e) => setInfants(e.target.value)} />

                <br />

                <label>
                    Non-stop flight?
                    <br />
                    <input
                        type="checkbox"
                        checked={nonStop}
                        onChange={(e) => setNonStop(e.target.checked)}
                    />
                </label>

                <br />

                <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />

                <br />

                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />

                <br />

                <button type="submit">Search Flights</button>
            </form>

            {flights.length > 0 && (
                <div>
                    <h2>Flight Results</h2>
                    {flights.map((flight, index) => (
                        <div key={index}>
                            <p>{`From: ${flight.itineraries[0].segments[0].departure.iataCode}, To: ${flight.itineraries[0].segments[0].arrival.iataCode}`}</p>
                            <p>{`Price: ${flight.price.total}`}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightSearchComponent;
