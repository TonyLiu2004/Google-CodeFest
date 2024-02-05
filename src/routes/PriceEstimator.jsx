import React, { useState, useEffect } from 'react';
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
    const [findIATAOne, setFindIATAOne] = useState(''); // departure
    const [findIATATwo, setFindIATATwo] = useState(''); // arrival
    const [iataCodeOne, setIataCodeOne] = useState(null); // departure IATA
    const [iataCodeTwo, setIataCodeTwo] = useState(null); // arrival IATA

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
        setDisplay(false);
        await getCheapestFlights();
    };

    //example output:
    //2024-04-02T17:50:00
    function parseDate(date_and_time) {
        let formatted_date = "";

        let date = date_and_time.split('T')[0];
        let time = date_and_time.split('T')[1];

        let hour = time.split(':')[0];

        if (hour >= "12") {
            hour = hour - 12;
            time = `${hour}:${time.split(':')[1]} PM`;
        }
        else if (hour < "12") {
            time = `${hour}:${time.split(':')[1]} AM`;
        }

        let year = date.split('-')[0];
        let month = date.split('-')[1];
        let day = date.split('-')[2];

        if (month == "01") month = "January";
        else if (month == "02") month = "February";
        else if (month == "03") month = "March";
        else if (month == "04") month = "April";
        else if (month == "05") month = "May";
        else if (month == "06") month = "June";
        else if (month == "07") month = "July";
        else if (month == "08") month = "August";
        else if (month == "09") month = "September";
        else if (month == "10") month = "October";
        else if (month == "11") month = "November";
        else if (month == "12") month = "December";

        formatted_date = `${month} ${day}, ${year} at ${time}`;
        return formatted_date;
    }

    //console.log(parseDate("2024-04-02T17:50:00"));

    //Find IATA code function
    async function fetchData(query) {
        try {
            const response = await fetch('http://localhost:3005/api/generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            //console.log("Full RESPONSE: ", data);

            let textContent = '';
            if (data && data.response && data.response.candidates && data.response.candidates.length > 0 &&
                data.response.candidates[0].content && data.response.candidates[0].content.parts &&
                data.response.candidates[0].content.parts.length > 0 && data.response.candidates[0].content.parts[0].text) {

                textContent = data.response.candidates[0].content.parts[0].text;
                // console.log("Extracted Text: ", textContent);
                return textContent;

            } else {
                console.error("Invalid or missing text content in response", data);
            }
        } catch (error) {
            console.error("ERROR: ", error);
        }
    }

    async function FindCodeOne() {
        let iata = await fetchData(`Return only ONE IATA code for the following location: ${findIATAOne}`);
        //console.log("IATA CODE: ", iata);
        return iata;
    }

    async function setCodeOne() {
        let iata = await FindCodeOne();
        //console.log("IATA CODE SECOND FUNCTION: ", iata);
        setIataCodeOne(iata);
        //console.log("IATA CODE STATE: ", iataCodeOne);
    }

    async function FindCodeTwo() {
        let iata = await fetchData(`Return only ONE IATA code for the following location: ${findIATATwo}`);
        //console.log("IATA CODE: ", iata);
        return iata;
    }

    async function setCodeTwo() {
        let iata = await FindCodeTwo();
        //console.log("IATA CODE SECOND FUNCTION: ", iata);
        setIataCodeTwo(iata);
        //console.log("IATA CODE STATE: ", iataCodeTwo);
    }

    useEffect(() => {
        document.body.classList.add('price-estimator-background');
        return () => {
            document.body.classList.remove('price-estimator-background');
        };
    }, []);
    return (
        <div className="everything">
            {isLoading ? (
                <div className="loader"></div>
            ) : (
                <>

                    {/* STYLE THIS */}
                    <div className='aita-form'>
                        <h1> Need help finding an IATA code? </h1>

                        <input
                            type="text"
                            onChange={(e) => setFindIATAOne(e.target.value)}
                            placeholder="Departure Location"
                        >
                        </input>
                        <button onClick={() => setCodeOne()}> Find IATA </button>
                        <hr />
                        <br />
                        {iataCodeOne != null && <p>
                            {`IATA Code for ${findIATAOne} is: ${iataCodeOne}`}
                        </p>}

                        <br />

                        <input
                            type="text"
                            onChange={(e) => setFindIATATwo(e.target.value)}
                            placeholder="Arrival Location"
                        >
                        </input>

                        <button onClick={() => setCodeTwo()}> Find IATA </button>
                        <br />
                        {iataCodeTwo != null && <p>
                            {`IATA Code for ${findIATATwo} is: ${iataCodeTwo}`}
                        </p>}

                        
                    </div>
                    {/* STYLE THIS */}

                    {display && (
                        <div className="form-container">
                            <h1 style={{ textAlign: "left", paddingLeft: "10px", width: "45vw", paddingBottom: "10px " }}>Price Estimator</h1>
                            <form onSubmit={handleSearch} className="flight-search-form">
                                <h2 className="form-title">Flight Information</h2>
                                <div id="flight-info">
                                    <div className="form-group">
                                        <label className="form-label">Origin (IATA Code):</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                                            placeholder="Origin"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Destination (IATA Code):</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value.toUpperCase())}
                                            placeholder="Destination"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Flight Class:</label>
                                        <select
                                            className="form-input"
                                            value={flightClass}
                                            onChange={(e) => {
                                                //console.log("Selected flight class:", e.target.value);
                                                setFlightClass(e.target.value);
                                            }}
                                        >
                                            <option value="ECONOMY">Economy</option>
                                            <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                            <option value="BUSINESS">Business</option>
                                            <option value="FIRST">First</option>
                                        </select>
                                    </div>
                                </div>

                                <h2 className="form-title">Passenger Information</h2>
                                <div id="passenger-info">
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
                                </div>

                                <h2 className="form-title">Travel Details</h2>
                                <div id="travel-info">
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
                                        <label className="form-label" style={{ paddingTop: "30px", textAlign: "left" }}>
                                            Non-stop flight? &nbsp;
                                            <input
                                                type="checkbox"
                                                checked={nonStop}
                                                onChange={(e) => setNonStop(e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div id="button-flex">
                                    <>&nbsp;</>
                                    <button className="submit-button" type="submit">Search Flights</button>
                                    <>&nbsp;</>
                                </div>
                            </form>
                        </div>
                    )}

                    {flights.length > 0 ? (
                        <div className="flight-details">
                            <h2>Potential Flight Details</h2>
                            <hr />
                            {flights.map((flight, flightIndex) => (
                                <div key={flightIndex}>
                                    <h3>Outbound Flight:</h3>
                                    {flight.itineraries[0].segments.map((segment, segmentIndex) => (
                                        <p key={segmentIndex}>
                                            {`From: ${segment.departure.iataCode} to ${segment.arrival.iataCode}, Departure Time: ${parseDate(segment.departure.at)}, Arrival Time: ${parseDate(segment.arrival.at)}`}
                                            {segmentIndex < flight.itineraries[0].segments.length - 1 ? " \nLayover:" : ""}
                                        </p>
                                    ))}

                                    {flight.itineraries.length > 1 && (
                                        <>
                                            <h3>Return Flight:</h3>
                                            {flight.itineraries[1].segments.map((segment, segmentIndex) => (
                                                <p key={segmentIndex}>
                                                    {`From: ${segment.departure.iataCode} to ${segment.arrival.iataCode}, Departure Time: ${parseDate(segment.departure.at)}, Arrival Time: ${parseDate(segment.arrival.at)}`}
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
                        <div className="flight-details">No flights found for the specified criteria. Please try again with different parameters.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default FlightSearchComponent;
