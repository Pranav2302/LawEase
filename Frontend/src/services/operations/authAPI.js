import { setLoading, setToken, } from "@/slices/authSlice";
import { setUser } from "@/slices/profileSlice";
import { toast } from 'sonner'
import { endpoints } from "../apis"
import { apiConnector } from "../apiConnector";

const { SENDOTP_API, SIGNUP_API, LOGIN_API } = endpoints;



export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
      console.log("Error from otp sendinggg: ", error);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading..."); // Show loading toast
      dispatch(setLoading(true));
  
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        });
  
        console.log("LOGIN API RESPONSE............", response);
  
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
  
        // Dismiss loading toast and show success
        toast.dismiss(toastId);
        toast.success("Login Successful");
  
        dispatch(setToken(response.data.token));
  
        const userImage = response.data?.user?.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
  
        dispatch(setUser({ ...response.data.user, image: userImage }));
  
        // Store token and user in local storage
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        // Navigate to the user's profile
        navigate("/dashboard");
      } catch (error) {
        console.log(LOGIN_API);
        console.log("LOGIN API ERROR............", error);
  
        // Dismiss loading toast and show error
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Login failed!"); // Handle undefined error messages
      } finally {
        dispatch(setLoading(false)); // Ensure loading state is set to false
      }
    };
}

