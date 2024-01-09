import React from 'react';
import './feature.css'

const Feature =({title,desc})=>{
    return(
        <div className='feature'>
                <h3>{title}</h3>
                <p>{desc}</p>
        </div>
    )
}

export default Feature;