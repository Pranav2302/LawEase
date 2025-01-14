import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast"
import {useNavigate} from 'react-router-dom'
import {toast} from 'sonner'

const LawyerProfileForm = () => {
 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: '',
    about: '',
    contactNumber: '',
    experience: '',
    age: '',
    district: '',
    taluka: '',
    state: '',
    university: '',
    category: '',
    enrollmentNumber: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  // Static categories
  const categories = [
    "Tax Lawyer",
    "Criminal Lawyer",
    "Family Lawyer",
    "Real Estate Lawyer",
    "Business Lawyer",
    "Labor & Employment Lawyer",
    "Intellectual Property Lawyer",
    "Human Rights Lawyer",
    "Personal Injury Lawyer",
    "Consumer Protection Lawyer"
  ];

  // Fetch existing profile data
  useEffect(() => {
   setIsLoading(false);
  }, []);
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      console.log('Token being used:', token); // Debug log
  
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      // Validate all fields
      const requiredFields = Object.entries(formData);
      for (const [key, value] of requiredFields) {
        if (!value) {
          throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        }
      }
  
      if (!profilePic) {
        throw new Error('Profile picture is required');
      }
  
      // Create FormData instance
      const formDataToSend = new FormData();
      formDataToSend.append('image', profilePic);
      
      // Append all other form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
  
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/setProfile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }
  
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
  
    } catch (err) {
      console.error('Profile submit error:', err);
      
      if (err.message.includes('token')) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      setProfilePic(file);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     // Validate all fields
  //     const requiredFields = Object.entries(formData);
  //     for (const [key, value] of requiredFields) {
  //       if (!value) {
  //         throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
  //       }
  //     }

  //     if (!profilePic) {
  //       throw new Error('Profile picture is required');
  //     }

  //     // Create FormData instance
  //     const formDataToSend = new FormData();
      
  //     // Append the image with the key 'image'
  //     formDataToSend.append('image', profilePic);
      
  //     // Append all other form fields
  //     Object.keys(formData).forEach(key => {
  //       formDataToSend.append(key, formData[key]);
  //     });

  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('Authentication token not found');
  //     }

  //     const response = await fetch('/api/profile/set-profile', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: formDataToSend,
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to update profile');
  //     }

  //     toast({
  //       title: "Success",
  //       description: "Profile updated successfully!",
  //     });

  //   } catch (err) {
  //     toast({
  //       title: "Error",
  //       description: err.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div>Loading profile data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Lawyer Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rest of the form JSX remains the same */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select 
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>About</Label>
            <Textarea 
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input 
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input 
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Enrollment Number</Label>
              <Input 
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>District</Label>
              <Input 
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Taluka</Label>
              <Input 
                name="taluka"
                value={formData.taluka}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>University</Label>
            <Input 
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LawyerProfileForm;