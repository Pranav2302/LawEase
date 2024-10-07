import dotenv from "dotenv";
import mongoose from "mongoose";
import { Db_name } from "../constants.js";
dotenv.config({
    path:'./env'
})

const connectDb= async ()=>{

    try {
        const mongoDbconnection = await mongoose.connect(
          `${process.env.MONGODB_URI}/${Db_name}?retryWrites=true&w=majority`,
          {
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 15000, // 50 seconds timeout
          }
        );
        console.log(`\n MongoDb connected !! DB host: ${mongoDbconnection.connection.host}`)
    } catch (error) {
        console.log("MongoDb Connection Error",error);
        process.exit(1);
    }
}

export default connectDb;