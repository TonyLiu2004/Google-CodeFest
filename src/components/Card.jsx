import React from "react";
import { useState, useEffect, forwardRef } from 'react';
import { createClient } from "pexels";
import './Card.css';

const Card = ({input, index }) => {
    //console.log("cardinput: ",input);
    const [img, setImg] = useState("");
    const client = createClient(
        "KUtGlNdqoJMg2UmXPMQUPhtbFH40Dv2TBiega6ochAT3ij6ZfRPKe7pF"
      );
      
    useEffect(() => {
        //client.photos.search({ input, per_page: 1 }).then(photos => console.log(photos));
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.pexels.com/v1/search?per_page=1&query=${input}`, {
                    headers: {
                        Authorization: "KUtGlNdqoJMg2UmXPMQUPhtbFH40Dv2TBiega6ochAT3ij6ZfRPKe7pF",
                    }
                });

                if (!response.ok) {
                    alert('Network response was not ok');
                }

                const data = await response.json();
                //console.log(data);
                setImg(data.photos[0].src.original);

            } catch (error) {
                alert('Error fetching data:', error);
            }
        };
        if(input != "") fetchData();
    }, [input]);
    //console.log(img);
    
    return (
        <>
            {img != "" &&
                <div className="card">
                    <p id="card-text">{input}</p>
                    <img id="card-image" src = {img} alt={input}/>
                </div>
            }
        </>
    )
}

export default Card;