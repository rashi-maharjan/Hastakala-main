import React, { useState, useRef } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("normal_user");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");
    
    try {
      // Validate required fields
      if (!name || !email || !password) {
        setError("Please fill in all required fields");
        setIsUploading(false);
        return;
      }
      
      // First register the user
      const registerResponse = await axios.post("http://localhost:3001/api/auth/register", { 
        name, 
        email, 
        password, 
        role 
      });
      
      // If profile image exists, upload it after successful registration
      if (profileImage && registerResponse.status === 201) {
        try {
          // Log in to get the token
          const loginResponse = await axios.post("http://localhost:3001/api/auth/login", {
            email,
            password
          });
          
          const token = loginResponse.data.token;
          const userId = loginResponse.data.user.id;
          
          // Create form data for image upload
          const formData = new FormData();
          formData.append('profileImage', profileImage);
          
          // Upload the profile image
          await axios.post(
            `http://localhost:3001/api/users/upload-profile-image`,
            formData,
            {
              headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } catch (imageError) {
          console.error("Image upload failed, but user was registered:", imageError);
          // User is still registered, just without the profile image
        }
      }
      
      // Registration successful, navigate to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section
      className="backdrop-blur-3xl h-screen overflow-hidden flex justify-center py-20 relative before:absolute before:left-[50%] before:top-[20%] 2xl:before:top-[30%]
     before:bg-primary/80 before:rounded-full before:w-[15%] before:h-[15%] 2xl:before:w-[15%] 2xl:before:h-[15%] before:-z-[1] before:blur-[105px] after:absolute after:right-[50%] after:top-[70%] 2xl:after:top-[60%] after:bg-red-600 after:rounded-full after:w-[15%] after:h-[15%] 2xl:after:w-[15%] 2xl:after:h-[15%] after:-z-[1] after:blur-[105px]"
    >
      <div className="container flex justify-center items-center z-[10] relative before:absolute before:right-[55%] before:top-[30%] 2xl:before:top-[35%] before:bg-green-500 before:rounded-full before:w-[15%] before:h-[15%] 2xl:before:w-[15%] 2xl:before:h-[15%] before:-z-[1] before:blur-[105px]">
        <div className="place-self-center">
          <img
            src={logo}
            alt="Hastakala Logo"
            width={158}
            height={38}
            loading="lazy"
            className="place-self-center mb-12 -z-[2]"
          />
          <form onSubmit={handleRegister}>
            <div className="relative bg-white/20 max-sm:w-[250px] w-[350px] px-5 py-8 border-2 border-white rounded-lg">
              {error && <p className="text-red-500 mb-2 text-xs">{error}</p>}
              
              {/* Profile Image Upload */}
              <div className="mb-4 flex flex-col items-center">
                <label className="font-inter text-sm mb-2">Profile Picture</label>
                <div className="mb-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview}
                        alt="Profile Preview" 
                        className="w-20 h-20 object-cover rounded-full border border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border border-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer px-3 py-1 bg-primary/90 text-xs text-white rounded-full hover:bg-primary">
                  <span>Choose Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                  />
                </label>
              </div>
              
              <div>
                <label htmlFor="Fullname" className="font-inter text-sm">Name</label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-1.5 px-4 mt-2 outline-none text-sm"
                  type="text"
                  id="Fullname"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Email" className="font-inter text-sm">Email</label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-1.5 px-4 mt-2 outline-none text-sm"
                  type="email"
                  id="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Role" className="font-inter text-sm">Role:</label>
                <select
                  className="w-full border border-black rounded-3xl py-1.5 px-4 mt-2 outline-none text-sm"
                  id="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="normal_user">Normal User</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="Password" className="font-inter text-sm">Password</label>
                <div className="relative">
                  <input
                    className="w-full border border-black rounded-3xl py-1.5 px-4 mt-2 outline-none text-sm pr-10"
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white rounded-3xl py-2 text-sm font-semibold hover:bg-primary/80 transition-colors duration-200"
                disabled={isUploading}
              >
                {isUploading ? "Registering..." : "Register"}
              </button>
              <div className="mt-2 text-center text-xs">
                Already have an account? <span className="text-primary cursor-pointer" onClick={() => navigate('/login')}>Login</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;