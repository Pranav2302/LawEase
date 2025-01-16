const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const mailSender = require("../utils/mailSender");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
require("dotenv").config();
const client = require("../config/googleAuth");

exports.googleAuth = async (req, res) => {
  try {
    const { credential, accountType } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });
    
    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token"
      });
    }

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        image: picture,
        accountType,
        password: email + process.env.JWT_SECRET, // Generate a random password
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User logged in successfully",
    });

  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.message
    });
  }
};
//otp send before signup
exports.sendotp = async (req, res) => {
  console.log(req);
  try {
    //fetch email from reqBody
    const { email } = req.body;

    //checl if user already exist
    const checkUserPresent = await User.findOne({ email });

    //if user exist already
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generateOTP (requires otp-generator)
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    //make sure OTP must be unique
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //make entry in database
    const otpPayload = { email, otp };
    const otpbody = await OTP.create(otpPayload);
    console.log(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signup = async (req, res) => {
  console.log(req.body);
  try {
    //data fetch from reqBody
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    if(accountType !== "Client" && accountType !== "Provider"){
      return res.state(400).json({
        success :false,
        message:"Invalid account type. Must be either Client or Provider"
      });
    }
    //2 password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords does not match",
      });
    }

    //user exist already ?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // Find most recent OTP first
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("Recent OTP:", recentOtp); //for temp
    console.log("Submitted OTP:", otp); //temp

    // Validate OTP
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } 
    
    if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //create entry in db of user
    const profileDetails = await Profile.create({
      gender: null,
      contactNumber: null,
      about: null,
      age: null,
      district:null,
      taluka:null,
      state: null,
      university: null,
      category: null,
      
    });
    console.log(profileDetails);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    console.log("user: ", user);


    // Generate JWT token after successful signup
    const token = jwt.sign(
      { email: user.email, id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    // Send response with token
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
      token, // Make sure to include the token
    });
  } catch (error) {
    console.log("Signup error:",error);
    return res.status(500).json({
      success: false,
      message: "User can not be registered",
      error:error.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch data from reqBody
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //user exist already ?
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, Sign up first",
      });
    }

    //if user exist already -> password verification
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2hr",
      });

      //toObject
      user.token = token;
      user.password = undefined;

      console.log("Printing user: ", user);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 days
        httpOnly: true,
      };

      //create cookie
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "LoggedIn successfully ",
      });
    } 
    else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};


