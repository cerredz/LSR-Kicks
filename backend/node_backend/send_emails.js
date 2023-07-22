/*--------------------------------------------------
FILE TO SEND AN EMAIL TO THE EMAIL LIST
--------------------------------------------------*/

require('dotenv').config();

//import modules
const sql = require("mysql");
const nodemailer = require("nodemailer");

const email_users = () => {

    /*---------------------------------------------------*/
    //step 1: connect to both the sql and nodemailer packages
    /*---------------------------------------------------*/

    //create the connection for the sql database
    const database = sql.createConnection({
        user: `${process.env.SQL_USER}`,
        host: 'localhost',
        password: `${process.env.SQL_PASSWORD}`,
        database: 'lsr_kicks'
    })

    //connect to the sql database
    database.connect((error) => {

        if(error) {
            console.log(error);

        } else {
            console.log("Successfully connected to the the LSR_Kicks database");
        }
    })

    // create reusable transporter object using the default SMTP transport
    let mail_transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.NODEMAILER_USERNAME}`,
        pass: `${process.env.NODEMAILER_PASSWORD}`
        }
    });


    /*---------------------------------------------------*/
    //step 2: extract all of the emails in the email list into an array
    /*---------------------------------------------------*/
    database.query("SELECT email FROM emails", (error, result) => {

        if(error) {
            console.log("Failed to extract the emails from the email list:", error)
            return;
        }
        
        let emails = [];
        //transfer all of the emails in the sql database to an array
        for (let i = 0; i < result.length; i++) {
            if (result[i] && result[i].email) {
                emails.push(result[i].email);
            }
        }

        console.log("Current Email List:", emails);
        /*---------------------------------------------------*/
        //step 3: email all of the users in the email list
        /*---------------------------------------------------*/
        for(var i = 0; i < emails.length; i++) {

            const email = emails[i];

            /*
                example syntax of mailOptions:
                let mailOptions = {
                from: `${process.env.NODEMAILER_USERNAME}`,
                to: emails[i],
                subject: `New Shoe Drop` ,
                text: `Our new Jordan 4 drop just launched. Make sure to go to www.lsrkicks.com to purchase it therre `
            }
            */

            let mail_options = {
                from: `${process.env.NODEMAILER_USERNAME}`,
                to: emails[i],
                subject: insert subject here ,
                text: insert text here
            }

            mail_transporter.sendMail(mail_options, (error, res) => {
                if(error) {
                    console.log(`Failed to send email to `, emails[i], error );
                    return;
                }

                console.log(`Successfully sent an email to ${email}`);

            })
        }
    })
}

email_users()









