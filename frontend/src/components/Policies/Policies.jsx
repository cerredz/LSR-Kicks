import React, {useState, useEffect} from 'react';
import { PoliciesData } from './Policies';
import "./Policies.css";

//aos animation library
import Aos from "aos";
import "aos/dist/aos.css";

const Policies = (props) => {

  const [policyData, setPolicyData] = useState([]);

  //set our policy data on render
  useEffect(() => {
    setPolicyData(PoliciesData);
  },[])


  return (
    <div className='policies-container'>
      <div className="policies-title">
        <span className="header-text">Policies</span>
        <p data-aos="zoom-in-up" className="paragraph-text">Below is a list of things / policies you should be aware of as a customer before buying any of our products.</p>
      </div>
        
        
        <div className="policies-content">
          
          {policyData.map((section, index) => (
            <div key={index} data-aos={section.zoom} className="section-content">
              
              <div className='section flex'>
                <h1 className="header-text">{section.section}</h1> 
              </div>

              <div className="policies">
                <ul>
                  {section.items.map((policy, index) => (
                    <li key={index}>
                      <p className="paragraph-text" dangerouslySetInnerHTML={{ __html: policy.description }}></p>
                      <br />
                    </li>
                    
                  ))}
                </ul>
              </div>
              
            </div>
          ))}
        </div>
    </div>
  )
}

export default Policies