import React, {useEffect} from 'react';
import {FaRegQuestionCircle} from "react-icons/fa"
import {AiOutlineArrowRight} from "react-icons/ai"

//import images for card headers
import policies from "../Assets/policies.png";
import questionMark from "../Assets/questionMark.png"
import aboutUs from "../Assets/info.png";

//import useNavigate for redirection
import { useNavigate } from 'react-router-dom';
import "./Info.css";

//aos animation library
import Aos from "aos";
import "aos/dist/aos.css";

const Info = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({duration: 1000})
    }, [])

  return (
    <div className="info-container">

        <div className="info-title flex">
            <h1 data-aos="fade-left" className="header-text">LSR <span>Uncovered</span></h1>
            <h3 data-aos="fade-right" className="subheader-text">Explore Our Brand's Philosophy, Policies, and Discover the Answers to Your Questions</h3>
        </div>

        <div className="info-content flex">

            <div data-aos='zoom-in' className="info-card faq" onClick={() => navigate("/lsr-info/faq")}>

                <div data-aos="flip-right" className="title-container flex">
                    <h1 className="header-text">FAQ</h1>
                    <img className='question-mark' src={questionMark} alt="" />
                </div>
                <hr />
                
                <h1 data-aos='fade-right' className="subheader-text">Have Questions? Click the Button Below for Everything You Need to Know About Shopping with LSR Kicks.</h1>
                <div className="btn-container btn-faq flex">
                    <button className="btn-redirect ">View FAQ</button>
                    <AiOutlineArrowRight />
                </div>
            </div>

            <div data-aos='zoom-in' className="info-card policies" onClick={() => navigate("/lsr-info/policies")}>
                <div data-aos="flip-up" className="title-container flex">
                    <h1 className="header-text">Policies</h1>
                    <img className='policies-img' src={policies} alt="" />
                </div>
                <hr />

                <h1 data-aos='fade-up' className="subheader-text">Gain Insight Into Our Rules, Regulations, and Stay Up to Date With Our Guidlines For a Smooth and Secure Purchase. </h1>
                <div className="btn-container btn-policies flex">
                    <button className="btn-redirect ">View Policies</button>
                    <AiOutlineArrowRight />

                </div>                
            </div>

            <div data-aos='zoom-in' className="info-card about-us" onClick={() => navigate("/lsr-info/about-us")}>
                <div data-aos="flip-left" className="title-container flex">
                        <h1 className="header-text">About Us</h1>
                        <img className='about-us' src={aboutUs} alt="" />
                </div> 

                <hr />  
                <h1 data-aos='fade-left' className="subheader-text">Learn All About LSR's History, Passionate Commitment to the Customer, and much more. </h1>            
                
                <div className="btn-container btn-about-us flex">
                    <button className="btn-redirect ">View About Us</button>
                    <AiOutlineArrowRight />

                </div>
            </div>
        </div>
    </div>
  )
}

export default Info