import React, {useEffect} from 'react'
import "./Declassified.css";
import { useParams } from 'react-router-dom';

import { FAQ, Policies, AboutUs } from '../components'
const Declassified = (props) => {

    const {sendto} = useParams();

    useEffect(() => {

        //scroll to the right section based on what the user clicked
        let section = 0;
        console.log(sendto);

        if(sendto === "faq") {
            section = document.getElementById("FAQ");
        } else if (sendto === "about-us") {
            section = document.getElementById("ABOUT-US");
        } else if(sendto === "policies"){
            section = document.getElementById("POLICIES");
        }

        const coordinates = section.offsetTop;

        console.log(coordinates);

        window.scrollTo({top: coordinates - 100, behavior: 'smooth'});


    }, [])

  return (
    <div className='declassified-container'>
        
        <section id="FAQ">
            <FAQ />
        </section>

        <hr />

        <section id="POLICIES">
            <Policies />
        </section>

        <hr />

        <section id="ABOUT-US">
            <AboutUs />
        </section>
    </div>
  )
}

export default Declassified