import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, user is not authenticated');
          setIsAuthenticated(false);
          setIsLoading(false);
          fetchPosts(); // Still fetch posts even if not authenticated
          return;
        }

        console.log('Token found, checking if user data exists');
        
        // First try to get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log('User data found in localStorage:', userData);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
            fetchPosts();
            return;
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            // Continue to fetch from server
          }
        }
        
        // If we don't have user data in localStorage, fetch it from the server
        console.log('Fetching user profile from server...');
        const response = await axios.get('http://localhost:3001/api/auth/profile', {
          headers: { 'Authorization': token }
        });
        
        if (response.data && response.data.user) {
          console.log('User profile fetched from server:', response.data.user);
          setUser(response.data.user);
          setIsAuthenticated(true);
          
          // Save to localStorage for future use
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          console.log('No user data returned from server');
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
        fetchPosts();
      }
    };

    fetchUserProfile();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error('Expected an array, but received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to create a post');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        username: user?.name || user?.email || 'Anonymous'
      };
      
      await axios.post('http://localhost:3001/api/posts', newPost, {
        headers: {
          'Authorization': token
        }
      });
      
      setNewPostTitle('');
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!isAuthenticated) {
      alert('Please log in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const commentData = {
        comment_text: newComment,
        username: user?.name || user?.email || 'Anonymous'
      };
      
      await axios.post(`http://localhost:3001/api/posts/${postId}/comments`, commentData, {
        headers: {
          'Authorization': token
        }
      });
      
      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating comment:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please log in to like a post');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:3001/api/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': token
        }
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      if (error.response && error.response.status === 400 && error.response.data.error === 'You already liked this post') {
        // If user already liked, try to unlike
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3001/api/posts/${postId}/unlike`, {
            headers: {
              'Authorization': token
            }
          });
          
          fetchPosts();
        } catch (unlikeError) {
          console.error('Error unliking post:', unlikeError);
        }
      } else if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
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
    setEditPostTitle('');
    setEditPostContent('');
  };

  // Save edited post
  const saveEditedPost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:3001/api/posts/${postId}`, {
        title: editPostTitle,
        content: editPostContent
      }, {
        headers: {
          'Authorization': token
        }
      });
      
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:3001/api/posts/${postId}`, {
        headers: {
          'Authorization': token
        }
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
  };

  // Start editing a comment
  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment_text);
  };

  // Cancel editing a comment
  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  // Save edited comment
  const saveEditedComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:3001/api/posts/${postId}/comments/${commentId}`, {
        comment_text: editCommentText
      }, {
        headers: {
          'Authorization': token
        }
      });
      
      setEditingComment(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
  };

  // Delete a comment
  const deleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:3001/api/posts/${postId}/comments/${commentId}`, {
        headers: {
          'Authorization': token
        }
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
      }
    }
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Login status */}
      <h1 className='text-4xl mb-5'>Community Posts</h1>

      {/* New Post Form */}
      <form onSubmit={handlePostSubmit} className="mb-6">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Post Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          required
          disabled={!isAuthenticated}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder={isAuthenticated ? "Write something..." : "Please log in to create a post"}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          required
          disabled={!isAuthenticated}
        ></textarea>
        <button 
          type="submit" 
          className={`px-4 py-2 ${isAuthenticated ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white rounded`}
          disabled={!isAuthenticated}
        >
          Create Post
        </button>
      </form>

      {/* Community Posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="mb-6 p-4 border rounded-lg shadow-md">
            {editingPost === post._id ? (
              // Edit Post Form
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  required
                ></textarea>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => saveEditedPost(post._id)}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={cancelEditPost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Post Display
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-sm text-gray-600">Posted by: {post.username || "Anonymous"}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 text-sm mr-4">{new Date(post.created_at).toLocaleString()}</div>
                    {isOwner(post.user_id) && (
                      <div className="flex space-x-1">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          onClick={() => startEditPost(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          onClick={() => deletePost(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-800 mb-3">{post.content}</p>
              </>
            )}
            <div className="flex items-center space-x-4 mb-3">
              <button
                className={`px-4 py-2 ${isAuthenticated ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white rounded`}
                onClick={() => handleLike(post._id)}
                disabled={!isAuthenticated}
              >
                Like ({post.likes_count})
              </button>
              <span className="text-gray-600">Comments ({post.comments_count || 0})</span>
            </div>
            
            {/* Comment Form */}
            <div className="mb-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder={isAuthenticated ? "Add a comment..." : "Please log in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!isAuthenticated}
              ></textarea>
              <button
                className={`px-4 py-2 ${isAuthenticated ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white rounded`}
                onClick={() => handleCommentSubmit(post._id)}
                disabled={!isAuthenticated || !newComment.trim()}
              >
                Post Comment
              </button>
            </div>
            
            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="p-4 border-t">
                    {editingComment === comment._id ? (
                      // Edit Comment Form
                      <div>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded mb-2"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          required
                        ></textarea>
                        <div className="flex space-x-2">
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            onClick={() => saveEditedComment(post._id, comment._id)}
                          >
                            Save
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            onClick={cancelEditComment}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Comment Display
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{comment.username || "Anonymous"}</p>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm mr-4">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                            {isOwner(comment.user_id) && (
                              <div className="flex space-x-1">
                                <button
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                  onClick={() => startEditComment(comment)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                  onClick={() => deleteComment(post._id, comment._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p>{comment.comment_text}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No posts available</p>
      )}
    </div>
  );
};

export default Community;