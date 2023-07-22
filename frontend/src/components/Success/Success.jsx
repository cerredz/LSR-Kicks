import React, {useState, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { urlFor, client } from '../../client';
import Axios from "axios";
import "./Success.css";



import success from "../Assets/checkmark.png";


const Success = (props) => {


    const [itemsPurchased, setItemsPurchased] = useState([]);
    const {email, paymentID} = useParams();

    //we must update all of the databases for the shoes the user has bought

    //retrieve the original databases
    const [mensDatabase, setMensDatabase] = useState([]);
    const [womensDatabase, setWomensDatabase] = useState([]);
    const [newArrivalsDatabase, setNewArrivalsDatabase] = useState([]);

    //keep useState Variables for the updated databases
    const [updatedMensDatabase, setUpdatedMensDatabase] = useState([]);
    const [updatedWomensDatabase, setUpdatedWomensDatabase] = useState([]);
    const [updatedNewArrivalsDatabase, setUpdatedNewArrivalsDatabase] = useState([]);
    
    



    
    const navigate = useNavigate();

    useEffect(() => {
        setItemsPurchased(JSON.parse(localStorage.getItem("bag")));

        //retrieve all of the databases in order to update them with the shoes the user bought
        const menQuery = '*[_type == "Mens__Shoes"]';
        const womenQuery = '*[_type == "Womens__Shoes"]';
        const newArrivalQuery = '*[_type == "New__Arrivals"]';

        

        //must check if the user's email and paymentID are in the database, that way we can correctly remove quantities from the database
        setTimeout(() => {
          Axios.post("http://localhost:3001/check-payment", {
          email: email,
          paymentID: paymentID
          }).then((res) => {
            
            //database of shoes has not been updated for most recent paymentID, so we update it 
            if(res.data === true) {
              console.log("Payment Has Been Verified, Removing Items From the database now.");
              
              client.fetch(menQuery).then((data) => {
                setMensDatabase(data);
              })
      
              client.fetch(womenQuery).then((data) => {
                setWomensDatabase(data);
              })
      
              client.fetch(newArrivalQuery).then((data) => {
                setNewArrivalsDatabase(data);
              })
            } 
          }).catch((error) => {
            console.log(error);
          })
        }, 1000)
        
        
          
        
    }, []);

   
    //update the shoes bought that are in the mens database
    useEffect(() => {
      const updatedDatabase = [...mensDatabase]; // Create a copy of the original database
    
      itemsPurchased.forEach((item) => {

        if (item.shoeDatabase === 'mens') {//check if the shoe belongs to the men's database

          const updatedShoeIndex = updatedDatabase.findIndex(//find the index of the shoe we are updating
            (shoe) => shoe.Shoe__Name === item.shoeName
          );
    
          if (updatedShoeIndex !== -1) {
            //update the quantity of the size of the shoe that that user bought
            const updatedSizes = updatedDatabase[updatedShoeIndex].Shoe__Sizes.map(
              (sizeObj) => {
                if (sizeObj.size === item.shoeSize) {
                  return {
                    ...sizeObj,
                    quantity: sizeObj.quantity - item.shoeQuantity
                  };
                }
                return sizeObj;
              }
            );

            // Remove sizes with quantity 0, 
            const filteredSizes = updatedSizes.filter(
              (sizeObj) => sizeObj.quantity > 0
            );

              //update the copy of the original database
            updatedDatabase[updatedShoeIndex] = {
              ...updatedDatabase[updatedShoeIndex],
              Shoe__Sizes: filteredSizes
            };
          }
        }
      });
      //store the updated copy of the array into a useState variable
      setUpdatedMensDatabase(updatedDatabase);
    }, [mensDatabase, itemsPurchased]);
    


    //one we get the updated men's database, then we have to actually update it in sanity
    useEffect(() => {
      
      client
      .fetch('*[_type == "Mens__Shoes"]._id') 
      .then((documentIds) => {

        //ids of each of the shoes in the database
        documentIds.forEach((documentId, index) => {


          client
              .fetch(`*[_id == "${documentId}"].Shoe__Name`)//get the shoe name
              .then((shoeName) => {
                
                //get the matching shoe using the shoe name in the updated mens database
                const updatedShoeInfo = updatedMensDatabase.find(
                  (shoe) => String(shoe.Shoe__Name).trim() === String(shoeName).trim()
                );
                
                  //check if we found it (we hopefully always will)
                if(updatedShoeInfo !== null && typeof updatedShoeInfo === 'object') {
                  client
                    .patch(documentId)
                    .set(updatedShoeInfo)//update the shoe's info
                    .commit()
                    .then((response) => {
                      console.log("Mens Database Successfully Updated");
                    })
                    .catch((error) => {
                      console.log("Error Updating Mens Database", error);
                    })

                } else {
                  console.log("Could Not Find Shoe")
                }
              })
              .catch((error) => {
                console.log('Error Retrieving Shoe Name', error);
              });
        });
      })
      .catch((error) => {
        console.log("Error Retrieving Document Id", error);
      })

    }, [updatedMensDatabase])
    

    //update the shoes bought that are in the womens database, need separate useEffect hooks otherwise shoes quantity will be subtracted miltiple times
    useEffect(() => {
      const updatedDatabase = [...womensDatabase]; // Create a copy of the original database
    
      itemsPurchased.forEach((item) => {

        if (item.shoeDatabase === 'womens') {//check if the shoe belongs to the womens's database

          const updatedShoeIndex = updatedDatabase.findIndex(//find the index of the shoe we are updating
            (shoe) => shoe.Shoe__Name === item.shoeName
          );
    
          if (updatedShoeIndex !== -1) {
            //update the quantity of the size of the shoe that that user bought
            const updatedSizes = updatedDatabase[updatedShoeIndex].Shoe__Sizes.map(
              (sizeObj) => {
                if (sizeObj.size === item.shoeSize) {
                  return {
                    ...sizeObj,
                    quantity: sizeObj.quantity - item.shoeQuantity
                  };
                }
                return sizeObj;
              }
            );

            // Remove sizes with quantity 0, 
            const filteredSizes = updatedSizes.filter(
              (sizeObj) => sizeObj.quantity > 0
            );

              //update the copy of the original database
            updatedDatabase[updatedShoeIndex] = {
              ...updatedDatabase[updatedShoeIndex],
              Shoe__Sizes: filteredSizes
            };
          }
        }
      });
      //store the updated copy of the array into a useState variable
      setUpdatedWomensDatabase(updatedDatabase);
    }, [womensDatabase, itemsPurchased]);

    //one we get the updated women's database, then we have to actually update it in sanity
    useEffect(() => {
      
      client
      .fetch('*[_type == "Womens__Shoes"]._id') 
      .then((documentIds) => {

        //ids of each of the shoes in the database
        documentIds.forEach((documentId, index) => {


          client
              .fetch(`*[_id == "${documentId}"].Shoe__Name`)//get the shoe name
              .then((shoeName) => {
                
                //get the matching shoe using the shoe name in the updated mens database
                const updatedShoeInfo = updatedWomensDatabase.find(
                  (shoe) => String(shoe.Shoe__Name).trim() === String(shoeName).trim()
                );
                
                  //check if we found it (we hopefully always will)
                if(updatedShoeInfo !== null && typeof updatedShoeInfo === 'object') {
                  client
                    .patch(documentId)
                    .set(updatedShoeInfo)//update the shoe's info
                    .commit()
                    .then((response) => {
                      console.log("Womens Database Successfully Updated");
                    })
                    .catch((error) => {
                      console.log("Error Updating Womens Database: ", error);
                    })

                } else {
                  console.log("Could Not Find Shoe")
                }
              })
              .catch((error) => {
                console.log('Error Retrieving Shoe Name', error);
              });
        });
      })
      .catch((error) => {
        console.log("Error Retrieving Document Id", error);
      })

    }, [updatedWomensDatabase])




    //update the shoes bought that are in the new arrivals database
    useEffect(() => {
      const updatedDatabase = [...newArrivalsDatabase]; // Create a copy of the original database
    
      itemsPurchased.forEach((item) => {

        if (item.shoeDatabase === 'new-arrivals') {//check if the shoe belongs to the men's database

          const updatedShoeIndex = updatedDatabase.findIndex(//find the index of the shoe we are updating
            (shoe) => shoe.Shoe__Name === item.shoeName
          );
    
          if (updatedShoeIndex !== -1) {
            //update the quantity of the size of the shoe that that user bought
            const updatedSizes = updatedDatabase[updatedShoeIndex].Shoe__Sizes.map(
              (sizeObj) => {
                if (sizeObj.size === item.shoeSize) {
                  return {
                    ...sizeObj,
                    quantity: sizeObj.quantity - item.shoeQuantity
                  };
                }
                return sizeObj;
              }
            );

            // Remove sizes with quantity 0, 
            const filteredSizes = updatedSizes.filter(
              (sizeObj) => sizeObj.quantity > 0
            );

              //update the copy of the original database
            updatedDatabase[updatedShoeIndex] = {
              ...updatedDatabase[updatedShoeIndex],
              Shoe__Sizes: filteredSizes
            };
          }
        }
      });
      //store the updated copy of the array into a useState variable
      setUpdatedNewArrivalsDatabase(updatedDatabase);
    }, [newArrivalsDatabase, itemsPurchased]);


    //one we get the updated new arrivals database, then we have to actually update it in sanity
    useEffect(() => {
      
      client
      .fetch('*[_type == "New__Arrivals"]._id') 
      .then((documentIds) => {

        //ids of each of the shoes in the database
        documentIds.forEach((documentId, index) => {


          client
              .fetch(`*[_id == "${documentId}"].Shoe__Name`)//get the shoe name
              .then((shoeName) => {
                
                //get the matching shoe using the shoe name in the updated mens database
                const updatedShoeInfo = updatedNewArrivalsDatabase.find(
                  (shoe) => String(shoe.Shoe__Name).trim() === String(shoeName).trim()
                );
                
                  //check if we found it (we hopefully always will)
                if(updatedShoeInfo !== null && typeof updatedShoeInfo === 'object') {
                  client
                    .patch(documentId)
                    .set(updatedShoeInfo)//update the shoe's info
                    .commit()
                    .then((response) => {
                      console.log("New Arrivals Database Successfully Updated");
                    })
                    .catch((error) => {
                      console.log("Error Updating New Arrivals Database: ", error);
                    })

                } else {
                  console.log("Could Not Find Shoe")
                }
              })
              .catch((error) => {
                console.log('Error Retrieving Shoe Name', error);
              });
        });
      })
      .catch((error) => {
        console.log("Error Retrieving Document Id", error);
      })

    }, [updatedNewArrivalsDatabase])


    const handleBackToHomepage = () => {

      localStorage.removeItem("bag");
      navigate("/");
    }

  return (
    <div className='purchase-container flex'>  
      <div className='thank-you-container flex'>

        <img className='checkmark' src={success} alt="" />
        <div className="purchase-message">
            <h1 className='header-text'>Purchase Complete</h1>
            <p className='paragraph-text'>Thank You For Doing business with LSR Kicks, and welcome to the community.</p>
            <br />
            <p className='paragraph-text'>We Have sent you an email confirming your order.</p>
            <br />
            
            <p className='paragraph-text'>If you have any questions regarding your purchase make sure to <a href="/contact">contact us</a>.</p>
            <br />
            <button className='btn-submit' onClick={() => handleBackToHomepage()}>Ok</button>
       
        </div>

      </div>
    </div>
    
  )
}

export default Success