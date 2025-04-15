import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
          });
        } else {
          // Redirect to login if not authenticated
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError("");
    }
  };

  // Function to upload profile image
  const uploadProfileImage = async () => {
    if (!newProfileImage) return null;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      return null;
    }

    const formData = new FormData();
    formData.append("profileImage", newProfileImage);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/upload-profile-image",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.user;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setError(error.response?.data?.error || "Failed to upload profile image");
      return null;
    }
  };

  // Function to delete profile image
  const handleDeleteImage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:3001/api/users/delete-profile-image",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Update local user state and localStorage
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setPreviewImage(null);
      setNewProfileImage(null);
      setSuccessMessage("Profile image deleted successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting profile image:", error);
      setError(error.response?.data?.error || "Failed to delete profile image");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      return;
    }

    // First, handle profile image upload if there's a new image
    let updatedUser = null;
    if (newProfileImage) {
      updatedUser = await uploadProfileImage();
      if (!updatedUser) {
        return; // Stop if image upload failed
      }
    }

    // Then update user profile information
    try {
      // Only proceed with profile update if the form data has changed
      if (formData.name !== user.name || formData.email !== user.email) {
        const response = await axios.put(
          `http://localhost:3001/api/auth/update-profile`,
          {
            name: formData.name,
            email: formData.email,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        updatedUser = response.data.user;
      }

      // If we have updatedUser from either image upload or profile update
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.error || "Failed to update profile information"
      );
    }
  };

  // Function to get profile image URL
  const getProfileImageUrl = () => {
    if (previewImage) {
      return previewImage;
    }

    if (user && user.profileImage) {
      // If the image path is relative (from our server)
      if (user.profileImage.startsWith('/')) {
        return `http://localhost:3001${user.profileImage}`;
      }
      // If it's already a full URL
      return user.profileImage;
    }

    // Default avatar
    return "/assets/images/default-avatar.png";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Function to handle going back to previous page
  const handleGoBack = () => {
    navigate("/feed"); // Go back to the previous page in history
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="mb-4 flex items-center text-primary hover:text-primary-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Go Back
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p>Manage your personal information and account preferences</p>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Profile Image Section */}
            <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
              <div className="relative">
                <img
                  src={getProfileImageUrl()}
                  alt="Profile"
                  className="h-40 w-40 rounded-full object-cover border-4 border-gray-100 shadow-md"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="bg-black bg-opacity-50 text-white rounded-full p-2 cursor-pointer hover:bg-opacity-70 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-4 text-center">
                  <label className="block mb-2 text-sm font-medium text-primary cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    Change Profile Picture
                  </label>
                  {user?.profileImage && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Picture
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Information Form */}
            <div className="flex-1">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                        isEditing
                          ? "bg-white focus:outline-none focus:ring-primary focus:border-primary"
                          : "bg-gray-100"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                        isEditing
                          ? "bg-white focus:outline-none focus:ring-primary focus:border-primary"
                          : "bg-gray-100"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Type
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={user?.role?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "User"}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                    {user?.role === "normal_user" && (
                      <p className="mt-1 text-sm text-gray-500">
                        Want to sell your artwork?{" "}
                        <a href="/artist-application" className="text-primary hover:text-primary-dark">
                          Apply to become an artist
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name || "",
                              email: user.email || "",
                            });
                            setNewProfileImage(null);
                            setPreviewImage(null);
                            setError("");
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Additional Sections */}
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <button
                onClick={() => navigate("/change-password")}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* For Artists - Portfolio Section */}
        {user?.role === "artist" && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Artist Portfolio</h2>
            <p className="text-gray-600 mb-4">
              Manage your artist profile and portfolio settings
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <button
                  onClick={() => navigate("/manage-artwork")}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Manage Artwork
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;