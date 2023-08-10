import React, {useEffect, useState} from 'react'
import { mensDatabase, urlFor } from '../../client';
import { useNavigate } from 'react-router-dom';

//react icons
import {BsArrowRight} from "react-icons/bs"
import {IoIosArrowForward, IoIosArrowBack } from "react-icons/io"
import "./Products.css";



const Products = (props) => {

    const [mensShoes, setMensShoes] = useState([]);
    const [selectedShoe1, setSelectedShoe1] = useState("Jordan 1 ");
    const [selectedShoe2, setSelectedShoe2] = useState("Nike Dunk")

    const navigate = useNavigate();
    
    //keep our shoe data in a useState variable
    useEffect(() => {
        mensDatabase().then((data) => {
            setMensShoes(data)
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    
    //function to scroll one shoe to the left
    const scrollLeft = (className) => {

        const shoes = document.querySelector(className);
        shoes.scrollBy(-245,0);
    }

    //function to scroll one shoe to the right
    const scrollRight = (className) => {
        
        const shoes = document.querySelector(className);
        shoes.scrollBy(245,0);

        
    }


    //redirect user to shoe buying page if they click a shoe
    const handleShoeClick = (name, img) => {

        const shoeWithoutSpaces = name.replace(/ /g, "-");
        const encodedShoeName = encodeURIComponent(shoeWithoutSpaces);
    
        navigate(`/shoes/mens/buy/${encodedShoeName}/${encodeURIComponent(img)}`);
    }

  return (

    <div className='products-container'>
        
        <div  className="product-names flex">
            
            <div className="product-name flex" onClick={() => setSelectedShoe1("Jordan 1 ")}>
                {selectedShoe1 === "Jordan 1 " && (<BsArrowRight />)}
                <h1 
                className={`
                header-text 
                ${selectedShoe1 === "Jordan 1 " ? "active" : ""}`
                }
                >
                    Jordan 1s
                </h1>
            </div>
            <div className="product-name flex " onClick={() => setSelectedShoe1("Jordan 4")}>
                {selectedShoe1 === "Jordan 4" && (<BsArrowRight data-aos="fade-right"/>)}
                <h1 
                className={`
                header-text
                ${selectedShoe1 === "Jordan 4" ? "active" : ""}
                `}
                >
                    Jordan 4s
                </h1>
            </div>
            <div className="product-name flex" onClick={() => setSelectedShoe1("Jordan 11")}>
                {selectedShoe1 === "Jordan 11" && (<BsArrowRight data-aos="fade-right"/>)}
                <h1 
                className={`
                header-text
                ${selectedShoe1 === "Jordan 11" ? "active" : ""}
                `}
                >
                    Jordan 11s
                </h1>
            </div>

            <div className="arrows">
                <IoIosArrowBack onClick={() => scrollLeft(".jordan-products")}/>
                <IoIosArrowForward onClick={() => scrollRight(".jordan-products")}/>
            </div>

        </div>
        
        <div className="jordan-products products">
        {mensShoes
        .filter((shoe) => shoe.Shoe__Name.includes(selectedShoe1))
        .map((shoe, index) => (
            <div 
            data-aos="fade-left" 
            className='shoe-container flex' 
            key={index}
            onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}
            >
                <div className='shoe-image flex'  >
                    <img src={urlFor(shoe.Shoe__Image)} alt="" />
                    <p className="price-text">${shoe.Shoe__Sizes[0].price}</p>
                </div>

                <h1 className="subheader-text">{shoe.Shoe__Name}</h1>
                <p className="paragraph-text">Mens Shoes</p>
            </div>
            
        ))}
        </div> 

        <div  className="product-names flex">
            
            <div className="product-name flex" onClick={() => setSelectedShoe2("Nike Dunk")}>
                {selectedShoe2 === "Nike Dunk" && (<BsArrowRight/>)}
                <h1 
                className={`
                header-text 
                ${selectedShoe2 === "Nike Dunk" ? "active" : ""}`
                }
                >
                    Nike Dunks
                </h1>
            </div>
            <div className="product-name flex " onClick={() => setSelectedShoe2("Yeezy 350")}>
                {selectedShoe2 === "Yeezy 350" && (<BsArrowRight />)}
                <h1 
                className={`
                header-text
                ${selectedShoe2 === "Yeezy 350" ? "active" : ""}
                `}
                >
                    Yeezy 350s
                </h1>
            </div>
            <div className="product-name flex" onClick={() => setSelectedShoe2("Yeezy Slide")}>
                {selectedShoe2 === "Yeezy Slide" && (<BsArrowRight />)}
                <h1 
                className={`
                header-text
                ${selectedShoe2 === "Yeezy Slide" ? "active" : ""}
                `}
                >
                    Yeezy Slides
                </h1>
            </div>

            <div className="arrows">
                <IoIosArrowBack onClick={() => scrollLeft(".nike-products")}/>
                <IoIosArrowForward onClick={() => scrollRight(".nike-products")}/>
            </div>



        </div>

        <div className="nike-products products">
        {mensShoes
        .filter((shoe) => shoe.Shoe__Name.includes(selectedShoe2))
        .map((shoe, index) => (
            <div 
            data-aos="fade-left" 
            className='shoe-container flex' 
            key={index}
            onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}
            >
                <div className='shoe-image flex'  >
                    <img src={urlFor(shoe.Shoe__Image)} alt="" />
                    <p className="price-text">${shoe.Shoe__Sizes[0].price}</p>
                </div>

                <h1 className="subheader-text">{shoe.Shoe__Name}</h1>
                <p className="paragraph-text">Mens Shoes</p>
            </div>
            
        ))}
        </div> 



        <hr />
        <div className="banners-container flex">

            <div 
            data-aos="fade-right"
            className="banner new-arrival-banner flex" 
            onClick={() => navigate("/shoes/newarrivals")}>
                <div className="banner-img new-arrival"></div>

                <div className="banner-text">
                    <span className='header-text new'>New Arrivals</span>
                    <p className='paragraph-text'>Explore Our Collection of Latest Shoe Arrivals</p>
                    <button className='btn btn-new-arrival flex'>Shop Now <BsArrowRight /></button>
                </div>
            </div>

            <div 
            className="banner best-seller flex"
            data-aos="fade-up"
            onClick={() => navigate("/shoes/mens/bestsellers")}
            >
                <div className="banner-img best-seller"></div>

                <div className="banner-text">
                    <h1 className='header-text best'>Best Sellers</h1>
                    <p className='paragraph-text'>Shop Our Most Popular and Best Selling Footwear</p>
                    <button className='btn btn-best-seller flex'>Shop Now <BsArrowRight /></button>
                </div>
            </div>
            <div 
            className="banner our-favorite flex"
            data-aos="fade-left"
            onClick={() => navigate("/shoes/mens/ourfavorites")}
            >
                <div className="banner-img our-favorite"></div>

                <div className="banner-text">
                    <h1 className='header-text favorites'>Our Favorites</h1>
                    <p className='paragraph-text'>View the LSR Kicks team's favorite sneakers</p>
                    <button className='btn btn-our-favorite flex'>Shop Now <BsArrowRight /></button>
                </div>
            </div>

            
        </div>

        <hr />


        
    </div>
  )
}

export default Products