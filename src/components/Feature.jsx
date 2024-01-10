import React from 'react';
import './feature.css'

const Feature =({title,desc,imgUrl})=>{
    return(
        <div className='feature'>
                <img src={imgUrl} alt="" />
                <h3>{title}</h3>
                <p>{desc}</p>
        </div>
    )
}

export default Feature;