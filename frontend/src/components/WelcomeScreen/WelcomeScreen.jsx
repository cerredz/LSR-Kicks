import React, {useState, useEffect} from 'react'
import { client, urlFor } from '../../client';
import { useNavigate } from 'react-router-dom';
import "./WelcomeScreen.css";


//import react icons
import {IoIosArrowForward} from "react-icons/io"
//import shoe images
import jordanIMG from "../Assets/jordan-4.png";
import nikeIMG from "../Assets/nike-dunk.png";
import yeezyIMG from "../Assets/yeezy-slides.png";

//aos animation library
import Aos from "aos";
import 'aos/dist/aos.css';

//data for the banners
const brandsInfo = [
    {
        title: 'Nike',
        description: `Iconic Style, Relentless Performance - Experience the Power of Nike`,
        image: nikeIMG,
        imageClassname: 'nike',
        open: false,
        btnColor: "#1726DE",
        fade: 'fade-left'

    },
    {
        title: 'Jordan',
        description: `Unleash your Inner Champion - Step Into the Legacy of Jordan`,
        image: jordanIMG,
        imageClassname: 'jordan',
        open: false,
        btnColor: 'rgb(192, 89, 195)',
        fade: 'fade-right'

    },
    {
        title: 'Yeezy',
        description: 'Bold statements, Fearless Fashion - Make a Statement with Yeezy.',
        image: yeezyIMG,
        imageClassname: 'yeezy',
        open: false,
        btnColor: '#6D0AD9',
        fade: 'fade-left'


    }

]


const WelcomeScreen = () => {

    
    const navigate = useNavigate();
    const [shoeSlideShow, setShoeSlideShow] = useState({
        nike: false,
        jordan: false,
        yeezy: false

    });

    const [brandClassName, setBrandClassName] = useState("closed")
    //shoe date for nikes, yeezys, and jordans 
    const [allShoes, setAllShoes] = useState([]);
    const [shoeData, setShoeData] = useState({
        nike: [],
        jordan: [],
        yeezy: []
    })
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    //get the shoe database,and filter the nikes, jordans, and yeezy into the correct usestate variables
    useEffect(() => {
        const query = '*[_type == "Mens__Shoes"]';

        client.fetch(query).then((data) => {
            setAllShoes(data);
        });

        setBrands(brandsInfo);

        Aos.init({
            duration: 1000,
            offset: -5
        });

        window.scrollTo(0,0);
        
    }, [])

    useEffect(() => {
       
        console.log("All Shoes: ", allShoes);

        const nikeShoes = allShoes.filter((shoe) => {
            return shoe.Shoe__Name.toLowerCase().includes("nike");
        })

        const jordanShoes = allShoes.filter((shoe) => {
            return shoe.Shoe__Name.toLowerCase().includes("jordan");
        })

        const yeezyShoes = allShoes.filter((shoe) => {
            return shoe.Shoe__Name.toLowerCase().includes("yeezy");
        })

        setShoeData({
            nike: nikeShoes,
            jordan: jordanShoes,
            yeezy: yeezyShoes
        })
    }, [allShoes])

    useEffect(() => {
        console.log(shoeData);
    }, [shoeData]);

    //when an arrow is clicked, we want to expand the current slideshow and close all other opened slideshows
    const handleArrowClick = (brand) => {

        const update = {...shoeSlideShow};

        if(brand.title === "Nike") {

            update.nike = !update.nike;
            update.yeezy = false;
            update.jordan = false;

        } else if (brand.title === "Jordan") {
            update.jordan = !update.jordan;
            update.nike= false;
            update.yeezy = false;

            
        } else if (brand.title === "Yeezy") {
            update.yeezy = !update.yeezy;
            update.nike = false;
            update.jordan = false;
        }

    
        setShoeSlideShow(update);

        setBrands((prevBrands) =>
            prevBrands.map((b) => ({
           ...b,
           open: b.title === brand.title ? !b.open : false
            
        })))
    
        setSelectedBrand((prevSelectedBrand) =>
            prevSelectedBrand === brand.title ? null : brand.title // Toggle selected brand
        );
    }


    //function to redirect user to the buy page
    const handleShoeClick = (name, imageUrl) => {

        const shoeWithoutSpaces = name.replace(/ /g, "-");
        const encodedShoeName = encodeURIComponent(shoeWithoutSpaces);
        navigate(`/shoes/mens/buy/${encodedShoeName}/${encodeURIComponent(imageUrl)}`);
      }

  return (
    <div className='welcome-container'>
        
        
        <div className="welcome-content">
            
            <div  className="welcome-title flex">
                
                <h1 data-aos="fade-down" className='header-text'><span className='header-text span'> Popular </span>  Brands</h1>
                <h2 data-aos="fade-up" className='subheader-text'>Indulge In Our Timeless Style With Nike, Yeezy, and Jordan - Where Legacy Meets Unmatched Quality</h2>
            </div>

            <div className="brands-container flex">

                {brands && brands.map((brand, index) => (
                    <>
                    
                        <div data-aos={brand.fade} className={`brand ${brand.title}`} >
                           
                            <div onClick={() => navigate(`/shoes/mens/${brand.imageClassname}`)} className={`brand-title flex ${brand.open ? "open" : ""}`}>
                                <h1 className='header-text'>{brand.title}</h1>
                                <h1 className="paragraph-text">{brand.description}</h1>
                            </div>  

                            <div onClick={() => navigate(`/shoes/mens/${brand.imageClassname}`)} className={`brand-shoe flex `}>
                                <img className={brand.imageClassname} src={brand.image} alt="" />
                                
                            </div>  

                            <div className="brand-arrow flex" onClick={() => handleArrowClick(brand)}>
                                <IoIosArrowForward />
                            </div>
                        


                        </div>

                        <div className={`caurosel-container ${selectedBrand === brand.title ? "caurosel-open" : "caurosel-closed"}`}>

                            {brand.title === "Nike" && shoeSlideShow.nike && (
                                <>
                                    <div className="shoes-slideshow " >
                                        {shoeData.nike.map((shoe) => (
                                            <>
                                                
                                                <div className='shoe flex nike' onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}>
                                                    <p className="paragraph-text">{shoe.Shoe__Name}</p>
                                                    <img src={urlFor(shoe.Shoe__Image)} alt="" />
                                                    <p className="paragraph-text price">{shoe.Shoe__Sizes[0].price}+</p>
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    
                                    <div className="btn-container flex">
                                        <button  className='btn-shop' onClick={() => navigate("/shoes/mens/nike")}>Shop Now</button>
                                    </div>
                                    
                                </>
                            )}

                            {brand.title === "Jordan" && shoeSlideShow.jordan && (
                                <>
                                    <div className="shoes-slideshow ">
                                        {shoeData.jordan.map((shoe) => (
                                            <>
                                                
                                                <div className='shoe flex jordan' onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}>
                                                    <p className="paragraph-text">{shoe.Shoe__Name}</p>
                                                    <img src={urlFor(shoe.Shoe__Image)} alt="" />
                                                    <p className="paragraph-text price">{shoe.Shoe__Sizes[0].price}+</p>
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    
                                    <div className="btn-container flex">
                                        <button  className='btn-shop' onClick={() => navigate("/shoes/mens/jordan")}>Shop Now</button>
                                    </div>
                                    
                                </>
                            )}

                            {brand.title === "Yeezy" && shoeSlideShow.yeezy && (
                                <>
                                    <div className="shoes-slideshow ">
                                        {shoeData.yeezy.map((shoe) => (
                                            <>
                                                
                                                <div className={`shoe flex yeezy`} onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}>
                                                    <p className="paragraph-text">{shoe.Shoe__Name}</p>
                                                    <img src={urlFor(shoe.Shoe__Image)} alt="" />
                                                    <p className="paragraph-text price">{shoe.Shoe__Sizes[0].price}+</p>                                                
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    
                                    <div className="btn-container flex">
                                        <button className='btn-shop' onClick={() => navigate("/shoes/mens/yeezy")}>Shop Now</button>
                                    </div>
                                    
                                </>
                            )}
                        </div>  
                    </>

                    
                )) }
            </div>
        </div>
        
       
    </div>
  )
}

export default WelcomeScreen