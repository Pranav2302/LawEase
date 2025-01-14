const User = require("../models/User");
const Profile = require("../models/Profile");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const { default: axios } = require("axios");
require("dotenv").config();
const FormData = require("form-data");


//profile set of advocate
exports.setProfile = async(req,res) => {
    try {
      //get user id
      const userId = req.user.id
  
      //profile pic
      const profilePic = req.files.image;
      if(!profilePic){
        return res.status(400).json({
          success:false,
          message:"Profile picture is required"
        })
      }
      //get details from req.body
      const {
        gender, 
        about, 
        contactNumber,
        experience,
        age,
        district,
        taluka,
        state,
        university,
        category,
        enrollmentNumber
      } = req.body
  
      //validate required fields
      if(
        !profilePic||
        !gender ||
        !enrollmentNumber ||
        !about ||
        !contactNumber ||
        !experience ||
        !age ||
        !district ||
        !taluka ||
        !university ||
        !category) {
          return res.status(400).json({
            success: false,
            message: "All fields are required",
          });
        }

        console.log("validated")
    console.log("district", district.toUpperCase());
      
      //capitalize words
      const capDistrict = district.toUpperCase()
      const capTaluka = taluka.toUpperCase()
      const BAR_COUNCIL_API = process.env.BAR_COUNCIL_API
      const barName = `${capTaluka} TALUKA   BAR ASSOCIATION,   ${capDistrict}`
        
      //fetch data from bar council
      try {
        //make form data
        const formData = new FormData();
        formData.append("barname", barName);
        
        //make api call
        const response = await axios.post(
            BAR_COUNCIL_API, 
            formData,
            {
                headers: {
                ...formData.getHeaders(),  
                }
            }
          );

        //find if user is enrolled
        const advocateList = response.data || [];
        const isEnrolled = advocateList.some(advocate => advocate.enrollmentNo == enrollmentNumber);

        if(!isEnrolled) {
            return res.status(400).json({
                success: false,
                message: "Enrollment number not found in Bar Council records",
            })
        }
      }
      catch(error) {
        return res.status(500).json({
          success: false,
          message: "Error while verifying enrollment number with Bar Council",
        })
      }
  
  
      //upload to cloudinary
      const response = await uploadToCloudinary(profilePic, process.env.FOLDER_NAME, 500)
  
      //change profile pic
      await User.findByIdAndUpdate(userId, {
        image: response.secure_url,
      })
  
      //get profile of that user
      const user = await User.findById(userId).populate("additionalDetails")
      const userProfileId = user.additionalDetails._id;
  
      console.log("userProfileId" , userProfileId);
  
      //update profile
      const updatedProfile = await Profile.findByIdAndUpdate(
        userProfileId,
        {
          gender, 
          about, 
          contactNumber,
          experience,
          age,
          district,
          taluka,
          state,
          university,
          category,
          enrollmentNumber
        },
        {
          new: true,
        }
      );
  
      //return response
      return res.status(200).json({
        success: true,
        message: "Profile set successfully",
        data: updatedProfile,
      })
    }
    catch(error) {
      console.error("Profile Setting Error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while setting profile",
        error: error.message  //  to see specific error
      });
    }
}
  

  