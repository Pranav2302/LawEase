const express = require("express")
const router = express.Router()


const {
    createCase, acceptCase,updateCaseStatus,getAllCases
} = require("../controller/Case")
const { isClient, auth, isProvider } = require("../middleware/auth")


//case can be created by client only
router.post("/createCase", auth,isClient, createCase)

//case can be accepted by provider only
router.post("/acceptCase", auth, isProvider, acceptCase)

//get all cases by provider
router.post("/acceptCase", auth, isProvider, acceptCase);

//update case status
router.post("/updateStatus", auth, isProvider, updateCaseStatus);
module.exports = router