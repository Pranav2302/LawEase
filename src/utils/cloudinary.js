import {v2 as cloudinary} from "cloudinary"
import fs from "fs"  //for handling all file system ,open,close ,unlink etc
import dotenv from "dotenv"
dotenv.config({
    path:'../env'
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload_cloudinary= async (localfilepath) => {
    try {
        if(!localfilepath) return null;
        //upload file to cloudinary 
       const reponse = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})  //file uploaded
        console.log("File uploaded at cloudinary",reponse.url);
        fs.unlinkSync(localfilepath);
        return reponse;
    } catch (error) {
        fs.unlinkSync(localfilepath)  //removed file from local server due to not successsful upload so
        return null;
    }
}

export {upload_cloudinary}
