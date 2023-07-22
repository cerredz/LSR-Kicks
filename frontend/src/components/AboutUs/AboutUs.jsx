import React, {useEffect} from 'react';
import "./AboutUs.css";

//import images
import covid from "../Assets/covid.jpeg";
import logo from "../Assets/lsrkicks-logo.png";
import firstShow from "../Assets/shoe-show.png";
import website from "../Assets/code.jpeg";
import today from "../Assets/lsr-today.jpeg";


//aos animation library
import Aos from "aos";
import "aos/dist/aos.css";

const AboutUs = (props) => {

  useEffect(() => {
    Aos.init({duration: 1000})
  }, [])

  return (
    <div className='about-container'>
      
      <div className="title-container flex">
        <span data-aos="fade-down" className="title-text">Our Story</span>
        <h3 data-aos="fade-up" className="subheader-text">Learn About the Story of LSR Kicks. </h3>


      </div>

      <div className="about-content flex">

        <div className="pandemic-content section">
          
          <img data-aos="fade-left" src={covid} alt="" />
          <div data-aos="fade-right" className="pandemic-text text ">
            <h1 className="header-text">The Pandemic</h1>
            <p className="paragraph-text">The COVID-19 pandemic brought about endless challenges in obtaining shoes for people worldwide. Disruptions in manufacturing and supply chains caused delays, leading to limited stock and inventory shortages. On top of this, lockdown restrictions made it almost impossible for individuals to physically access shoe shops. All in all, shopping for shoes became exponentially more difficult to purchase shoes.</p>
          </div>

          
        </div>

        <hr />

        <div className="creation-content section">

          <img data-aos="fade-right" className='logo' src={logo} alt="" />

          <div data-aos="fade-left" className="creation-text text">
            <h1 className="header-text">The Birth of LSR</h1>
            <p className="paragraph-text">In response to the challenging landscape of the shoe-buying industry at the time, three dedicated lifelong shoe resellers from central Jersey seized an opportunity to address this problem that many people were facing. Instead of relying on tradition retail stores, customers would directly engage with LSR Kicks, arranging meetups to acquire their desired footwear. It was through this approach and their unmatched commitment that these three resellers came together to create LSR Kicks in early 2022, driven by purpose of helping individuals obtain that shoes that they desired amidst the obstacles brought about by the global pandemic. </p>
          </div>
        </div>

        <hr />

        <div className="show-content section">

          <img data-aos="fade-left"src={firstShow} alt="" />
          <div data-aos="fade-right" className="show-text text">

            <h1 className="header-text">Our First Show</h1>
            <p className="paragraph-text">Within a couple of months
            everything began to change for LSR Kicks. 
            Each new day brought in new connections, 
            expanded inventory, and a growing number of trusted customers.
            LSR Kicks took this unprecedented growth in a short
            period of time as a indication that there was a immense demand for their products.
            Driven by the commitment to serving their customers, 
            LSR Kicks made the decision, only 2 months after forming, 
            to attend their first shoe-selling show with the intention of
            connecting and networking with other shoe sellers within the space in order to fufilled 
            the massive demand that we were facing at the time.
            
            </p>
          </div>

          

        </div>

        <hr />

        <div className="website-content section">
          <img  data-aos="fade-right"src={website} alt="" />

          <div data-aos="fade-left" className="website-text text">
            <h1 className="header-text">Building Our Website</h1>
            <p className="paragraph-text">Despite the rapid growth experienced by LSR Kicks,
              a crucial challenge loomed overhead that was yet to be solved by the LSR Kicks 
              team. The problem was that The business relied solely on in-person meetups, 
              limiting their ability to reach customers beyond a restricted geographical range.
              Recognizing the need for scalability and wider market access, LSR Kicks 
              decided to create a website from scratch, with the aim of giving
              people from all over the country, not just locally, a chance to purchase our high-quality 
              and authentic footwear for a resonable price.

              </p>
          </div>
        </div>

        <hr />


        <div className="today-content section">

          <img data-aos="fade-left" src={today} alt="" />

          <div data-aos="fade-right" className="today-text text">
            <h1 className="header-text">LSR Today</h1>
            <p className="paragraph-text">
              While the pandemic has calmed down since the creation of LSR Kicks, 
              the brand remains determined to sell shoes are highly sought after
              by individuals. Throughout our journey, LSR Kicks has made changes to the team behind the scenes,  
              successfully sold shoes to thoasands of satisfied customers, and made many valuable connections 
              to different shoe-sellers in the industry. In terms of our devotion, commitment, 
              and dedication to providing the best possible experience for our customers, nothing has changed
              and we will continue to grow as a community of sneaker enthusiasts.
          
              

              </p>
          </div>
        </div>

        <hr />
      </div>

      

      <div className="goal-content ">

        <div className="purpose-content card purpose">
          <h1 className="header-text ">Our Purpose</h1>
          <hr />
          <p className="paragraph-text"> Providing Authentic and Affordable Footwear to Everyone. </p>
        </div>

        <div className="attitude-content card attitude">
          <h1 className="header-text ">Our Attitude</h1>
          <hr />
          <p className="paragraph-text">Determined, Dedicated, Never Stop Satisfying Customers With Great Footwear </p>
        </div>

        <div className="mission-content card mission">
          <h1 className="header-text ">Our Mission</h1>
          <hr />
          <p className="paragraph-text">To Become the Biggest Shoe Distributor in the World.  </p>
        </div>
      </div>

      <div className="fun-facts-content ">


      </div>


    </div>
  )
}

export default AboutUs