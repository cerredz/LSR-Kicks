
require('dotenv').config();

const express = require("express");
const app = express();
const mySQL = require("mysql");
const cors = require('cors');
const nodemailer = require("nodemailer");
const paypal = require("paypal-rest-sdk");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


app.use(cors());
app.use(express.json());


//create the connection for the sql database
const database = mySQL.createConnection({
    user: `${process.env.DB_USERNAME}`,
    host: `${process.env.DB_HOST}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DBNAME}`
})

//connect to the sql database
database.connect((error) => {

    if(error) {
        console.log("Error connecting to the database: ", error.message);

    } else {
        console.log("Successfully connected to the Users database");
    }
})



//configure paypal settings in order to use the api
paypal.configure({
  mode: 'live',
  client_id: `${process.env.PAYPAL_LIVE_CLIENT_ID}`,
  client_secret: `${process.env.PAYPAL_LIVE_SECRET_ID}`
})

// create reusable transporter object using the default SMTP transport
let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.NODEMAILER_USERNAME}`,
        pass: `${process.env.NODEMAILER_PASSWORD}`
      }
});
  
    
//add first time user to the sql database
/*---------------------------------------------------------------------------------------------------------- */
app.post('/adduser', (req, res) => {
    const email = req.body.email;
    const shoesBought = "";
    const priceSpent = 0;
    const paymentHistory = "";
    

    database.query("SELECT * FROM users WHERE Email = ?", [email], (error, result) => {
        if (error) {
          console.log(error);
        } else {
          if (result.length === 0) {
            // User does not exist, perform the INSERT statement
            database.query(
              "INSERT INTO users (Email, Shoes_Bought, Price_Spent, Payment_ID_History) VALUES (?, ?, ?, ?)",
              [email, shoesBought, priceSpent, paymentHistory],
              (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("User " + email + " successfully inserted into the database");
                }
              }
            );
          } else {
            // User already exists
            console.log("User " + email + " already exists in the database");
          }
        }
      });
      res.send("Completed");
})
/*--------------------------------------------------------------------------------------------------------- */
//create a post function to send an email to a specified user
/*--------------------------------------------------------------------------------------------------------- */
app.post("/send/email", (req,res) => {

    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const subject = req.body.subject;
    const message = req.body.message;

    //configure mail options
    let mailOptions = {
        from: 'nodetester12345@gmail.com',
        to: '422michaelcerreto@gmail.com',
        subject: 'Customer Support',
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${subject}\nPhone Number: ${phoneNumber}\n${message}`
    }

    mailTransporter.sendMail(mailOptions, (error, res) => {
        if(error) {
            console.log(error);
        }
    })

})
/*----------------------------------------------------------------------------------------------------------------------*/
//create function that checks if a user exists in the database and send the result to the frontend
/*--------------------------------------------------------------------------------------------------------------------  */

app.get("/checkEmail/:email", (req, res) => {

    const email = req.params.email;

    database.query("SELECT * FROM users where email = ? ", [email], 
    (error, result) => {
        if(error) {
            res.send(false);
        } else {
            if(result.length === 0) {
                res.send(false);
            } else {
                res.send(true);
            }
        }
    })
})
/*----------------------------------------------------------------------------------------------------------------------*/
//create function that attempts to make a payment with paypal for a user
/*----------------------------------------------------------------------------------------------------------------------*/
app.post("/paypal/:email/:amount", (req, res) => {
    
    const amount = req.params.amount;
    const name = req.body.user.name;
    const email = req.body.user.email;
    const state = req.body.user.state;
    const address = req.body.user.address;
    const number = req.body.user.number;
    const bagItems = req.body.items;

    console.log(amount);
    console.log(email);


    console.log("Post Request Has Been Recieved. Making the PayPal payment now...")

    
    

    const itemDetails = bagItems.map((item) => {
      
      return {
        
        name: item.shoeName,
        price: item.shoePrice,
        quantity: item.shoeQuantity,
        currency: "USD",
        
      };
    });

    const itemSizes = bagItems.map((item) => {
      return {
        size: item.shoeSize
      }
    })

    console.log("Bag Items: ", itemDetails);
    //create data for paypal payment
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `http://localhost:3001/success?amount=${encodeURIComponent(amount)}&itemSizes=${encodeURIComponent(JSON.stringify(itemSizes))}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&state=${encodeURIComponent(state)}&address=${encodeURIComponent(address)}&number=${encodeURIComponent(number)}&itemDetails=${encodeURIComponent(JSON.stringify(itemDetails))}`,
        cancel_url: 'http://localhost:3001/cancel'
      },
      transactions: [{
        amount: {
          total: amount,
          currency: 'USD',
          
        },
        
        description: 'Payment for goods/services'
      }],

      
    };
    
  

    //create actual paypal payment
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        
        
        
        console.error('Error creating PayPal payment:', error);
        res.status(500).json({ error: 'Payment creation failed' });
      } else {
        // Redirect the user to the PayPal payment approval URL
        console.log("Redirecting the User Now...");
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.json({ approval_url: payment.links[i].href });
            break;
          }
        }
      }
    });
  
})

app.get("/success", (req, res) => {
  //user payment information
  const payerId = req.query.PayerID;
  const paymentID = req.query.paymentId;
  const amount = req.query.amount;
  const itemSizes = JSON.parse(req.query.itemSizes);

  //user information
  const name = req.query.name;
  const email = req.query.email;
  const state = req.query.state;
  const address = req.query.address;
  const number = req.query.number;


  console.log("Executing the purchase Now...");

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency" : "USD",
        "total": amount
      }
    }]
  }

  paypal.payment.execute(paymentID, execute_payment_json, (error, payment) => {
    if(error) {
      console.log.apply(error.response);
      throw error;
    } else {


      //extract user email and payment ID from the payment
      const userEmail = payment.payer.payer_info.email;
      const paymentID = payment.id;


      //extract the all items the user bought
      const itemDetails = JSON.parse(req.query.itemDetails);
      console.log("Item Details: ",itemDetails);
      const shoeNames = [];



      //configure the mail options for the confirmation email that we will be sending to the user
      let purchaseMailOptions = {
        from: 'nodetester12345@gmail.com',
        to: `${userEmail}`,
        subject: 'Purchase Confirmation',
        text: `Payment ID: ${paymentID} \n Items Bought: \n`
      }

      //configure the mail options for the email we will be sending to LSR Kicks that contains the shipping information
      let shippingMailOptions = {
        from: 'nodetester12345@gmail.com',
        to: '422michaelcerreto@gmail.com',
        subject: 'Order Recieved',
        text: `Name: ${name} \nEmail Address: ${email} \nState: ${state} \nStreet Adddress: ${address} \nPhone Number: ${number} \nItems Bought: \n`
      }


      //create the text of all the items bought for the confirmation email
      itemDetails.forEach((item, index) => {
        
        const formattedText = `Shoe Name: ${item.name}\n`
          + `Shoe/s Total Price: $${item.price}.00\n`
          + `Shoe Size: ${itemSizes[index].size}\n`
          + `Shoe Quantity: ${item.quantity}\n\n`;

          shoeNames.push(formattedText);

          purchaseMailOptions.text += formattedText;
          shippingMailOptions.text += formattedText;
          
      })

      shippingMailOptions.text += `Total Price: $${amount}.00`;

      
      //send the information of all the times bought and the paymentID
      mailTransporter.sendMail(purchaseMailOptions, (error, res) => {
        if(error) {
          console.log(error);
        } else {
          console.log("Confirmation Email Has Successfully Been Sent to the User!!");
        }
      })

      //send the shipping information to LSR Kicks, so they can ship out the products
      mailTransporter.sendMail(shippingMailOptions, (error, res) => {
        if(error) {
          console.log(error);
        } else {
          console.log("LSR Kicks has successfully recieved the order");
        }
      })

      const shoesBought = shoeNames.join(`---------------------------------------------\n`);
      //update the user's information in the database
      console.log(`Updating information in the database for ${userEmail}... `)
      database.query(
        "UPDATE users SET Shoes_Bought = CONCAT(Shoes_Bought,?), Payment_ID_History = CONCAT(Payment_ID_History,?), Price_Spent = Price_Spent + ? WHERE Email = ?  ", [shoesBought, paymentID + ",", amount, userEmail], 
        (error, result) => {
          if (error) {
            console.log(error);
            console.log(`${userEmail} was not found in the database, adding them now...` );
              //User not found, insert the user into the database
              database.query(
                "INSERT INTO users (Email, Shoes_Bought, Price_Spent, Payment_ID_History) VALUES (?, ?, ?)",
                [userEmail, shoesBought, amount, ""],
                (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("User " + userEmail + " successfully inserted into the database.");
                  }
                }
              );
            
          } else {
            console.log(`Shoes bought and price spent has been successfully updated for ${userEmail} `);
          }
        }
      );
  
      //redirect the user to the purchase successful page on the frontend
      res.redirect(`http://localhost:3000/success/${userEmail}/${paymentID}`);
    }
  
  })
})

app.get("/cancel", (req, res) => {
  console.log("Purchase Cancelled, Redirecting Back to Home Page...");
  res.redirect("http://localhost:3000/");
})


/*----------------------------------------------------------------------------------------------------------------------*/
//create function that adds a user's email to an sql database 
//that serves as an email list
/*----------------------------------------------------------------------------------------------------------------------*/

app.post("/emails", (req,res) => {

    const email = req.body.email;
    console.log("Adding ", email, " to the email list...")

    //first check if the user is already in the email list

    database.query("SELECT * FROM emails WHERE email = ?", [email], (error, results) => {
      
      if (error) {
        console.error('Error checking email:', error);
        res.sendStatus(500);
        return;
      }
  
      if (results.length > 0) {
        // Email already exists in the table
        console.log(email, "is already in the email list");
        res.sendStatus(200);
      } else {
        // Add the email to the "emails" table
        const insertUser = `INSERT INTO emails (email) VALUES ('${email}')`;
        database.query(insertUser, (insertError) => {
          if (insertError) {
            console.error('Error inserting email:', insertError);
            res.sendStatus(500);
            return;
          }
          console.log("Successfully added ", email, " into the email list");
          res.sendStatus(201);
        });
      }
    });
  
})

/*----------------------------------------------------------------------------------------------------------------------*/
//function that makes sure the database of shoes is only updated once per purchase
/*----------------------------------------------------------------------------------------------------------------------*/
app.post("/check-payment", (req, res) => {

  const user_email = req.body.email;
  const payment_id = req.body.paymentID;

  database.query("SELECT * FROM users WHERE email = ?", [user_email], (error, result) => {

    if (error) {
      console.log("Error Locating Email Address", error);
      res.send(false);
    } else {
      if (result.length > 0) {
        console.log(user_email, "has been successfully located in the database.")

        // Obtain all of the separate payment id's of the user and split them into an array
        const payment_id_history = result[0].Payment_ID_History;
        const payment_id_array = payment_id_history.split(',');
        console.log(payment_id_history);

        // Get the most recent payment id
        const lastest_payment_id = payment_id_array[payment_id_array.length - 2];

        console.log("Most Recent Payment_ID for ", user_email, ": ", lastest_payment_id);

        if (lastest_payment_id === payment_id) {
          // Create a new payment id that will never be recognized, this will indicate to the frontend that the shoe items
          // purchased belonging to the most recent ACTUAL payment id have already been decreased in the database.
          // What this ensures is that if the user refreshes on the /success page, then items' quantities
          // will not be double subtracted
          const updated_payment_id_history = payment_id_history + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' +  ',';

          // Update the users table with the updated payment_id_history
          database.query("UPDATE users SET payment_id_history = ? WHERE email = ?", [updated_payment_id_history, user_email], (error, result) => {
            if (error) {
              console.log("Error updating payment_id_history:", error);
              res.send(false);
            } else {
              console.log("Payment ID Successfully Matched");
              res.send(true);
            }
          });
        } else {
          console.log("Last payment ID does not match current payment ID. Database has already been updated.");
          res.send(false);
        }
      } else {
        console.log("No user found with the provided email.");
        res.send(false);
      }
    }
  });
});



let stripe_payment_id = '';
/*----------------------------------------------------------------------------------------------------------------------*/
//function that creates a checkout for a user that wants to make a stripe payment
/*----------------------------------------------------------------------------------------------------------------------*/
app.post("/create-stripe-checkout/:email/:amount", async (req, res) => {

    console.log("Stripe Order Request Has been Recieved");
    const name = req.body.user.name;
    const email = req.body.user.email;
    const state = req.body.user.state;
    const address = req.body.user.address;
    const number = req.body.user.number;
    const bagItems = req.body.items;
    const amount = req.params.amount;
    

    
    //format our bag items in the way that stripe can understand it and make an order
    const lineItems = bagItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.shoeName,
        },
        unit_amount: item.shoePrice * 100, // need price of each shoe in cents
      },
      quantity: 1,
    }));

    console.log(bagItems);
    console.log(lineItems);

    try {
      //fill in the order information
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/stripe/success/${email}?amount=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}&state=${encodeURIComponent(state)}&address=${encodeURIComponent(address)}&number=${encodeURIComponent(number)}&bagItems=${encodeURIComponent(JSON.stringify(bagItems))}`,
        cancel_url: `${process.env.CLIENT_URL}/`,
        line_items: lineItems
      })

      //get the id of the current session
      stripe_payment_id = session.id

      

      res.json({ url: session.url });

    } catch (err) {
      console.log(err);
    }
})


app.get("/stripe/success/:email", (req, res) => {
  
  const email = req.params.email;
  const amount = req.query.amount;
  const bagItems = JSON.parse(req.query.bagItems);

  //user information
  const name = req.query.name;
  const state = req.query.state;
  const address = req.query.address;
  const number = req.query.number;

  console.log(email, "has Successfully Made a Payment");
  console.log(stripe_payment_id);

  

  database.query(
    "UPDATE users SET Payment_ID_History = CONCAT(Payment_ID_History, ?) WHERE Email = ?",
    [stripe_payment_id + ",", email],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Payment ID ${stripe_payment_id} has been successfully stored in the database for ${email}`);
      }
    }
  );


  //configure the mail options for the confirmation email that we will be sending to the user
  let purchaseMailOptions = {
    from: 'nodetester12345@gmail.com',
    to: `${email}`,
    subject: 'Purchase Confirmation',
    text: `Payment ID: ${stripe_payment_id} \n Items Bought: \n`
  }

  //configure the mail options for the email we will be sending to LSR Kicks that contains the shipping information
  let shippingMailOptions = {
    from: 'nodetester12345@gmail.com',
    to: '422michaelcerreto@gmail.com',
    subject: 'Order Recieved',
    text: `Name: ${name} \nEmail Address: ${email} \nState: ${state} \nStreet Adddress: ${address} \nPhone Number: ${number} \nItems Bought: \n`
  }

  const shoeNames = [];
  bagItems.forEach((item, index) => {
    
    const formattedText = `Shoe Name: ${item.shoeName}\n`
      + `Shoe/s Total Price: $${item.shoePrice}.00\n`
      + `Shoe Size: ${item.shoeSize}\n`
      + `Shoe Quantity: ${item.shoeQuantity}\n\n`;


      shoeNames.push(formattedText);

      purchaseMailOptions.text += formattedText;
      shippingMailOptions.text += formattedText;
      
  })

  shippingMailOptions.text += `Total Price: $${amount}.00`;

  
  //send the information of all the times bought and the paymentID
  mailTransporter.sendMail(purchaseMailOptions, (error, res) => {
    if(error) {
      console.log(error);
    } else {
      console.log("Confirmation Email Has Successfully Been Sent to the User!!");
    }
  })

  //send the shipping information to LSR Kicks, so they can ship out the products
  mailTransporter.sendMail(shippingMailOptions, (error, res) => {
    if(error) {
      console.log(error);
    } else {
      console.log("LSR Kicks has successfully recieved the order");
    }
  })

  const shoesBought = shoeNames.join(`---------------------------------------------\n`);
  //update the user's information in the database
  console.log(`Updating information in the database for ${email}... `)
  database.query(
    "UPDATE users SET Shoes_Bought = CONCAT(Shoes_Bought,?), Payment_ID_History = CONCAT(Payment_ID_History,?), Price_Spent = Price_Spent + ? WHERE email = ?  ", [shoesBought, stripe_payment_id + ",", amount, email], 
    (error, result) => {
      if (error) {
        console.log(error);
        console.log(`${email} was not found in the database, adding them now...` );
        res.redirect(`${process.env.CLIENT_URL}/failure`);
          //User not found, insert the user into the database
          database.query(
            "INSERT INTO users (Email, Shoes_Bought, Price_Spent, Payment_ID_History) VALUES (?, ?, ?)",
            [email, shoesBought, amount, stripe_payment_id],
            (error, result) => {
              if (error) {
                console.log(error);
                res.redirect(`${process.env.CLIENT_URL}/failure`);
              } else {
                console.log("User " + email + " successfully inserted into the database.");
                res.redirect(`${process.env.CLIENT_URL}/success/${email}/${stripe_payment_id}`);
                
              }


            }
          );
        
      } else {
        console.log(`Shoes bought and price spent has been successfully updated for ${email} `);
        res.redirect(`${process.env.CLIENT_URL}/success/${email}/${stripe_payment_id}`);
      }
    }
  );

  
  

  
})

const port = process.env.PRODUCTION_URL || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
