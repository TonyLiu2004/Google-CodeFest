import React, { useState } from 'react';
import './PriceEstimator.css';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

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
    const [isLoading, setIsLoading] = useState(false);
    const [flights, setFlights] = useState([]);
    const [display, setDisplay] = useState(true);
    const [searched, setSearched] = useState(false);

    const fetchAccessToken = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/token`);
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const getCheapestFlights = async () => {
        setIsLoading(true);
        try {
            const tokenResponse = await fetchAccessToken();
            const token = tokenResponse;

            console.log(origin, destination, departureDate, returnDate, adults, children, infants, flightClass, nonStop)

            const queryParams = new URLSearchParams({
                origin: origin,
                destination: destination,
                departureDate: departureDate,
                returnDate: returnDate,
                adults: adults,
                children: children,
                infants: infants,
                travelClass: flightClass,
                nonStop: nonStop,
            }).toString();

            const response = await axios.get(`${BACKEND_URL}/search?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data && response.data.data.length > 0) {
                setFlights(response.data.data);
                console.log(response.data.data);
                setDisplay(false);
            } else {
                console.log("No flights found for the specified criteria.");
                setFlights([]);
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
            setFlights([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearched(true);
        await getCheapestFlights();
    };

    return (
        <div>
            {isLoading ? (
                <div className="loader"></div>
            ) : (
                <>
                    {display && (
                        <div>
                            <form onSubmit={handleSearch} className="flight-search-form">
                                <div className="form-group">
                                    <label className="form-label">Origin (IATA Code):</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        placeholder="Origin (IATA Code)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Destination (IATA Code):</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Destination (IATA Code)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Flight Class:</label>
                                    <select
                                        className="form-input"
                                        value={flightClass}
                                        onChange={(e) => {
                                            console.log("Selected flight class:", e.target.value);
                                            setFlightClass(e.target.value);
                                        }}
                                    >
                                        <option value="ECONOMY">Economy</option>
                                        <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                        <option value="BUSINESS">Business</option>
                                        <option value="FIRST">First</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Adults:</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={adults}
                                        onChange={(e) => setAdults(e.target.value)}
                                        placeholder="Adults"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Children:</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={children}
                                        onChange={(e) => setChildren(e.target.value)}
                                        placeholder="Children"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Infants:</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={infants}
                                        onChange={(e) => setInfants(e.target.value)}
                                        placeholder="Infants"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Departure Date:</label>
                                    <input
                                        className="form-input"
                                        type="date"
                                        value={departureDate}
                                        onChange={(e) => setDepartureDate(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Return Date:</label>
                                    <input
                                        className="form-input"
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Non-stop flight?
                                        <input
                                            type="checkbox"
                                            checked={nonStop}
                                            onChange={(e) => setNonStop(e.target.checked)}
                                        />
                                    </label>
                                </div>

                                <button className="submit-button" type="submit">Search Flights</button>
                            </form>
                        </div>
                    )}

                    {flights.length > 0 ? (
                        <div>
                            <h2>Potential Flight Details</h2>
                            <hr />
                            {flights.map((flight, flightIndex) => (
                                <div key={flightIndex}>
                                    <h3>Outbound Flight:</h3>
                                    {flight.itineraries[0].segments.map((segment, segmentIndex) => (
                                        <p key={segmentIndex}>
                                            {`From: ${segment.departure.iataCode} to ${segment.arrival.iataCode}, Departure Time: ${segment.departure.at}, Arrival Time: ${segment.arrival.at}`}
                                            {segmentIndex < flight.itineraries[0].segments.length - 1 ? " \nLayover:" : ""}
                                        </p>
                                    ))}

                                    {flight.itineraries.length > 1 && (
                                        <>
                                            <h3>Return Flight:</h3>
                                            {flight.itineraries[1].segments.map((segment, segmentIndex) => (
                                                <p key={segmentIndex}>
                                                    {`From: ${segment.departure.iataCode} to ${segment.arrival.iataCode}, Departure Time: ${segment.departure.at}, Arrival Time: ${segment.arrival.at}`}
                                                    {segmentIndex < flight.itineraries[1].segments.length - 1 ? " \nLayover:" : ""}
                                                </p>
                                            ))}
                                        </>
                                    )}

                                    <p>{`Price: ${flight.price.total} ${flight.price.currency}`}</p>
                                </div>
                            ))}
                        </div>
                    ) : searched && (
                        <div>No flights found for the specified criteria. Please try again with different parameters.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default FlightSearchComponent;
