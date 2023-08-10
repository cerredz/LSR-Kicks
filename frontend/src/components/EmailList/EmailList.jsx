import React, {useState, useEffect} from 'react'
import {BsArrowRight} from "react-icons/bs"
import {AiOutlineCheck} from "react-icons/ai"
import Axios from "axios";
import "./EmailList.css"

const EmailList = (props) => {
    const [showSignUpButton, setShowSignUpButton] = useState(false);
    const [error, setError] = useState({
      incorrectEmail: false,
      alreadyJoined: false,
    });
    
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
      console.log(userEmail)
    },[userEmail])

    useEffect(() => {
      console.log(localStorage.getItem("emaillist"))
    }, [])

    

    //function to keep track of the user's email
    const handleKeyDown = (key) => {

      if(key === 'Enter') {
        joinEmailList();
      }
    }

    //function to actually sign the user up for the email list
    const joinEmailList = () => {

      //first check if the email inputted is a valid email
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
      const isValidEmail = emailRegex.test(userEmail);
      

      //if not valid email address
      if(!isValidEmail) {
        
        setError({
          incorrectEmail: true,
          alreadyJoined: false
        });
        setTimeout(() => {
          setError({
            incorrectEmail: false,
            alreadyJoined: false
          })
        }, 3000)
        //if user already joined email list
      } else if (localStorage.getItem("emaillist") === userEmail) {

        setError({
          incorrectEmail: false,
          alreadyJoined: true
        });
        setTimeout(() => {
          setError({
            incorrectEmail: false,
            alreadyJoined: false
          })
        }, 3000)
        //if new valid user, make the call to the backend
      }else {

        Axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/emails`, {
          email: userEmail
        }).then((response) => {
          console.log('Email added to email list successfully');
          localStorage.setItem("emaillist", userEmail);
          setUserEmail("");
        }).catch((error) => {
          console.log("Error Storing Email: ", error)
        })
      }

    }
  return (
    <div 
    className={`email-container `}
    >

        <div data-aos="zoom-in" className="email-content">
          <div className='text'>
            <h1 className="header-text">Join Our <span>Email List!</span> </h1>
            <p className='paragraph-text'>Stay up to date with the lastest LSR Kicks news, announcements, and shoe realeases</p>
            {error.incorrectEmail && (<h1 className='paragraph-text error'>Please Enter A Valid Email Address </h1>)}
            {error.alreadyJoined && (<h1 className='paragraph-text error'>This Email is Already Apart of the Email List </h1>)}

            {showSignUpButton && (
            <div 
            data-aos="fade-left" 
            className=' form flex'
            >
              <input 
              placeholder='Enter Email'
              onChange={(event) => setUserEmail(event.target.value)}
              onKeyDown={((event) => handleKeyDown(event.key))}
              value={userEmail}

              >
                
              </input>
              <button onClick={() => joinEmailList()}>Enter</button>
             
            </div>
            )}
          </div>



            {!showSignUpButton && (
              <button 
              className="btn-signup flex"
              onClick={() => setShowSignUpButton((prev) => !prev)}
              
              >Sign Up <BsArrowRight /></button>
            )}
          
            


        </div>
        
    </div>
  )
}

export default EmailList