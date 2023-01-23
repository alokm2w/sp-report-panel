const nodemailer = require('nodemailer');
require('dotenv').config();

async function send_mail() {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('Server is ready to take our messages');
            resolve(success);
          }
        });
      });


    const mailData = {
        from: {
          name: 'Service Point',
          address: process.env.EMAIL_USER,
        },
        to: process.env.RECEIVER_EMAIL_ADDRESS,
        subject: `Zip File Exported`,
        html: 'Zip file is exported successfully!',
      };

      await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailData, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
            // res.status(504).end(JSON.stringify({ message: 'Successfully Registered' }));
          } else {
            console.log("Email sent!", info.response);
            resolve(info);
            // res.status(200).end(JSON.stringify({ message: 'Successfully Registered' }));
          }
        });
      });

}

module.exports = { send_mail }