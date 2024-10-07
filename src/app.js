import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
dotenv.config({
    path:'./.env'
})
const app=express();

app.use(cors({
    origin:process.env.Cors_origin,
    credentials:true
}))
app.use(express.json({limit:"115kb"}))    //this is for taking json input and puttin limits  
app.use(express.urlencoded({limit:"115kb",extended:true}))   // for url search 
app.use(express.static("public"))  //public is the folder name.which to access the files,folder,falvicon to all 
app.use(cookieparser())

//route import 
import userRouter from "./routes/user.routes.js"

//router declaration 
app.use("/users",userRouter)

export {app}