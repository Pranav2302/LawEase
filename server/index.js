const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const database = require("./config/database");
const dotenv = require("dotenv");
dotenv.config();
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// db connection
database.connect();

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


// //cloudinary connection
cloudinaryConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//import routes
const userRoutes = require("./routes/User")
const caseRoutes = require("./routes/Case")
const profileRoutes = require("./routes/Profile")

//routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/case", caseRoutes)
app.use("/api/v1/profile",profileRoutes)


//default route
app.get("/", (req,res) => {
    res.send("<h1>This is Homepage</h1>")
})

app.get("/contact", (req,res) => {
    res.send("<h1>This is contact page</h1>")
})


//activate server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})