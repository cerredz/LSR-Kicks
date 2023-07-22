import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//import logo images
import insta from "../Assets/Instagram_logo_2022.svg.jpg"
import policies from "../Assets/policies-icon.png";
import youtube from "../Assets/youtube-icon.png";
import faq from "../Assets/question-icon.png";
import "./Questions.css";





const Questions = () => {

    const navigate = useNavigate();


    //if contact us button is pressed, we must check if the current user is signed in or not
    const handleContactClick = () => {
        
        localStorage.getItem("email") === null
        ? navigate("/signup/contact")
        : navigate("/contact");
    }

  return (
    <div className='questions-container'>

        <h1 data-aos="fade-left" className='header-text'>Have Any Questions or Business Inquiries? </h1>

        <div data-aos="fade-right" className='button-container'>
            
            <button onClick={handleContactClick}  className='btn'>Contact Us</button>
        </div>

        <div data-aos="fade-up" className='flex'>
            
            <div className='icon-container  flex' onClick={() => navigate("/lsr-info/policies")}>
                <img className='policies' src={policies} alt="policies-icon" />
            </div>
            <div className='icon-container flex' onClick={() => navigate("/lsr-info/about-us")}>
                <img className='faq' src={faq} alt="faq-icon" />
            </div>

        </div>
        
        
    </div>
  )
}

export default Questions