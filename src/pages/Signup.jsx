import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Signup() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('user')
  const [otpSent, setOtpSent] = useState(false);
  
  // Split the form data into two steps
  const [emailData, setEmailData] = useState({
    email: ''
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Handle email input for OTP step
  const handleEmailChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.id]: e.target.value
    });
  };

  // Handle other inputs for signup step
  const handleSignupDataChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.id]: e.target.value
    });
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailData.email }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  // Step 2: Complete Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailData.email,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
          otp: signupData.otp,
          accountType: accountType === 'user' ? 'Client' : 'Provider'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Signup successful!');
        if (accountType === 'Provider') {
          // Make sure the token is being received from the backend
          if (data.token) {
            // Store the token without JSON.stringify
            localStorage.setItem('token', data.token);
            console.log('Token saved:', data.token); // Debug log
            navigate('/form');
          } else {
            throw new Error('No token received from server');
          }
        } else {
          navigate('/login');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 mt-14">
      {/* Left side remains the same */}
      
      {/* Right side - Signup form */}
      <div className="w-2/3 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Join LawEase today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Account Type Selection */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-primary transition-colors ${
                    accountType === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setAccountType('user')}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:ring-primary transition-colors ${
                    accountType === 'Provider' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setAccountType('Provider')}
                >
                  Provider
                </button>
              </div>
            </div>

            {/* Step 1: Email and OTP */}
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={emailData.email}
                    onChange={handleEmailChange}
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
                <Button className="w-full" type="submit">
                  Send OTP
                </Button>
              </form>
            ) : (
              /* Step 2: Complete Signup Form */
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={signupData.firstName}
                      onChange={handleSignupDataChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={signupData.lastName}
                      onChange={handleSignupDataChange}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={signupData.password}
                    onChange={handleSignupDataChange}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupDataChange}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input 
                    id="otp" 
                    value={signupData.otp}
                    onChange={handleSignupDataChange}
                    placeholder="Enter OTP" 
                    required 
                  />
                </div>

                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}