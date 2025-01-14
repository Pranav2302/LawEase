const express = require("express");
const router = express.Router();

//import controllers
const {login, signup, sendotp} = require("../controller/Auth"); 
const { auth, isProvider } = require("../middleware/auth");
const { setProfile } = require("../controller/Profile");




//import middleware



//route for client login
router.post("/login", login)

//route for client signup
router.post("/signup", signup)

// new router here

//route for sending otp to the mail
router.post("/sendotp", sendotp)


// //route for changing password
// router.post("/changePassword",auth, changePassword)



<<<<<<< HEAD

module.exports = router
=======
module.exports = router
>>>>>>> 61430c9ad2fb89191964dc24665cbe4f9c43bc2c
