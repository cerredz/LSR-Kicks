import React from 'react';
import "./HomepageReturn.css";
import { Link } from 'react-router-dom';


const HompageReturn = (props) => {
  return (
    <div className='homepage-container flex'>
       
       <Link className='link' to="/"> <button className='subheader-text'> Return to Homepage</button> </Link> 
        
    </div>
  )
}

export default HompageReturn