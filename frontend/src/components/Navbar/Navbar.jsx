import React, {useState, useEffect} from 'react';

import "../Navbar/Navbar.css";
//react icons
import {MdOutlineShoppingBag, MdShareLocation} from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { VscThreeBars } from "react-icons/vsc";
import { VscChromeClose } from "react-icons/vsc";

//helper functions / methods
import {auth, provider} from "./config";
import { signInWithPopup } from 'firebase/auth';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { client } from '../../client';

//images
import LSR__Logo from "../Assets/lsrkicks-logo.png";
import PaypalLogo from "../Assets/paypal.png";
import stripe_icon from "../Assets/stripe-icon.png"

//aos animation library
import Aos from "aos";
import 'aos/dist/aos.css';

const Navbar = (props) => {

//variables for frontend display
const [signedIn, setSignedIn] = useState(false);
const [toggle, setToggle] = useState(false);
const [categoriesClassName, setCategoriesClassName] = useState("categories-container");
const [userEmail, setUserEmail] = useState("");
const [showCategories, setShowCategories] = useState(Boolean(props.categories));
const [toggleClassName, setToggleClassName] = useState("toggle-container");

//variables for the user's bag
const [showBag, setShowBag] = useState(false);
const [bagItems, setBagItems] = useState(JSON.parse(localStorage.getItem("bag")) || [])
const [bagSize, setBagSize] = useState(localStorage.getItem("bag")?.length || 0);
const [totalPrice, setTotalPrice] = useState(0);


//variables to retrieve shoe database
const [mensDatabase, setMensDatabase] = useState([]);
const [womensDatabase, setWomensDatabase] = useState([]);
const [newArrivalsDatabase, setNewArrivalsDatabase] = useState([]);

//varibales for error messages
const [quantityError, setQuantityError] = useState(false);

const navigate = useNavigate();


useEffect(() => {
    

    //retrieve all of the databases in order to update them with the shoes the user bought
    const menQuery = '*[_type == "Mens__Shoes"]';
    const womenQuery = '*[_type == "Womens__Shoes"]';
    const newArrivalQuery = '*[_type == "New__Arrivals"]';

    client.fetch(menQuery).then((data) => {
      setMensDatabase(data);
    })

    client.fetch(womenQuery).then((data) => {
      setWomensDatabase(data);
    })

    client.fetch(newArrivalQuery).then((data) => {
      setNewArrivalsDatabase(data);
    })

    Aos.init({duration: 1000});

    
}, []);

useEffect(() => {
    //must add event listener to resize otherwise the 
    //tertiary statement will produce an incorrect navbar
    if(showCategories) {
        window.addEventListener('resize', () => {
            if(toggle === true && window.innerWidth > 900) {
                setCategoriesClassName("categories-container");
                
            } else if (toggle === true && window.innerWidth < 900) {
                setCategoriesClassName("categories-container down");
            }
        })
    }
    

    //now we must check the local storage to see if the user is signed in or not
    const email = localStorage.getItem("email");

    if(email != null) {
        setSignedIn(true);
        setUserEmail(email);
    }

    //show the bag whenever a user adds an item to the bag
    window.addEventListener('storage', () => {
        setBagItems(JSON.parse(localStorage.getItem("bag")));
        setBagSize(localStorage.getItem("bag").length);
        setShowBag(true);
        
    })
    console.log(bagItems);
    console.log("Bag Size: " + bagSize);
  

    
}, []);

//update the total price whenever the user changes their bag
useEffect(() => {
    let price = 0;

    bagItems.forEach((shoe) => {
        price += shoe.shoePrice;
    });

    setTotalPrice(price);

}, [bagItems])



// function for the toggle navbar button
const handleToggleClick = () => {

    setToggle((prevToggle) => !prevToggle);

    if(toggle === false && showCategories === true) {
        setCategoriesClassName("categories-container down")
    }else if(toggle === true && showCategories === true){
        setCategoriesClassName("categories-container")
    } 
}

//function for when the sign in button is clicked

const handleSignInClick = () => {

    //authenticate the user, and then add them to the database
    signInWithPopup(auth,provider).then((data) => {
        localStorage.setItem("email", data.user.email);
        setSignedIn(true);
        setUserEmail(data.user.email);
        Axios.post('http://localhost:3001/adduser', {
            email: data.user.email
        }).then(() => {
            console.log("Successfully added user to the database");
            
        }).catch((error) => {
            console.log(error);
        })

    })

}

//function for redirecting to mens, womens, or newarrivals
const handleLinkClick = (props) => {
    localStorage.getItem("email") === null ? navigate(`/signup/${props}`) : navigate(`/shoes/${props}`);
}

//we must close the navbar if the screen is below 900 px
const handleNavClick = () => {
    if(categoriesClassName === "categories-container down" && toggle === true) {
        setToggle(false);
        setCategoriesClassName("categories-container");
    }
}

//function to decrease the quantity of a shoe in the user's bag, and update the local storage
const decreaseQuantity = (index) => {
    const updatedItems = [...bagItems];

    //update user's bag
    if(updatedItems[index].shoeQuantity > 1) {
        updatedItems[index].shoePrice -= (updatedItems[index].shoePrice / updatedItems[index].shoeQuantity);
        updatedItems[index].shoeQuantity -= 1;
        setBagItems(updatedItems);

        //update the local storage
        const updatedBag = JSON.parse(localStorage.getItem("bag"));
        updatedBag[index].shoeQuantity -= 1;
        updatedBag[index].shoePrice -= (updatedItems[index].shoePrice / updatedItems[index].shoeQuantity);
        localStorage.setItem("bag", JSON.stringify(updatedBag));
    }

    

}

//function to increase the quantity of a shoe in the user's bag, and update the local storage
const increaseQuantity = (index) => {


    let shoe = {};
    let shoeSize = {};

    //update user's bag
    const updatedItems = [...bagItems];

    //must get the shoe from the correct database
    if(updatedItems[index].shoeDatabase === 'mens') {

        shoe = mensDatabase.find((shoe) => {
            return shoe.Shoe__Name === updatedItems[index].shoeName
        });

        
    } else if (updatedItems[index].shoeDatabase === 'womens') {

        shoe = womensDatabase.find((shoe) => {
            return shoe.Shoe__Name === updatedItems[index].shoeName
        });
    } else if (updatedItems[index].shoeDatabase === 'new-arrivals') {

        shoe = newArrivalsDatabase.find((shoe) => {
            return shoe.Shoe__Name === updatedItems[index].shoeName
        });
    }


    //get the shoe size of the shoe we are increasing the quantity for 
    shoeSize = shoe.Shoe__Sizes.find((sizeOBJ) => {
        return sizeOBJ.size === updatedItems[index].shoeSize
    });

    console.log(shoe);
    console.log(shoeSize);

    //check if we have enough shoes avaivable for the user to buy
    if(updatedItems[index].shoeQuantity < shoeSize.quantity && updatedItems) {
        updatedItems[index].shoePrice += (updatedItems[index].shoePrice / updatedItems[index].shoeQuantity);
        updatedItems[index].shoeQuantity += 1;
        setBagItems(updatedItems);

        //update local storage
        const updatedBag = JSON.parse(localStorage.getItem("bag"));
        updatedBag[index].shoeQuantity += 1;
        updatedBag[index].shoePrice += (updatedItems[index].shoePrice / updatedItems[index].shoeQuantity);
        localStorage.setItem("bag", JSON.stringify(updatedBag));
    } else {

        setQuantityError(true);
        setTimeout(() => {
            setQuantityError(false);
        }, 3000)
    }
    

    


}

//function to remove an item from the bag
const removeItem = (index) => {
    const updatedItems = [...bagItems];
    updatedItems.splice(index, 1);
    setBagItems(updatedItems);
    
    localStorage.setItem("bag", JSON.stringify(updatedItems))
    setBagSize(JSON.parse(localStorage.getItem("bag"))?.length || 0);
}




  //function that capitalizes the first letter 
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  

  return (
    <>
        <nav>
            <span className="top-left-glow"></span>
            <div className='logo-container'>
                <img  data-aos="fade-right" className='logo' src={LSR__Logo} alt="" onClick={() => navigate("/")}/> 
            </div>
            {showCategories && (
                <div className={categoriesClassName}>
                <ul data-aos="fade-down">
                    <li onClick={() => handleLinkClick("mens")} className='header-text'> Mens Shoes</li> 
                    <li onClick={() => handleLinkClick("womens")} className='header-text'> Womens Shoes</li> 
                    <li onClick={() => handleLinkClick("newarrivals")} className='header-text'> New Arrivals </li>
                    {categoriesClassName === "categories-container down" && window.innerWidth < 900 ? (
                        <>
                            <li id='contact' className='header-text'><Link to='/contact' className='link-text' onClick={handleNavClick}> Contact Us </Link></li>
                            <li id='about' className='header-text ' onClick={handleNavClick}><Link to="/lsr-info/about-us">About Us</Link></li>
                            
                        </>

                    ): null}
                </ul>
                    
                {categoriesClassName === "categories-container down" && window.innerWidth < 900 && !signedIn ? (
                        <div className='sign-in-container flex'>
                            <button onClick={handleSignInClick} className='sign-in header-text'> Sign In </button>
                        </div>

                    ): null}
                </div>
            )}
            

            <div className="icon-container">

                <ul data-aos= 'fade-left' className='flex'>
                    {!signedIn && (
                        <>
                            <li> <button onClick={handleSignInClick} className='sign-in header-text sign-in-nav'>Sign In</button> </li>
                        </>
                    )}

                    {signedIn && (
                        <>
                            <li> 
                                <MdOutlineShoppingBag className={`svg-icons ${totalPrice !== 0 ? 'hasItems' : ''}`} onClick={() => setShowBag(prev => !prev)}/>
                                
                             </li>
                            <li> <CgProfile className='svg-icons'/> </li>
                        </>
                    )}
                </ul>
            </div>

            <div className={toggleClassName} >

                {toggleClassName === "toggle-container" && (
                    <div className="icons">
                        <ul data-aos='fade-left' className='flex'>
                            <li>
                                <MdOutlineShoppingBag className={`svg-icons ${totalPrice !== 0 ? 'hasItems' : ''}`} onClick={() => setShowBag(prev => !prev)}/>
                                
                            </li>

                            <li>
                                <CgProfile className='svg-icons' />
                            </li>
                        </ul>
                        
                        
                    </div>
                    
                )}
                {showCategories && (
                    <>
                    
                        {!toggle && (
                            <VscThreeBars data-aos='fade-left' onClick={handleToggleClick} />
                        )}
        
                        {toggle && (
                            <VscChromeClose data-aos='fade-left' onClick={handleToggleClick} />
                        )}

                    </>
                )}
                



            </div>

            
            

        </nav>

        {showBag && (
                <div data-aos="fade-left" className='bag-container'>
                        
                        <>
                            <div className='bag-header flex'>
                                <h1 data-aos="zoom-in" className='header-text'>Cart</h1>
                                <VscChromeClose onClick={() => setShowBag((prev) => !prev)} />
                                
                            </div>

                            <div data-aos="fade-up" className='bag-content'>
                                {quantityError && (
                                    <div className="quantity-error-container">
                                        <p className='paragraph-text'>Sorry, The Requested Number of Shoes Exceed the Available Shoes We Have In Stock</p>
                                    </div>
                                )} 
                                {bagItems.map((shoe, index) => (
                                    <div key={index} className='shoe-item'>
                                        <div className='shoe-image flex'>
                                            <img 
                                            className={`${shoe.shoeName.includes("Nike") ? "nike" : "" } ${shoe.shoeName.includes("Jordan") ? "jordan" : ""}  `}
                                            src={shoe.shoeImage} alt={shoe.shoeName} />
                                        </div>
                                        <div className='shoe-info'>
                                            <h2 className='header-text'>{shoe.shoeName}</h2>
                                            <p className='paragraph-text first'>${shoe.shoePrice}.00</p>
                                            <p className='paragraph-text'>Size: {shoe.shoeSize}</p>
                                            <div className='quantity-container'>
                                                <AiOutlineMinus onClick={() => decreaseQuantity(index)}/>
                                                <p className='paragraph-text'>{shoe.shoeQuantity}</p>
                                                <AiOutlinePlus onClick={() => increaseQuantity(index)} />
                                                <div className=' flex right'>
                                                    <p className='paragraph-text remove' onClick={() => removeItem(index)}> Remove</p>
                                                    <p className='paragraph-text shoe-category'>{capitalizeFirstLetter(shoe.shoeCategory)}</p>
                                                </div>
                                                
                                            </div>
                                           
                                            
                                        </div>

                                    </div>
                                ))}
                            </div>

                            <div data-aos="zoom-in" className='bag-checkout flex'>
                               {totalPrice !== 0 && (
                                    <>
                                        <div className='total flex'>
                                            <h1 className='header-text'>Total: ${totalPrice}.00</h1>

                                        </div>
                                        <div  id="paypal" className='btn-paypal flex' onClick={() => navigate(`/shipping/paypal/${encodeURIComponent(JSON.stringify(bagItems))}/${totalPrice}`)}>
                                            <img src={PaypalLogo} alt="" />
                                            <h1 className='header-text'>
                                                <span className='pay'>Pay</span> 
                                                <span className='pal'>Pal</span>
                                            </h1>
                                        </div>

                                        <div id="stripe" className='btn-stripe flex' onClick={() => navigate(`/shipping/stripe/${encodeURIComponent(JSON.stringify(bagItems))}/${totalPrice}`)}>
                                            <img src={stripe_icon} alt="" />
                                            <h1 className='subheader-text'> Stripe</h1>
                                        </div>
                                    </>
                               )}
                                    
                            </div>
                        </>
                        
                        
                    
                </div>
                
        )}
    </>
  )
}

export default Navbar
