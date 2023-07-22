import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Footer.css";

//import react icons
import {AiOutlineYoutube, AiOutlineInstagram, AiFillTwitterCircle} from "react-icons/ai";
import {FaSnapchat} from "react-icons/fa"

//import payment option images
import visa from "../Assets/visa.png";
import mastercard from "../Assets/mastercard.png";
import americanexpress from "../Assets/americanexpress.png";
import discover from "../Assets/discover.png";
import applepay from "../Assets/applepay.png";
import googlepay from "../Assets/googlepay.png";
import stripe from "../Assets/stripecreditcard.png";
import paypal from "../Assets/paypallogo.png";

const Footer = (props) => {

    const navigate = useNavigate();

  return (
    <div className='footer-container'>

        <div className="footer-content">
            <div data-aos ="fade-right" className="footer-card flex">
                <h1 className="subheader-text">Products</h1>

                <ul>
                    <li onClick={() => navigate("/shoes/mens")}>
                        <p  className="paragraph-text">Mens Shoes</p>
                    </li>
                    <li onClick={() => navigate("/shoes/womens")}>
                        <p className="paragraph-text">Womens Shoes</p>
                    </li>
                    <li onClick={() => navigate("/shoes/newarrivals")}>
                        <p className="paragraph-text">New Arrivals</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/bestsellers")}>
                        <p className="paragraph-text">Best Sellers</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/ourfavorites")}>
                        <p className="paragraph-text">Our Favorites</p>
                    </li>
                    <li onClick={() => navigate("/shoes/nike")}>
                        <p className="paragraph-text">Nikes</p>
                    </li>
                    <li onClick={() => navigate("/shoes/jordan")}>
                        <p className="paragraph-text">Jordans</p>
                    </li>
                    <li onClick={() => navigate("/shoes/yeezy")}>
                        <p className="paragraph-text">Yeezys</p>
                    </li>


                </ul>
            </div>

            <div data-aos ="fade-right" className="footer-card flex">
                <h1 className="subheader-text">LSR Kicks</h1>

                <ul>
                    <li onClick={() => navigate("/lsr-info/faq")}>
                        <p className="paragraph-text">Frequently Asked Questions</p>
                    </li>
                    <li onClick={() => navigate("/lsr-info/policies")}>
                        <p className="paragraph-text">Policies</p>
                    </li>
                    <li onClick={() => navigate("/lsr-info/about-us")}>
                        <p className="paragraph-text">About Us</p>
                    </li>
                </ul>
            </div>

            

            <div data-aos ="fade-left" className="footer-card flex">
                <h1 className="subheader-text">Support</h1>

                <ul>
                    <li onClick={() => navigate("/contact/Questions")}>
                        <p className="paragraph-text">Help</p>
                    </li>
                    <li onClick={() => navigate("/contact/Questions")}>
                        <p className="paragraph-text">Customer Support</p>
                    </li>
                    <li onClick={() => navigate("/contact/Shipping")}>
                        <p className="paragraph-text">Shipping</p>
                    </li>
                    <li onClick={() => navigate("/contact/Returns")}>
                        <p className="paragraph-text">Returns and Exchanges</p>
                    </li>
                    <li onClick={() => navigate("/contact/Payments")}>
                        <p className="paragraph-text">Payment</p>
                    </li>
                    <li onClick={() => navigate("/contact/Collaboration")}>
                        <p className="paragraph-text">Collaboration</p>
                    </li>
                    <li onClick={() => navigate("/contact/Other")}>
                        <p className="paragraph-text">Other</p>
                    </li>
                </ul>
            </div>

            <div data-aos ="fade-left" className="footer-card flex">
                <h1 className="subheader-text">Featured</h1>

                <ul>
                    <li onClick={() => navigate("/shoes/mens/NikeDunk")}>
                        <p className="paragraph-text">Nike Dunk</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/Jordan1")}>
                        <p className="paragraph-text">Jordan 1</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/Jordan4")}>
                        <p className="paragraph-text">Jordan 4</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/Jordan11")}>
                        <p className="paragraph-text">Jordan 11</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/Yeezy350")}>
                        <p className="paragraph-text">Yeezy 350</p>
                    </li>
                    <li onClick={() => navigate("/shoes/mens/YeezySlides")}>
                        <p className="paragraph-text">Yeezy Slides</p>
                    </li>
                </ul>
            </div>
        </div>

        <div data-aos="fade-up" className="footer-legal">
            <div className="social-media">
                <a href="https://www.youtube.com/results?search_query=lsr+kicks&sp=EgIQAg%253D%253D"> <AiOutlineYoutube className='youtube'/> </a> 
                <a href="https://www.instagram.com/lsr.kicks/"> <AiOutlineInstagram className='instagram'/> </a>
                <a href="https://twitter.com/LSRkicks"> <AiFillTwitterCircle className='twitter'/> </a>
                <a href=""> <FaSnapchat className='snapchat'/> </a>
                
            
            </div>

            <p className="paragraph-text">@2023 LSR Kicks, All Rights Reserved</p>

            <div className="payment-methods flex">
                <img src={visa} alt="visa" />
                <img src={mastercard} alt="mastercard" />
                <img src={americanexpress} alt="americanexpress" />
                <img src={discover} alt="discover" />
                <img className='apple' src={applepay} alt="applepay" />
                <img className='google' src={googlepay} alt="googlepay" />
                <img src={stripe} alt="stripe" />
                <img className='paypal' src={paypal} alt="paypal" />
                

            </div>
        </div>
    </div>
  )
}

export default Footer