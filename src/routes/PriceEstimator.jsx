import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './PriceEstimator.css';
import axios from 'axios';

const API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
const TOKEN_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

const amadeusApiKey = import.meta.env.VITE_AMADEUS_API_KEY;
const amadeusApiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;
const geminiApiKey = import.meta.env.VITE_APP_API_KEY;

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
    const [display, setDisplay] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(null);
    //const [formattedFlightData, setFormattedFlightData] = useState('');
    const [response, setResponse] = useState('TESTING');

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
        setIsLoading(true);
        setNoResults(false);
        try {
            const response = await axios.get(`${API_URL}?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&children=${children}&infants=${infants}&travelClass=${flightClass}&nonStop=${nonStop}&currencyCode=USD&max=1`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.data.length === 0) {
                setNoResults(true);
            } else {
                //setFlights(response.data.data);
                const formattedData = formatFlightData(response.data.data);
                //setFormattedFlightData(formattedData);
                const aiInput = `${formattedData} Convert this into english sentences. It is from an API that returns the details of a flight. Make it straight forward please. No extra just make the data into easy to read english sentences please. The data provided includes departure and arrival times both ways, duration, stops, and price. Make sure to separate the data into different sentences and lines.`
                await fetchData(aiInput);
                //console.log(formattedData);
            }
        } catch (error) {
            console.error("Error fetching flights", error);
        } finally {
            setIsLoading(false);
            setDisplay(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = await fetchAccessToken();
            await getCheapestFlights(token);
        } catch (error) {
            console.error('Error in handleSearch:', error);
            setIsLoading(false);
        }
    };

    const formatFlightData = (flights) => {
        return flights.map((flight, flightIndex) => {
            return flight.itineraries.map((itinerary, itineraryIndex) => {
                return itinerary.segments.map((segment, segmentIndex) => {
                    const departure = segment.departure;
                    const arrival = segment.arrival;
                    const duration = segment.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
                    const stops = segment.numberOfStops === 0 ? 'Direct' : `${segment.numberOfStops} stops`;
                    return `Segment ${segmentIndex + 1}: ${departure.iataCode} to ${arrival.iataCode}\n` +
                        `Carrier: ${segment.carrierCode}, Flight Number: ${segment.number}\n` +
                        `Departure: ${departure.at}, Arrival: ${arrival.at}\n` +
                        `Duration: ${duration}, Stops: ${stops}\n`;
                }).join('\n');
            }).join('\n');
        }).join('\n') + `\nPrice: ${flights[0].price.total}`;
    };

    async function fetchData(query) {
        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const results = await model.generateContent(query);

            const response = results.response;

            const text = response.text() + "*";

            const matches = text.match(/\*([^*]+)\*/g).map(item => item.trim().slice(1, -1).trim());

            setResponse(matches);
        }
        catch (error) {
            setResponse("ERROR, try again");
            console.log("ERROR: ", error);
        }
    }

    const listStyle = {
        listStyleType: 'none', // This removes the bullet points
        padding: 0, // This removes the default padding
        margin: 0 // This removes the default margin
    };

    return (
        <div>
            {isLoading ? (
                <div className="loader"></div>
            ) : (
                <>
                    {display && (
                        <div>
                            <form onSubmit={handleSearch}>
                                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
                                <br />
                                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
                                <br />
                                <label>
                                    Adults:
                                    <input type="number" value={adults} onChange={(e) => setAdults(e.target.value)} placeholder="Adults" />
                                </label>
                                <br />
                                <label>
                                    Children:
                                    <input type="number" value={children} onChange={(e) => setChildren(e.target.value)} placeholder="Children" />
                                </label>
                                <br />
                                <label>
                                    Infants:
                                    <input type="number" value={infants} onChange={(e) => setInfants(e.target.value)} placeholder="Infants" />
                                </label>
                                <br />
                                <label>
                                    Non-stop flight?
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
                        </div>
                    )}

                    {noResults == true && (
                        <div>No flights found for the specified criteria. Please try again with different parameters.</div>
                    )}

                    {noResults == false &&
                        <div>
                            <h2>Flight Results</h2>

                            <ul style={listStyle}>
                                {response.map((item, index) => (
                                    <li>{item}</li>
                                ))}
                            </ul>
                            {/* 
                            <ol>
                                {response.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
 */}

                        </div>}
                </>
            )}
        </div>
    );
};

export default FlightSearchComponent;
