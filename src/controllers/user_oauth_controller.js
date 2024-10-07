import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { UserOauth } from "../models/user_oauth.js"; // Use OAuth-specific model

dotenv.config({
  path: "./.env",
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.googleClientId,
        clientSecret: process.env.googleClientSecret,
        //callbackURL: "http://localhost:5000/Oauth/google/callback",
        callbackURL: "http://localhost:5000/Oauth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // const newUser = {
          //   googleId: profile.id,
          //   fullName: profile.displayName,
          //   email: profile.email,
          //   avatar: uploadResult.secure_url,
          // };
          // Check if the user already exists in the OAuth-specific collection
          let user = await UserOauth.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            // Upload Google profile photo to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(
              profile.photos[0].value,
              {
                folder: "user_avatars", // Optional: Save to a specific folder in Cloudinary
              }
            );

            // Create a new OAuth user with the Cloudinary profile photo URL
            user = await UserOauth.create({
              googleId: profile.id,
              fullName: profile.displayName,
              email: profile.email,
              avatar: uploadResult.secure_url, // Use Cloudinary URL instead of Google URL
            });

            done(null, user);
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserOauth.findById(id); // Use OAuth-specific model for deserialization
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
