import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserOauthSchema = new Schema({
    googleId:{
        type:String,
        unique:true,
        required:true
    },
    fullName:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true});

export const UserOauth = mongoose.model("UserOauth",UserOauthSchema)
