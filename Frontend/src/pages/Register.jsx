import React, { useState, useRef } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("normal_user");
  const [password, setPassword] = useState("");
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
            <div className="relative bg-white/20 max-sm:w-[300px] w-[470px] px-9 py-12 border-2 border-white rounded-xl">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              {/* Profile Image Upload */}
              <div className="mb-6 flex flex-col items-center">
                <label className="font-inter text-base mb-4">Profile Picture</label>
                <div className="mb-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview}
                        alt="Profile Preview" 
                        className="w-28 h-28 object-cover rounded-full border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-2 border-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer px-4 py-2 bg-primary/90 text-white rounded-full hover:bg-primary">
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
                <label htmlFor="Fullname" className="font-inter text-base">
                  Name
                </label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                  type="text"
                  id="Fullname"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-6">
                <label htmlFor="Email" className="font-inter text-base">
                  Email
                </label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                  type="email"
                  id="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-6">
                <label className="font-inter text-base">Role:</label>
                <br />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                >
                  <option value="normal_user">Normal User</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
              <div className="mt-6">
                <label htmlFor="password" className="font-inter text-base">
                  Password
                </label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mt-14 place-self-center text-center">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-primary/90 px-5 py-3 w-64 mb-4 block text-center text-white rounded-3xl hover:bg-primary transition-all duration-200 ease-in-out disabled:opacity-70"
                >
                  {isUploading ? "Registering..." : "Register"}
                </button>

                <span>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-primary whitespace-nowrap hover:underline"
                  >
                    Login
                  </a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;