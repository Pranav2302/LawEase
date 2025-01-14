const express = require("express");
const router = express.Router();

const { auth, isProvider } = require("../middleware/auth");
const { setProfile } = require("../controller/Profile");


//set profile (provider only)
router.post("/setprofile", auth, isProvider, setProfile)







module.exports = router