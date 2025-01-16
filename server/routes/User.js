const express = require("express");
const router = express.Router();

//import controllers
const {login, signup, sendotp} = require("../controller/Auth"); 
const { auth, isProvider } = require("../middleware/auth");
const { setProfile } = require("../controller/Profile");

const { googleAuth } = require("../controller/Auth");


//import middleware



//route for client login
router.post("/login", login)

//route for client signup
router.post("/signup", signup)

// new router here

//route for sending otp to the mail
router.post("/sendotp", sendotp)

//google auth
router.post("/google",googleAuth);

// //route for changing password
// router.post("/changePassword",auth, changePassword)

module.exports = router
