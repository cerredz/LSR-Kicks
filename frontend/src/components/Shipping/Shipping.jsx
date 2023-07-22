import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import truck from "../Assets/truck.png"
import Axios from "axios";
import "./Shipping.css";

const Shipping = (props) => {

    //used to track user's information for the order
    const [userInfo, setUserInfo] = useState({
        name: '',
        state: '',
        address: '',
        email: '',
        number: ''
    });

    //used in case user does something wrong
    const [userErrors, setUserErrors] = useState({
        name: false,
        state: false,
        address: false,
        email: false,
        number: false,
    })

    const {from, bagItems, amount} = useParams();


    //update the user's information
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [name]: value
        }));
      };


    //check if the user has done everything right, is they have send them to the payment, if they havent, display they they have not
    const handleSubmitClick = async () => {

        const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
        let error = false;

        if(userInfo.name === ''){
            setUserErrors((prevUserInfo) => ({
                ...prevUserInfo,
                name: true
            }));
            error = true; 
        } else if(!userInfo.email.match(emailRegex)){
            setUserErrors((prevUserInfo) => ({
                ...prevUserInfo,
                email: true
            }));
            error = true;
        } else if(userInfo.state === ''){
            setUserErrors((prevUserInfo) => ({
                ...prevUserInfo,
                state: true
            }));
            error = true;

        } else if(userInfo.address === ''){
            setUserErrors((prevUserInfo) => ({
                ...prevUserInfo,
                address: true
            }));
            error = true;

        } else if(userInfo.number.length !== 10){
            setUserErrors((prevUserInfo) => ({
                ...prevUserInfo,
                number: true
            }));
            error = true;

        }

        if(error) {
            setTimeout(() => {
                setUserErrors({
                    name: false,
                    state: false,
                    address: false,
                    email: false,
                    number: false,
                })
            }, 3000)
        } else {

            if(from === "paypal") {
                try {
                    const userInfoJSON = JSON.stringify(userInfo);
                    
                    const response = await Axios.post(`http://localhost:3001/paypal/${userInfoJSON.email}/${amount}`, 
                      {
                        items: JSON.parse(bagItems),
                        user: JSON.parse(userInfoJSON)
                    }
                    );
                      
                    const { approval_url } = response.data;
                
                    // Redirect the user to the PayPal payment screen
                    window.location.href = approval_url;
                  } catch (error) {
                    console.log(error);
                  }
            } else if (from === "stripe") {

                try {
                    const userInfoJSON = JSON.stringify(userInfo);
                    const response = await Axios.post(`http://localhost:3001/create-stripe-checkout/${userInfoJSON.email}/${amount}`, {
                      items: JSON.parse(bagItems),
                      user: JSON.parse(userInfoJSON),
                    });
                  
                    const data = response.data; // get the response data
                  
                    const { url, error } = data; // destructure the data object to get url and error properties
                  
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(url);
                      window.location = url;
                    }
                  } catch (error) {
                    console.log(error);
                  }
            }
        }
        
    }


    useEffect(() => {

        console.log("Name: ", userInfo.name);
        console.log("State: ", userInfo.state);
        console.log("City: ", userInfo.city);
        console.log("Address: ", userInfo.address);
        console.log("Email: ", userInfo.email);
        console.log("Number: ", userInfo.number);

    }, [userInfo])

    useEffect(() => {
        console.log(JSON.parse(bagItems));
        console.log(from)
    },[])

    
  return (
    
    <div className='shipping-container'>

        <div className="shipping-info flex">

            <h1 className="header-text">
                Shipping Information
            </h1>
            <div className="shipping-image flex">
                <img src={truck} alt="" />
            </div>

            <div className="shipping-content flex">

                <label htmlFor=""  >Name: {userErrors.name && (<span>* Name Required *</span>)}</label>
                
                <input 
                type="text" 
                name='name'
                placeholder='Enter Name'
                value={userInfo.name}
                onChange={handleInputChange}
                className={`${userErrors.name === true ? 'error' : ''}`}/>
                
                <br />

                <label htmlFor="">Email: {userErrors.email && (<span>* Enter Valid Email *</span>)}</label>
                <input 
                type="text" 
                name='email'
                placeholder='Enter Email Address'
                value={userInfo.email}
                onChange={handleInputChange}
                className={`${userErrors.email === true ? 'error' : ''}`}/>
                
                <br />

                <label htmlFor="">State: {userErrors.state && (<span>* State Required *</span>)}</label>
                <select
                 name="state" 
                 id=""
                 value={userInfo.state}
                 onChange={handleInputChange}
                 className={`${userErrors.state === true ? 'error' : ''}`}>
                    <option value="" ></option>
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Arizona</option>
                    <option value="Arizona">Arizona</option>
                    <option value="Arkansas">Arkansas</option>
                    <option value="California">California</option>
                    <option value="Colorado">Colorado</option>
                    <option value="Connecticut">Connecticut</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Florida">Florida</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Hawaii">Hawaii</option>
                    <option value="Idaho">Idaho</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Indiana">Indiana</option>
                    <option value="Iowa">Iowa</option>
                    <option value="Kansas">Kansas</option>
                    <option value="Kentucky">Kentucky</option>
                    <option value="Louisiana">Louisiana</option>
                    <option value="Maine">Maine</option>
                    <option value="Massachusetts">Massachusetts</option>
                    <option value="Michigan">Michigan</option>
                    <option value="Minnesota">Minnesota</option>
                    <option value="Mississippi">Mississippi</option>
                    <option value="Missouri">Missouri</option>
                    <option value="Nebraska">Nebraska</option>
                    <option value="Nevada">Nevada</option>
                    <option value="New Hampshire">New Hampshire</option>
                    <option value="New Jersey">New Jersey</option>
                    <option value="New Mexico">New Mexico</option>
                    <option value="New York">New York</option>
                    <option value="North Carolina">North Carolina</option>
                    <option value="North Dakota">North Dakota</option>
                    <option value="Ohio">Ohio</option>
                    <option value="Oklahoma">Oklahoma</option>
                    <option value="Oregon">Oregon</option>
                    <option value="Pennsylvania">Pennsylvania</option>
                    <option value="Rhode Island">Rhode Island</option>
                    <option value="South Carolina">South Carolina</option>
                    <option value="South Dakota">South Dakota</option>
                    <option value="Tennessee">Tennessee</option>
                    <option value="Texas">Texas</option>
                    <option value="Utah">Utah</option>
                    <option value="Vermont">Vermont</option>
                    <option value="Virginia">Virginia</option>
                    <option value="Washington">Washington</option>
                    <option value="West Virginia">West Virginia</option>
                    <option value="Wisconsin">Wisconsin</option>
                    <option value="Wyoming">Wyoming</option>
                </select>
                <br />

                <label htmlFor="">Street Address: {userErrors.address && (<span> * Address Required *</span>)} </label>
                <input 
                type="text" 
                name='address'
                placeholder='Enter Your Address'
                value={userInfo.address}
                onChange={handleInputChange}
                className={`${userErrors.address === true ? 'error' : ''}`}/>
                <br />

                <label htmlFor="">Phone Number: {userErrors.number && (<span>* Phone Number Required*</span>)}</label>
                <input 
                type="text" 
                name='number'
                placeholder='Enter Phone Number'
                value={userInfo.phone}
                onChange={handleInputChange}
                className={`${userErrors.number === true ? 'error' : ''}`}

                />
            
            
                <button className='btn-submit' onClick={() => handleSubmitClick()}>Submit</button>
            
            </div>
        </div>
    </div>
  )
}

export default Shipping



