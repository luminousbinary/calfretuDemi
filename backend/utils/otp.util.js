require("dotenv").config();

const { ADMIN_PHONE, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID } = require('../config/config');

// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// console.log(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

//  // // // API to SEND MESSAGE GOES HERE
// exports.twilioSms = async ({ message, contactNumber }, next) => {
//   try {
//     const res = await client.messages
//       .create({
//         body: message, //'This is the ship that made the Kessel Run in fourteen parsecs?',
//         from: ADMIN_PHONE,
//         to: contactNumber, //'the number you want to send to must  be registered with twillo'
//       })
//       .then(message => console.log(message.sid));

//     // console.log(res);
//   } catch (error) {
//     next(error);
//   }
// };
