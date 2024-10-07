

import express from "express"
import path from "path"
import passport from "passport"
import session from "express-session";
import  {configurePassport}  from "./src/controllers/user_oauth_controller.js";
import { fileURLToPath } from "url";
const app = express();
import {db} from "./src/index.js"

db();
configurePassport();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, "Frontend")));


app.use(
  session({
    secret: "mysecret", // Update this as needed
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.session) {
    return next();
  }
  res.redirect("/");
}
// Route handlers
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend"));
});

app.get(
  "/Oauth/google",
  (req, res, next) => {
    console.log("Google OAuth route hit");
    next();
  },
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })  
);


// app.get(
//   "/Oauth/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//     prompt: "select_account",
//   })
// );

// Google OAuth callback route
app.get('/Oauth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect('http://localhost:5173/Oauth');
  }
);

app.get("/Oauth/failure",(req, res) => {
  res.send("Something went wrong during the login process.");
});


// Protected route (accessible only after Google login)
app.get("/Oauth", isLoggedIn, (req, res) => {
  const { fullName, googleId, avatar,email } = req.user;
  const photoUrl =
    avatar && avatar.length > 0 ? avatar[0].value : "No photo available";
  res.send(`Hello ${googleId}, ${fullName}, ${avatar}, ${email}`);
});

app.use("/Oauth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.send("See you again!");
    });
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
