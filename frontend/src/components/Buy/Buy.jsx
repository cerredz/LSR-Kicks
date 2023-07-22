//import helper functions / hooks
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { urlFor, client } from '../../client';
import { useNavigate } from 'react-router-dom';
//import images
import LSR__Logo from "../Assets/lsrkicks-logo.png";
import womenBanner from "../Assets/womenBanner.jpeg";
import newArrivalBanner from "../Assets/newarrivals.jpg";
import Error from "../Assets/x.png";
//import react icons
import {MdOutlineShoppingBag} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsArrowRight } from "react-icons/bs";

//import css
import "./Buy.css";

import HompageReturn from '../HomepageReturn/HompageReturn';

const Buy = (props) => {
    
    //use parameters from url to shoe which shoe to display
    const {category, shoeName, shoeImageUrl} = useParams();

    const [loadingData, setLoadingData] = useState(true);
    const [shoeData, setShoeData] = useState({});

    //will need shoe name, shoe category, price, image, quantity, and size for when we need to add element to the bag
    const [shoeQuantity, setShoeQuantity] = useState(1);
    const [shoePrice, setShoePrice] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [shoeNameWithSpaces, setShoeNameWithSpaces] = useState("");
    

    //we be used for when the user does something wrong
    const [errorMessage, setErrorMessage] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);

    const navigate = useNavigate();

    //we must fetch the shoe's data upon loading up the page
    useEffect(() => {

        //update shoeName to make it the actual shoe Name with spaces
        const spaces = shoeName.replace(/-/g, " ");
        setShoeNameWithSpaces(spaces);

        //get the data of the shoe that we are looking for
        let query = "";

        if(category === "mens") {
            query = '*[_type == "Mens__Shoes"]';
        } else if (category === "womens") {
            query = '*[_type == "Womens__Shoes"]';
        } else if (category === "new-arrivals") {
            query = '*[_type == "New__Arrivals"]';
        }

        //make the call to the backend to retrieve all the shoes data
        client.fetch(query).then((data) => {
            
            //filter it so we get correct shoe
            const filteredData = data.filter((shoe) => shoe.Shoe__Name === spaces);

            if(filteredData.length > 0) {
                setShoeData(filteredData);
                setLoadingData(false);

            } else {
                console.log("Shoe Not Found");
            }
        })

    },[])


    //update price of the shoe depending on the size
    const handleSizeClick = (shoe) => {
        setShoePrice(shoe.price);
        setSelectedSize(shoe.size);
    }

    //need function to update visual display for our bag

    //when add to bag is clicked we will push a bag item
    //onto the localStorage.bag:
        //const bag Item : 
            // shoeName
            // shoePrice
            // shoeImage
            // shoe shoeQuantity
            // shoeSize
    
    const updateBag = () => {

        
        if(selectedSize === null) {//user did not select shoe size

            setErrorMessage(true);
            setTimeout(() => {
                setErrorMessage(false);
            }, 2000);
            return;
        }

        //get current bag
        const existingBag = localStorage.getItem("bag") ;

        

        let shoeCategory = category;
        if(shoeCategory !== "mens" && shoeCategory !== "womens") {
            shoeCategory = "mens"
        }
        
        //create another bag element
        const bagItem = {
            shoeName: shoeNameWithSpaces,
            shoePrice: shoePrice * shoeQuantity,
            shoeImage: shoeImageUrl,
            shoeQuantity: shoeQuantity,
            shoeSize: selectedSize,
            shoeCategory: shoeCategory,
            shoeDatabase: category
        };


        let updatedBag = [];


        if (existingBag) {
        // If the "bag" item exists in localStorage, parse its value into an array
            updatedBag = JSON.parse(existingBag);
        }

        const duplicateShoe = updatedBag.find(
            item => item.shoeName === shoeNameWithSpaces && item.shoeSize === selectedSize
        );

        //user already has shoe with same size in their bag, only allow purchase 1 at a time
        if(duplicateShoe) {
            setDuplicateError(true);
            setTimeout(() => {
                setDuplicateError(false);
            }, 2000);
            return;
        }

        const availableQuantity = shoeData[0].Shoe__Sizes.find(
            shoe => shoe.size === selectedSize
          ).quantity;


          if(availableQuantity < shoeQuantity) {
            setQuantityError(true);
            setTimeout(() => {
                setQuantityError(false);
            },2000)
            return;
        }

        // Push the new item onto the updatedBag array
        updatedBag.push(bagItem);

        // Store the updatedBag back into localStorage
        window.localStorage.setItem("bag", JSON.stringify(updatedBag));
        window.dispatchEvent( new Event('storage') ) 

    }
    

    //function for user to continue back to shopping
    const handleContinueShopping = () => {
        navigate(-1);
    }
  return (
    <>
        {!loadingData && (
            <div className='buy-container'>
                

            <div className="shoe-container">
                <div className="shoe-image-container flex">
                        <img className={`${shoeData[0].Shoe__Name.includes("Nike") ? "nike" : "jordan"}`} src={shoeImageUrl} alt="" />
                </div>

                    
                    <div className="shoe-info">
                        
                        <div className='name-and-price'>
                            <h1 className='header-text'>{shoeData[0].Shoe__Name}</h1>
                            <p className='paragraph-text'>View our Policies <a href="">here</a></p>
                            {shoePrice !== 0 && <h2 className='subheader-text'>$ {shoePrice}.00</h2>}
                            <button className='btn-add' onClick={() => updateBag()}> Add to Bag</button>
                        </div>

                        <div className='size'>
                            <h1 className='subheader-text'>
                                Select Sizes:
                                {duplicateError && (<span className='subheader-text error'>* You Already Have this Shoe In Your Bag *</span>)}
                                {errorMessage && (<span className='subheader-text error'> * Please Select A Shoe Size First * </span>)}
                                </h1>
                            
                            <div className='size-container'>
                                {shoeData[0].Shoe__Sizes.map((shoe, index) => (
                                    <div key={index} className={`size-div ${selectedSize === shoe.size ? 'active' : ''}`} onClick={() => handleSizeClick(shoe)}>
                                        <h1 className='subheader-text'>{shoe.size}</h1>
                                    </div>
                                ))}
                            </div>
                            
                            
                            <label htmlFor="">Quantity: {quantityError && (<span className='error'> * Please Lower the Quantity *</span>)} </label>
                            
                            <br />
                            
                            <select name="" id="" onChange={(event) => setShoeQuantity(Number(event.target.value))}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>

                            <div className='facts-container'>
                                <ul>
                                    <li className='flex'>
                                        <BsArrowRight />
                                        <p className='paragraph-text'>Fast Shipping</p>
                                    </li>
                                </ul>
                                <ul>
                                    <li className='flex'>
                                        <BsArrowRight />
                                        <p className='paragraph-text'>100% Authentic</p>
                                    </li>
                                </ul>
                                <ul>
                                    <li className='flex'>
                                        <BsArrowRight />
                                        <p className='paragraph-text'>Pay with <span> Paypal </span> </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        
                        
                    </div>

                    
                </div>
                
                
                <div className='buttons-container flex'>
                    <button className='btn-continue subheader-text' onClick={handleContinueShopping}>Continue Shopping</button>
                    <HompageReturn />
                </div>
                
            </div> 

            
        )}

    </> 
    
  )
}

export default Buy