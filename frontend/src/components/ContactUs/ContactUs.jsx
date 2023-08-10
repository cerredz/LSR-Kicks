import React, {useState, useEffect} from 'react';
import "./ContactUs.css";

import gmail from "../Assets/gmail.png";
import Axios from 'axios';
import { getAuth } from 'firebase/auth';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { checkEmailValidity } from '../../client';
import { checkUserStatus } from '../../client';
import HompageReturn from '../HomepageReturn/HompageReturn';
import check from "../Assets/checkmark.png";
import { CgSmartHomeRefrigerator } from 'react-icons/cg';
import error from "../Assets/x.png";
import { useParams } from 'react-router-dom';


const ContactUs = (props) => {


    //we must have useState variables for the user's information
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    
    //useState variable for the message once the user clicks the submit message
    const [showThankYou, setShowThankYou] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const {topicValue} = useParams();




/*--------------------------------------------------------------------------------------------------------------- */
    //handle input changes in all of the form fields
    const updateName = (event) => {
        setName(event.target.value);
    }
    const updateEmail = (event) => {
        
        setEmail(event.target.value);
    }
    const updatePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    }
    const updateTopic = (event) => {
        setTopic(event.target.value);
        console.log(topic)
    }
    const updateMessage = (event) => {
        setMessage(event.target.value);
    }

/*-------------------------------------------------------------------------------------------------------------- */
    //we must add an event listener for our textarea html element so we can expand it when there is more than 1 line of text
    useEffect(() => {
        const textarea = document.querySelector("textarea");

        textarea.addEventListener("keyup", (e) => {
            let textHeight = e.target.scrollHeight;
            textarea.style.height = "auto";
            textarea.style.height = `${textHeight}px`;
        })

        window.scrollTo(0,0);

        setTopic(topicValue);
    }, []);

/*-------------------------------------------------------------------------------------------------------------- */
//we need to create a helper function to validate whether or not the user imputted a correct email



/*-------------------------------------------------------------------------------------------------------------- */
//create a function to actually send the from when the submit button is pressed
const handleSubmitClick = async (e) => {

    
    e.preventDefault();
    const validEmail = false;

    checkEmailValidity(email).then(response => {
        if(!response.data) {

            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 4000);
            
        } else {

            setName("");
            setPhoneNumber("");
            setEmail("");
            setTopic("");
            setMessage("");
            //show thank you message for 4 seconds
            setShowThankYou(true);
            setTimeout(() => {
                setShowThankYou(false);
            }, 4000);

            validEmail = true;

            
        }
    }).catch((error) => {
        console.log(error);
    })


    if(validEmail) {
        
        Axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/send/email`, {
            name: name,
            email: email,
            phoneNumber: phonenumber,
            subject: topic,
            message: message
        }).catch((error) => {
            console.log(error);
        })
    }
    

}




  return (
    <div  className='contact-container flex'>

        <div className='contact-form'>

            <div className='icon-container flex'>
                <img src={gmail} alt="gmail-icon" />
            </div>

             
            <div className='contact-heading flex'>

                    <h1 className='header-text'>Contact Us</h1>
                    <br />
                    <p className='paragraph-text'>Have any questions or business inquiries for LSR Kicks? Feel free to leave a message and the LSR Kicks team will get back to you as soon as possible.</p>
                    <br />
                    <p className='paragraph-text'>If you would rather message us on instagram <a href='https://www.instagram.com/lsr.kicks/'>click here</a> </p>
            </div>

                <div className='contact-info flex'>

                    <form action="" className='form'>

                        <div className='left '>
                                <label > Your Name: </label>
                                <br />
                                <input value={name} onChange={updateName} placeholder='Enter Name' type="text" />
                                <br />

                                <label htmlFor="">Phone Number (Optional): </label>
                                <br />

                                <input value={phonenumber} onChange={updatePhoneNumber} placeholder='Enter Phone Number' type="text" />
                        </div>
                            
                            
                        

                        <div className='right '>
                                <label  >Your Email: </label>
                                <br />
                                    <input value={email} onChange={updateEmail} placeholder='Enter Email' type="text" />
                                <br />

                                <label > Topic: </label>
                                <br />
                                <select value={topic} onChange={updateTopic} name="topic" id="topic">
                                    <option value=""></option>
                                    <option value="Shipping">Shipping</option>
                                    <option value="Returns">Returns</option>
                                    <option value="Payments">Payments</option>
                                    <option value="Questions">Questions</option>
                                    <option value="Collaboration">Collaboration</option>
                                    <option value="Other">Other</option>
                                </select>



                        </div>

                            <label htmlFor="">Text Your Message Here: </label>
                            <textarea value={message} onChange={updateMessage} placeholder='Enter Your Message Here' rows="1" name="" id="" ></textarea> 
                        <div className='btn-container flex'>
                            <button onClick={handleSubmitClick} className='subheader-text' type='submit'>Submit</button>
                        </div>
                            
                    </form>

                </div>
            
        </div>

        {showThankYou && (
            <div className='thank-you-container'>
                <div className='heading flex'>   
                    <img src={check} alt="correct-check-mark" />
                    <h1 className='header-text'>Email Recieved</h1>
                </div>

                <div className='sub-heading flex'>
                    <p className='paragraph-text'>Thank you for reaching out to the LSR Kicks team.</p>
                </div>
           
            </div>
        )}

        {showErrorMessage && (
            <div className='thank-you-container'>
                <div className='heading flex'>   
                    <img src={error} alt="x-mark" />
                    <h1 className='header-text'>Incorrect Email Address</h1>
                </div>

                <div className='sub-heading flex'>
                    <p className='paragraph-text'>Please Input a correct email address before contacting LSR Kicks (must be signed in).</p>
                </div>
       
        </div>
        )}
        

        <HompageReturn  />
    </div>
  )
}

export default ContactUs