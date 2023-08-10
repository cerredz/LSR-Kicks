
//react functions
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import googleIcon from "../Assets/google.png";
import Axios from 'axios';

//firebase functions
import {auth, provider} from "../Navbar/config";
import { signInWithPopup } from 'firebase/auth';

//aos animation library
import Aos from "aos";
import "aos/dist/aos.css";


import "./SignUp.css"
const SignUp = (props) => {

    const { from } = useParams();
    const [message, setMessage] = useState("");

    
    const navigate = useNavigate();

    useEffect(() => {
        if(from === "contact") {
            setMessage("Asking Any Questions");
        } else {
            setMessage("Shopping For Shoes");
        }

        Aos.init({duration: 1000})

    }, [])

    

    //create a function that signs a user in once they click the "sign in with google" 
    const handleSignInClick = () => {
        signInWithPopup(auth,provider).then((data) => {
            localStorage.setItem("email", data.user.email);
            Axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/adduser`, {
                email: data.user.email
            }).then(() => {
                console.log("Successfully added user to the database");
                navigate("/");//redirect back to homepage
            }).catch((error) => {
                console.log(error);
            })
    
        })
    }

    
  return (

    
    
    <div className='page-container flex'>
        <span className="top-left-glow"></span>
        <span className="top-right-glow"></span>
        <div data-aos="zoom-in" className='signup-container'> 
            <div className='header-container'>
                <h1 className='header-text header'>Create Account</h1>
                <h3 className='subheader-text subheader'>Please Sign Up Before {message}</h3>
                <p className='paragraph-text paragraph'>LSR Kicks wants to give our customers the best possible user experience, and signing up to join the LSR Community is a necessary part of that. Click the button below and sign up using your preferred gmail account to join the LSR Kicks Community. </p>

            </div>

            <div onClick={handleSignInClick} className='google-container flex'>
                <div className='google-content flex'>
                    <img src={googleIcon} alt="google icon" />
                    <h3 className='btn-text'>Sign Up With Google</h3>
                </div>
                

            </div>
        </div>
        
    </div>
  )
}

export default SignUp