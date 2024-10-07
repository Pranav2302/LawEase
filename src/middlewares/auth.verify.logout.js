import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiErrors.js"
import dotenv from "dotenv"
dotenv.config()
import { User } from "../models/user.js";
import jwt from "jsonwebtoken"
export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
     //this cookies we have already taken -- check app.js file 
    const token=req.cookies?.Accesstoken || req.header("Authorization")?.replace("Bearer ","")
     //we are checking cookies are present or not if user is from mobile then we have to take from header by Authorization Bearer
     
     if (!token){
         throw new ApiErrors(401,"Unauthorized request")
     }
 
     //decode by jwt
     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     
     const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
     if(!user){
         //discuess about frontend here 
         throw new ApiErrors (401,"Invalid Access token")
     }
 
     req.user=user;
     next()
   } catch (error) {
    throw new ApiErrors(401,"Invalid access token")
   }
})