import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import {verifyJWT} from "../middlewares/auth.verify.logout.js"
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),registerUser);

router.route("/login").post(loginUser);

//secured routes , here we are checking middleware first and then logout and in middleware we have written next().  
router.route("/logout").post(verifyJWT,logoutUser);
//first redirect to verifyJwt in it next() is use to tell route to redirect to logoutUser(2step)  
export default router  