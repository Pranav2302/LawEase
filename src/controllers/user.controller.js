import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import {User} from "../models/user.js" 
import { upload_cloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessandRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const Accesstoken = user.accessTokenGenerator()
        const refreshtoken = user.refreshTokenGenerator()
        //tokens generated and now, store the refresh token in DB and then pass both the tokens to browser cookies

        user.refreshtoken=refreshtoken
       await user.save({validateBeforeSave:false})  //while saving to DB we dont want to check password,we dont want password field which is in user model schema to be checked
    
       //now to want to return both 
       return ({Accesstoken,refreshtoken})

    } catch (error) {
        throw new ApiErrors (500, "something went wrong while generating access and refresh token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    //step to register the user
    //get details from frontend 
    //validation - not empty
    //check if user already exists: user , email 
    //check avatar and images as in it compulsory
    //take to the local server
    //upload to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token filed from response
    //check for user creation
    //return res

    //step1
    console.log('Starting of the register user');
    const {fullName,email,username,password}=req.body
    console.log("email:",email)

    //step2
    if(
        //here we are check togther all field are empty or not (if empty then throw error)
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiErrors(400,"All fields are Required")
    }

    //step3
   const existeduser= await User.findOne({
        $or:[{email}]   //[{email},{username}]
     })
    if(existeduser){
        throw new ApiErrors(409,"user with email or username already exist")
    }

    //step 4
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar file is required")
   }

   //step 5
   const avatar =await upload_cloudinary(avatarLocalPath)
   const coverImage=await upload_cloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiErrors(400,"Avatar file is required")
   }

   //step6
   console.log('Validation of all fields done - proceed to register user');
  const user= await User.create({
    fullName,
    avatar:avatar.url,
    //we have to check cover image exist or not because we have not check before
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })

   console.log(user);
   const createduser = await User.findById(user._id).select(
     //not want in response
     "-password -refreshToken"
   );

   if(!createduser){
    throw new ApiErrors(500,"some thing wrong while registering user")
   }

   return res.status(201).json(
    new ApiResponse(200,createduser,"User registered Successfully!!")
   )
})

const loginUser = asyncHandler(async(req,res)=>{
    //steps for login
    //take input from frontend
    //check if field are empty
    //find user 
    //validate the details , password  
    //access and refresh token 
    //send cookies
    
    //step 1 to take inputs from user
    const { username, password, email } = req.body;

    if(!(username || email)){
        throw new ApiErrors(400, "Email or password is required");
    }

    // if([email,password].some((field)=>field?.trim() ==="")){
    //     throw new ApiErrors (400,"Email or password is required")
    // }

    //step3 find user
    const user=await User.findOne({
        $or:[{email},{username}]  //or :[{email},{username}]
    })

    if(!user){
        throw new ApiErrors (404,"user is not registered , register first")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiErrors (401,"Invalid user Credentials")
    }
    
    //method for access and refresh tokens
    const {AccessToken,refreshToken}=await generateAccessandRefreshToken(user._id)

    //till now we have find user and generate both tokens and want to return but we can return all usermodel , we have to skip password , we have to make DB query
   const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")

   //send cookies
   //httpOnly and secure we cannot modify cookies in browser it can motify only in server
   const options={
    httpOnly:true,
    secure:true
   }

   //cookies structure - name , string ,options 
   return res
     .status(200)
     .cookie("AccessToken", AccessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
        //this is structure from Api response
       new ApiResponse(200, 
        { 
            user: loggedInUser, AccessToken, refreshToken 
        },
        "user loggedIn successfully"
        )
     );
})

const logoutUser = asyncHandler (async(req,res)=>{
//now we have req.user because we have add middleware before logout in route
   await User.findByIdAndUpdate(
        req.user._id,
        { $set:{refreshToken:undefined}  },
        {  new:true } //to update new i.e undefined refreshToken
        
    )
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("AccessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200,{},"User logged Out Successfully"))
}) 
export { registerUser, loginUser, logoutUser };