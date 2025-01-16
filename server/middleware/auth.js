const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

//auth 
exports.auth = async(req,res,next) => {
    try{
        //extract token 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "")

        //if token missing-> return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message: "Token is missing"
            })
        }

        //if token available-> verify it
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
        }
        catch(error) {
            //verification issue
            return res.status(401).json({
                success:false,
                message: "Token is Invalid"
            })
        }

        next()
    }
    catch(error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating a token"
        })
    }

}

exports.isClient = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Client") {
            {
                return res.status(401).json({
                    success:false,
                    message: "Case can be created only by client"
                })
            }
        }
        next()
    }
    catch(error) {
        res.staus(500).json({
            success:false,
            message: "Role can not be verified"
        })
    }
}

exports.isProvider = async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.user.id);
        
        if (userDetails.accountType !== "Provider") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Providers only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};