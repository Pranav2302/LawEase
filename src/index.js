import dotenv from "dotenv"
import connectDb from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
})

export const db =()=>{
const port=process.env.port || 4000;
connectDb()
.then(()=>{
    app.on("Error",()=>{
        console.log("Error",error)
        throw error;
    })
    app.listen(port,()=>{
        console.log(`Server is Running at: ${port}`)
    })
})
.catch((error)=>{
    console.log("Mongo Db connection Failed",error);
})


}















// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.Mongodb_url}/${Db_name}`);
//        app.on("Error",(error)=>{
//         console.log("Error",error)
//         throw error
//        })

//        app.listen(process.env.port,()=>{
//         console.log(`App is listing as port${process.env.port}`);
//        })
//     } catch (error) {
//         console.error("Error",error);
//         throw error 
//     }
// })()
