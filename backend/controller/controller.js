const User = require("../models/user");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 14;

const { createJwtToken } = require("../utils/token.util");

const { generateOTP } = require("../utils/otp.util");
const { render } = require("../api/server");

// //// // // create/register new users // // // //

exports.registerUser = async (req, res, next) => {
  // console.log(req.body.phone, req.body.username)
  try {
    let { email, password, phone, username } = req.body;

    // check duplicate phone Number
    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
      return;
    }

    // check duplicate email
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }

    // check duplicate username
    const usernameExist = await User.findOne({ username });

    if (usernameExist) {
      next({ status: 400, message: USERNAME_ALREADY_EXISTS_ERR });
      return;
    }

    const hash = bcrypt.hashSync(password, saltRounds);

    const createUser = new User({
      phone,
      username,
      email,
      password: hash,
      role: phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER",
    });
    // save user
    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(6);
    // hash otp generated
    const hashOTP = bcrypt.hashSync(otp, saltRounds);
    // save otp to user collection
    user.phoneOtp = hashOTP;
    await user.save();

    // send otp to phone number
    console.log(`\n\nYour OTP is ${otp}\n\n`);

    //   ///  // please note i am using twillo
    // await twilioSms(
    //     {
    //         message: `Your OTP is ${otp}`,
    //         contactNumber: user.phone,
    //     },
    //     next
    // );
  } catch (error) {
    next(error);
  }
};

// // // //// // // // get login page
exports.getLogin = async (req, res, next) => {
  // let { session } = req.session;

  // if (session.isLoggedIn) {
  //   res.send("Redirected to home");
  // } else {
    res.render('signin',{
      title: "Home"
  });
    // res.send(" you are not LOGGED IN go and LOGIN");
  // }
};

// // // // // // Login user usinf phone no // // // // // //

exports.gsmLogin = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: PHONE_NOT_FOUND_ERR });
      return;
    }

    // generate otp
    const otp = generateOTP(6);
    // hash otp generated
    const hashOTP = bcrypt.hashSync(otp, saltRounds);
    // save otp to user collection
    user.phoneOtp = hashOTP;
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP sended to your registered phone number",
      data: {
        userId: user._id,
      },
    });

    // send otp to phone number
    console.log(`\n Your OTP is ${otp} ## \n`);

    // // //   please note i am using twillo
    // await twilioSms(
    //     {
    //         message: `Your OTP is ${otp}`,
    //         contactNumber: user.phone,
    //     },

    //     next
    // );
  } catch (error) {
    next(error);
  }
};

//// // // // // Login via emaiil // // // //

exports.emailLogin = async (req, res, next) => {
  // console.log(req.body.phone, req.body.username)
  try {
    let { email, password, username } = req.body;

    // check duplicate email
    await User.findOne({ $or: [{ email }, { username }] }, (err, foundUser) => {
      if (err) {
        next({ status: 400, message: USER_DOES_NOT_EXISTS_ERR });
        return;
      } else {
        if (foundUser) {
          if (bcrypt.compareSync(password, foundUser.password)) {
            req.session.user = {
              name: foundUser.username,
              isLoggedIn: true,
            };

            req.session.save();

            res.status(201).json({
              type: "success",
              message: "YOU CAN LOG IN... PROCEED TO LOGIN",
              data: {
                userId: foundUser._id,
              },
            });
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

//  // // // // // // // login via GMAIL // // //
