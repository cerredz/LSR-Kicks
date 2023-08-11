import React, {useEffect} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import { Footer, Products, Declassified, Info, WelcomeScreen, Shipping, Success, Buy, SignUp, Navbar, Banner, Shoes, Questions, ContactUs, EmailList } from './components/components';

const App = () => {

    const showCategories = true;
    const noCategories = false;

    useEffect(() => {
      window.scrollTo(0,0);
    }, [])

  return (


    <div style={{background: `#05010d`, overflow:`hidden`}}>
      
      <Routes>
        <Route path="/" element={
          <>
            <Navbar  categories={showCategories}/>
            <WelcomeScreen />
            <Products />
            <EmailList />
            <Info />
            <Questions />
          </>
        } />

        <Route path='/shoes' >
          <Route path='mens' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="Mens Shoes"/>
            </>

            
            
          } />
          

        <Route path='mens/:filters' element={
          <>
            <Navbar categories={noCategories}/>
            <Shoes shoeCategory="Mens Shoes"/>
          </>
        } />

          <Route path='womens' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="Womens Shoes" />
            </>
          
          } />

          <Route path='newarrivals' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="New Arrivals" />
            </>
          }
          />

          <Route path= 'nike' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="Nike" filter="nike"/>
            </>
          }/>

          <Route path= 'jordan' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="Jordan" filter="jordan"/>
            </>
          }/>
          <Route path= 'yeezy' element={
            <>
              <Navbar categories={noCategories}/>
              <Shoes shoeCategory="Yeezy" filter="yeezy"/>
            </>
          }/>
          
          <Route path=':category/buy/:shoeName/:shoeImageUrl' element={
            <>
              <Navbar categories={noCategories}/>
              <Buy />
              
            </>
          }> </Route>
        </Route>

        <Route path='/contact' element={
        <>
          <Navbar categories={showCategories}/>
          <ContactUs />
        </>
        }/>
        
        <Route path='/contact/:topicValue' element={
          <>
            <Navbar categories={showCategories}/>
            <ContactUs />
          </>
        }/>

        <Route path='/signup/:from' element={<SignUp />}/>

        <Route path='/shipping/:from/:bagItems/:amount' element={<Shipping />}/>
        <Route path="/success/:email/:paymentID" element={<Success />} />
      
        <Route path='/lsr-info/:sendto' element={
          <>
            <Navbar />
            <Declassified />
          </>
        
        }/>
      
      </Routes>


      <Footer />
    </div>

    
  )
}

export default App