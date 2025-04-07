import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header"

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentPostId, setCommentPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editCommentText, setEditCommentText] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userProfiles, setUserProfiles] = useState({}); // Store user profile data for all users

  // Modal popup state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "info", // info, success, error, warning
    onConfirm: null,
    confirmText: "OK",
    showCancel: false
  });

  // Function to show popup
  const showPopup = (message, type = "info", onConfirm = null, confirmText = "OK", showCancel = false) => {
    setPopup({
      show: true,
      message,
      type,
      onConfirm,
      confirmText,
      showCancel
    });
  };

  // Function to hide popup
  const hidePopup = () => {
    setPopup({
      ...popup,
      show: false
    });
  };

  // Function to handle confirmation with popup
  const confirmAction = (message, onConfirm) => {
    showPopup(message, "warning", onConfirm, "Yes, I'm sure", true);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user is not authenticated");
          setIsAuthenticated(false);
          setIsLoading(false);
          fetchPosts(); // Still fetch posts even if not authenticated
          return;
        }

        console.log("Token found, checking if user data exists");

        // First try to get user data from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log("User data found in localStorage:", userData);
            setUser(userData);

            // Save the current user's profile in the userProfiles object
            if (userData.profileImage) {
              setUserProfiles((prev) => ({
                ...prev,
                [userData.id || userData._id]: userData.profileImage,
              }));
            }

            setIsAuthenticated(true);
            setIsLoading(false);
            fetchPosts(); // Fetch posts after user data is loaded
            return;
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            // Continue to fetch from server
          }
        }

        // If we don't have user data in localStorage, fetch it from the server
        console.log("Fetching user profile from server...");
        const response = await axios.get(
          "http://localhost:3001/api/auth/profile",
          {
            headers: { Authorization: token },
          }
        );

        if (response.data && response.data.user) {
          console.log("User profile fetched from server:", response.data.user);
          const userData = response.data.user;
          setUser(userData);

          // Save the current user's profile in the userProfiles object
          if (userData.profileImage) {
            setUserProfiles((prev) => ({
              ...prev,
              [userData.id || userData._id]: userData.profileImage,
            }));
          }

          setIsAuthenticated(true);

          // Save to localStorage for future use
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.log("No user data returned from server");
        }
      } catch (error) {
        console.error("Error getting user profile:", error);
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
        fetchPosts(); // Ensure posts are fetched
      }
    };

    fetchUserProfile();
  }, []);

  // Modify fetchPosts to also fetch user profile images
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      if (Array.isArray(response.data)) {
        setPosts(response.data);
        
        // Extract unique user IDs from posts and comments
        const userIds = [...new Set(response.data.flatMap(post => {
          const postUserIds = [post.user_id];
          const commentUserIds = post.comments 
            ? post.comments.map(comment => comment.user_id) 
            : [];
          return [...postUserIds, ...commentUserIds];
        }))];
        
        console.log('Extracted unique user IDs:', userIds);
        
        // Remove any null, undefined, or invalid IDs
        const validUserIds = userIds.filter(id => 
          id && typeof id === 'string' && id.trim() !== ''
        );
        
        console.log('Validated user IDs:', validUserIds);
        
        if (validUserIds.length > 0) {
          await fetchUserProfileImages(validUserIds);
        }
      } else {
        console.error('Expected an array, but received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // New function to fetch profile images for multiple users
  const fetchUserProfileImages = async (userIds) => {
    try {
        if (!userIds || userIds.length === 0) return {};

        // Log the raw userIds for debugging
        console.log('Raw userIds:', userIds);
        
        // Sanitize and convert userIds
        const sanitizedUserIds = userIds.map(id => {
            // If it's an object with $oid, use that
            if (typeof id === 'object' && id.$oid) {
                return id.$oid;
            }
            
            // Convert to string, trimming any whitespace
            return String(id).trim();
        }).filter(id => id); // Remove any empty strings
        
        console.log('Sanitized userIds:', sanitizedUserIds);
        
        // Get the token, ensuring it's a Bearer token
        const token = localStorage.getItem('token');
        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await axios.post(
            'http://localhost:3001/api/users/profiles', 
            { userIds: sanitizedUserIds }, 
            { 
                headers: { 
                    'Authorization': bearerToken,
                    'Content-Type': 'application/json'
                } 
            }
        );
        
        // Process the response
        const newProfiles = response.data.reduce((acc, profile) => {
            if (profile.profileImage) {
                const fullImageUrl = profile.profileImage.startsWith('/')
                    ? `http://localhost:3001${profile.profileImage}`
                    : profile.profileImage;
                
                acc[profile._id] = fullImageUrl;
            }
            return acc;
        }, {});
        
        // Update user profiles
        setUserProfiles(prev => ({
            ...prev,
            ...newProfiles
        }));
        
        return newProfiles;
    } catch (error) {
        // Comprehensive error logging
        console.error('Detailed error fetching user profiles:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        
        // Return an empty object to prevent breaking the application
        return {};
    }
};

  const getProfileImageUrl = (userId) => {
    console.log("Getting profile image for user ID:", userId);
    console.log("Current userProfiles state:", userProfiles);

    const profileImage = userProfiles[userId];

    console.log("Found profile image:", profileImage);

    if (profileImage) {
      const fullUrl = profileImage.startsWith("/")
        ? `http://localhost:3001${profileImage}`
        : profileImage;

      console.log("Constructed full URL:", fullUrl);
      return fullUrl;
    }

    console.log("No profile image found for user");
    return null;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showPopup("Please log in to create a post", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        username: user?.name || user?.email || "Anonymous",
      };

      await axios.post("http://localhost:3001/api/posts", newPost, {
        headers: {
          Authorization: token,
        },
      });

      setNewPostTitle("");
      setNewPostContent("");
      setShowCreateForm(false);
      showPopup("Post created successfully!", "success");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response) {
        showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!isAuthenticated) {
      showPopup("Please log in to comment", "error");
      return;
    }

    if (!newComment.trim()) {
      showPopup("Comment cannot be empty", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const commentData = {
        comment_text: newComment,
        username: user?.name || user?.email || "Anonymous",
      };

      await axios.post(
        `http://localhost:3001/api/posts/${postId}/comments`,
        commentData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      showPopup("Comment added successfully", "success");
      setNewComment("");
      setCommentPostId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error.response) {
        showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
      }
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      showPopup("Please log in to like a post", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "You already liked this post"
      ) {
        // If user already liked, try to unlike
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `http://localhost:3001/api/posts/${postId}/unlike`,
            {
              headers: {
                Authorization: token,
              },
            }
          );

          fetchPosts();
        } catch (unlikeError) {
          console.error("Error unliking post:", unlikeError);
        }
      } else if (error.response) {
        showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
      }
    }
  };

  // Start editing a post
  const startEditPost = (post) => {
    setEditingPost(post._id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  // Cancel editing a post
  const cancelEditPost = () => {
    setEditingPost(null);
    setEditPostTitle("");
    setEditPostContent("");
  };

  // Save edited post
  const saveEditedPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3001/api/posts/${postId}`,
        {
          title: editPostTitle,
          content: editPostContent,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setEditingPost(null);
      showPopup("Post updated successfully", "success");
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response) {
        showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
      }
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    confirmAction("Are you sure you want to delete this post?", async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`http://localhost:3001/api/posts/${postId}`, {
          headers: {
            Authorization: token,
          },
        });

        showPopup("Post deleted successfully", "success");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        if (error.response) {
          showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
        }
      }
    });
  };

  // Start editing a comment
  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment_text);
  };

  // Cancel editing a comment
  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Save edited comment
  const saveEditedComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3001/api/posts/${postId}/comments/${commentId}`,
        {
          comment_text: editCommentText,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setEditingComment(null);
      showPopup("Comment updated successfully", "success");
      fetchPosts();
    } catch (error) {
      console.error("Error updating comment:", error);
      if (error.response) {
        showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
      }
    }
  };

  // Delete a comment
  const deleteComment = async (postId, commentId) => {
    confirmAction("Are you sure you want to delete this comment?", async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `http://localhost:3001/api/posts/${postId}/comments/${commentId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        showPopup("Comment deleted successfully", "success");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting comment:", error);
        if (error.response) {
          showPopup(`Error: ${error.response.data.error || "Something went wrong"}`, "error");
        }
      }
    });
  };

  // Check if the current user is the owner of a post or comment
  const isOwner = (itemUserId) => {
    return user && (user.id === itemUserId || user._id === itemUserId);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p>Loading community posts...</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Generate a color based on username for avatar
  const getAvatarColor = (username) => {
    if (!username) return "#6366F1"; // Default indigo

    const colors = [
      "#F87171", // red
      "#FB923C", // orange
      "#FBBF24", // amber
      "#34D399", // emerald
      "#60A5FA", // blue
      "#A78BFA", // violet
      "#F472B6", // pink
    ];

    // Simple hash function to pick a color based on username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Popup icon based on type
  const getPopupIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default: // info
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      
      {/* Modal Popup */}
      {popup.show && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => !popup.onConfirm && hidePopup()}
            ></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {/* Icon */}
                  {getPopupIcon(popup.type)}

                  {/* Content */}
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {popup.type === 'success' ? 'Success!' : 
                       popup.type === 'error' ? 'Error' : 
                       popup.type === 'warning' ? 'Warning' : 'Information'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {popup.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    popup.type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                    popup.type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 
                    popup.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 
                    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                  onClick={() => {
                    if (popup.onConfirm) {
                      popup.onConfirm();
                    }
                    hidePopup();
                  }}
                >
                  {popup.confirmText}
                </button>
                {popup.showCancel && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={hidePopup}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto px-4 py-8">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        {isAuthenticated && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
            onClick={() => setShowCreateForm(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Post
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showCreateForm && isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full mx-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowCreateForm(false);
                setNewPostTitle("");
                setNewPostContent("");
              }}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form
              onSubmit={(e) => {
                handlePostSubmit(e);
                setShowCreateForm(false);
              }}
            >
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Post Title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
                autoFocus
              />
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write something..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-full"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPostTitle("");
                    setNewPostContent("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Community Posts */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {editingPost === post._id ? (
                // Edit Post Form
                <div className="p-6">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg mb-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex space-x-2 justify-end">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={cancelEditPost}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => saveEditedPost(post._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // Post Display
                <>
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center mb-4">
                      {/* Profile Image or Initials */}
                      {getProfileImageUrl(post.user_id) ? (
                        <img
                          src={getProfileImageUrl(post.user_id)}
                          alt={post.username || "User"}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          onError={(e) => {
                            console.error("Image failed to load:", {
                              src: e.target.src,
                              userId: post.user_id,
                              username: post.username,
                            });
                            e.target.style.display = "none";
                            const parent = e.target.parentNode;
                            const div = document.createElement("div");
                            div.className =
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3";
                            div.style.backgroundColor = getAvatarColor(
                              post.username
                            );
                            div.innerText = getInitials(post.username);
                            parent.appendChild(div);
                          }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3"
                          style={{
                            backgroundColor: getAvatarColor(post.username),
                          }}
                        >
                          {getInitials(post.username)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {post.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          {isOwner(post.user_id) && (
                            <div className="flex space-x-1">
                              <button
                                className="p-1 text-gray-500 hover:text-blue-600"
                                onClick={() => startEditPost(post)}
                                aria-label="Edit post"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-red-600"
                                onClick={() => deletePost(post._id)}
                                aria-label="Delete post"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {/* Post Actions */}
                    <div className="flex items-center space-x-4 border-t border-gray-100 pt-4">
                      <button
                        className={`flex items-center text-gray-500 hover:text-blue-600 ${
                          !isAuthenticated
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleLike(post._id)}
                        disabled={!isAuthenticated}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {post.likes_count > 0 && (
                          <span>{post.likes_count}</span>
                        )}
                      </button>

                      <button
                        className="flex items-center text-gray-500 hover:text-blue-600"
                        onClick={() =>
                          document.getElementById(`comment-${post._id}`).focus()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {post.comments_count > 0 && (
                          <span>{post.comments_count}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Comment Form */}
              {!editingPost && isAuthenticated && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <textarea
                    id={`comment-${post._id}`}
                    className="w-full p-3 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a comment..."
                    value={post._id === commentPostId ? newComment : ""}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      setCommentPostId(post._id);
                    }}
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleCommentSubmit(post._id)}
                      disabled={
                        !newComment.trim() || commentPostId !== post._id
                      }
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              {!editingPost && post.comments && post.comments.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-3">Comments</h3>
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex">
                        {/* Comment Profile Image or Initials */}
                        {getProfileImageUrl(comment.user_id) ? (
                          <div className="flex-shrink-0 mt-1">
                            <img
                              src={getProfileImageUrl(comment.user_id)}
                              alt={comment.username || "User"}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.target.style.display = "none";
                                const parent = e.target.parentNode;
                                const div = document.createElement("div");
                                div.className =
                                  "w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3";
                                div.style.backgroundColor = getAvatarColor(
                                  comment.username
                                );
                                div.innerText = getInitials(comment.username);
                                parent.appendChild(div);
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3 flex-shrink-0 mt-1"
                            style={{
                              backgroundColor: getAvatarColor(comment.username),
                            }}
                          >
                            {getInitials(comment.username)}
                          </div>
                        )}
                        <div className="flex-1">
                          {editingComment === comment._id ? (
                            // Edit Comment Form
                            <div>
                              <textarea
                                className="w-full p-2.5 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editCommentText}
                                onChange={(e) =>
                                  setEditCommentText(e.target.value)
                                }
                                required
                              ></textarea>
                              <div className="flex space-x-2 justify-end">
                                <button
                                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                                  onClick={cancelEditComment}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  onClick={() =>
                                    saveEditedComment(post._id, comment._id)
                                  }
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Comment Display
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">
                                    {comment.username || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      comment.created_at
                                    ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                                {isOwner(comment.user_id) && (
                                  <div className="flex space-x-1">
                                    <button
                                      className="p-1 text-gray-400 hover:text-blue-600"
                                      onClick={() => startEditComment(comment)}
                                      aria-label="Edit comment"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      className="p-1 text-gray-400 hover:text-red-600"
                                      onClick={() =>
                                        deleteComment(post._id, comment._id)
                                      }
                                      aria-label="Delete comment"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm mt-1">
                                {comment.comment_text}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No posts available</p>
          {isAuthenticated && (
            <button
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
              onClick={() => setShowCreateForm(true)}
            >
              Create the first post
            </button>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Community;