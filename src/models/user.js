import mongoose,{Schema} from "mongoose"; 
import jwt from "jsonwebtoken";  //key 
import bcrypt from "bcrypt";   //to hash the password 
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //if we do index true then it will be in searching in database(allowing searching field)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
      required: false,
    },
    googleId: {
      type: String, // Used for OAuth users, can be null for JWT users
      unique: true,
      sparse: true, // Allow null values for users who don't log in via Google
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String, //add here increption
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save",async function (next){
    if(this.isModified("password")){
    try {
       this.password = await bcrypt.hash(this.password, 10); //10 is number of rounds
        next(); 
    } catch (err) {
        next(err)
    }
}else{
    next();
}
})

UserSchema.methods.isPasswordCorrect= async function (password){
   return await bcrypt.compare(password,this.password)
}

UserSchema.methods.accessTokenGenerator = function () {
    jwt.sign(
      {
         _id: this._id,
        email: this.email,
        fullName: this.fullName,
         username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
}

UserSchema.methods.refreshTokenGenerator = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User=mongoose.model("User",UserSchema)



