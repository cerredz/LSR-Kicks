import React, {useState, useEffect} from 'react';
import HompageReturn from '../HomepageReturn/HompageReturn';

// react icons / css
import {FiSearch} from "react-icons/fi";
import {IoMdClose} from "react-icons/io";
import { RiArrowUpSLine } from "react-icons/ri";
import "./Shoes.css";

//helper functions
import { urlFor, client } from '../../client';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Shoes = (props) => {

    //useState variables to what type of shoes User is looking at
    const [shoeCategory, setShoeCategory] = useState(props.shoeCategory);
    const [bannerMessage, setBannerMessage] = useState(props.shoeCategory);
    const [bannerClassName, setBannerClassName] = useState("");
    const [shoeData, setShoeData] = useState([]);

    //useState variables for filters and search containers
    const [searchQuery, setSearchQuery] = useState("");
    const [brandsContainer, setBrandsContainer] = useState(true);
    const [sizesContainer, setSizesContainer] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);


    const [shoeName, setShoeName] = useState("");
    const [shoeImageUrl, setShoeImageUrl] = useState("");
    const {filters} = useParams();

    const navigate = useNavigate();
    
    //we must do two things upon loading of the shoe component:
      //load the correct banner
      //obtain the correct database of shoe data


    useEffect(() => {

        //scroll to top of page on render
        window.scrollTo(0,0);

        //must decide what shoe database to pull from based on what category the user clicked
        let query = "";
        if(shoeCategory === "Mens Shoes" || shoeCategory === "Nike" || shoeCategory === "Jordan" || shoeCategory === "Yeezy"){
          setBannerClassName("mens");
          query = '*[_type == "Mens__Shoes"]';
        } else if (shoeCategory === "Womens Shoes"){
          setBannerClassName("womens");
          query = '*[_type == "Womens__Shoes"]';
        } else if (shoeCategory === "New Arrivals"){
          setBannerClassName("new-arrivals");
          query = '*[_type == "New__Arrivals"]';
        }
        

        //user did not click navbar, but rather popular brands banner
        if(shoeCategory === "Nike" || shoeCategory === "Jordan" || shoeCategory === "Yeezy") {
          setBannerMessage("Mens Shoes");
          
        }

        //store shoe database into useState variable
        client.fetch(query).then((data) => {
          setShoeData(data);
        })

        
        if(filters === "nike") {
          setSelectedBrands(["Nike"]);
        } else if (filters === "jordan") {
          setSelectedBrands(["Jordan"]);
        } else if (filters === "yeezy") {
          setSelectedBrands(["Yeezy"]);
        }//user clicked one of the three cards in the "Products" component
        else if (filters === "bestsellers") {

          const bestSellers = ["Nike Dunk" , "Jordan 4", "Yeezy Slide"];
          setSelectedBrands(bestSellers);

        } else if (filters === "ourfavorites") {

          const favorites = ["Jordan 11", "Jordan 1 "]
          setSelectedBrands(favorites);

        } else {
            //user clicked featured products in the footer
            const shoe = [];

            if(filters === "NikeDunk") {
              shoe.push("Nike Dunk");
            } else if(filters === "Jordan1") {
              shoe.push("Jordan 1")
            } else if(filters === "Jordan4") {
              shoe.push("Jordan 4")
            } else if(filters === "Jordan11") {
              shoe.push("Jordan 11")
            } else if(filters === "Yeezy350") {
              shoe.push("Yeezy 350")
            } else if(filters === "YeezySlides") {
              shoe.push("Yeezy Slide")
            }

            setSelectedBrands(shoe);
        } 

        


      }, [])

      useEffect(() => {
        console.log(selectedSizes);
      }, [selectedSizes])

      useEffect(() => {
        console.log(selectedBrands);
      }, [selectedBrands])
    //now we must create functions that handle the filter options a user selects

    //function to handle brand filter
    const handleBrandFilter = (brand) => {
      setSelectedBrands((prevBrands) => {
        if (prevBrands.includes(brand)) {
          return  prevBrands.filter((b) => b !== brand);
        } else {
          return [...prevBrands, brand];
        }
      });
    };
    

    //function to handle size filter
    const handleSizeFilter = (size) => {
      setSelectedSizes((prevSizes) => {
        if (prevSizes.includes(size)) {
          return prevSizes.filter((s) => s !== size);
        } else {
          return [...prevSizes, size];
        }
      });

    };

    //function to redirect user to the buy page
    const handleShoeClick = (name, imageUrl) => {

      const shoeWithoutSpaces = name.replace(/ /g, "-");
      const encodedShoeName = encodeURIComponent(shoeWithoutSpaces);

      setShoeName(shoeWithoutSpaces);
      setShoeImageUrl(imageUrl);

      navigate(`/shoes/${bannerClassName}/buy/${encodedShoeName}/${encodeURIComponent(imageUrl)}`);
    }
    


  return (
    <div className='shoes-container' >
      

      <div className={`banner-container flex ${bannerClassName}`}>
          <h1 className={`header-text title `}>{bannerMessage}</h1>
      </div>

      <div className='search-container flex'>
          <div className='search-content flex'>
            <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder='Search Shoes' />
            <FiSearch />
          </div>
      </div>

    <div className="content-container">
    <div className='filter-container'>
        <h2 className='header-text'>Filters</h2>
        <hr />

        <div className="brand-container">
          <div className="brand-heading flex">
            <h3 
            className='subheader-text'
            onClick={() => setBrandsContainer((prev) => !prev)}
            >Brands</h3>
            {brandsContainer && (
              <IoMdClose onClick={() => setBrandsContainer((prev) => !prev)}/>
            )}

            {!brandsContainer && (
              <RiArrowUpSLine onClick={() => setBrandsContainer((prev) => !prev)} />
            )}
          </div>

          {brandsContainer && (
            <ul>

              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Jordan")}
                checked={selectedBrands.includes("Jordan")}
                />
                <p>Jordan</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Jordan 4")} 
                checked={selectedBrands.includes("Jordan 4")}
                
                />
                <p>Jordan 4</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Jordan 11")}
                checked={selectedBrands.includes("Jordan 11")}
                />
                <p>Jordan 11</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Jordan 12")}
                checked={selectedBrands.includes("Jordan 12")}
                
                />
                <p>Jordan 12</p></li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Jordan 1 ")}
                checked={selectedBrands.includes("Jordan 1 ")}
                
                />
                <p>Jordan 1</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Nike")} 
                checked={selectedBrands.includes("Nike")}
                
                />
                <p>Nike</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Nike Dunk")}
                checked={selectedBrands.includes("Nike Dunk")}
                
                />
                <p>Nike Dunk</p>
              </li>
              <li>
                <input 
                type='checkbox'
                onChange={() => handleBrandFilter("Nike Air Force")}
                checked={selectedBrands.includes("Nike Air Force")}
                 
                 />
                <p>Nike Air Force</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Yeezy 350")} 
                checked={selectedBrands.includes("Yeezy 350")}
                
                />
                <p>Yeezy 350</p>
              </li>
              <li>
                <input 
                type='checkbox' 
                onChange={() => handleBrandFilter("Yeezy Slide")}
                checked={selectedBrands.includes("Yeezy Slide")}
                
                />
                <p>Yeezy Slides</p>
              </li>
            </ul>
          )}
          
        </div>

        <hr />

        <div className='size-container'>
            
            <div className="size-heading flex">
              <h3 
              className='subheader-text' 
              onClick={() => setSizesContainer((prev) => !prev)}
              >Sizes</h3>

              {sizesContainer && (
                <IoMdClose onClick={() => setSizesContainer((prev) => !prev)}/>
              )}

              {!sizesContainer && (
                <RiArrowUpSLine onClick={() => setSizesContainer((prev) => !prev)} />
              )}
            </div>

            {sizesContainer && (
              <ul>
                <li><input type='checkbox' onChange={() => handleSizeFilter("3")}/> <p>3</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("3.5")}/> <p>3.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("4")}/> <p>4</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("4.5")}/> <p>4.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("5")}/> <p>5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("5.5")}/> <p>5.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("6")}/> <p>6</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("6.5")}/> <p>6.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("7")}/> <p>7</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("7.5")}/> <p>7.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("8")}/> <p>8</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("8.5")}/> <p>8.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("9")}/> <p>9</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("9.5")}/> <p>9.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("10")}/> <p>10</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("10.5")}/> <p>10.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("11")}/> <p>11</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("11.5")}/> <p>11.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("12")}/> <p>12</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("12.5")}/> <p>12.5</p></li>
                <li><input type='checkbox' onChange={() => handleSizeFilter("13")}/> <p>13</p></li>
              </ul>
            )}


        </div>


      </div>

      <div className="inventory-container">
        

          {shoeData
              .filter((shoe) => shoe.Shoe__Name.toLowerCase().includes(searchQuery.toLowerCase()))
              .filter((shoe) => selectedBrands.length === 0 || selectedBrands.some((brand) => shoe.Shoe__Name.includes(brand)))
              .filter((shoe) => 
                selectedSizes.length === 0 ||
                shoe.Shoe__Sizes.some((sizeObj) =>
                  selectedSizes.includes(String(sizeObj.size))
                )
              )
              .map((shoe, index) => (
                
                <div className="shoe-item flex" key={index} name={shoe.Shoe__Name}>
                  
                  <div 
                  className='shoe-image-container flex'
                  onClick={() => handleShoeClick(shoe.Shoe__Name, urlFor(shoe.Shoe__Image))}
                  >
                    <img
                      className= {`shoe-image flex ${shoe.Shoe__Name.toLowerCase().includes("nike") ? "nike" : "" } &&
                      ${shoe.Shoe__Name.toLowerCase().includes("jordan") ? "jordan" : "" }`}
                      src={urlFor(shoe.Shoe__Image)}
                      alt={shoe.Shoe__Name}
                      
                    />
                  </div>
                  
                  <div>
                    <h2 className="shoe-name">{shoe.Shoe__Name}</h2>
                  <p className="shoe-price">${shoe.Shoe__Sizes[0].price}+</p>
                  </div>
                  
                
                </div>
              ))
              
          }


        <HompageReturn />
    </div>
    </div>
      

      

      

          
    </div>
  )
}

export default Shoes