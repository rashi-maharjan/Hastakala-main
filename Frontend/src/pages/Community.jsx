import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegThumbsUp, FaThumbsUp, FaTrash } from "react-icons/fa";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName"); // Add this line to get the user's name

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/posts",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Make sure the user name is displayed immediately
      const newPostWithUserInfo = response.data;
      
      // If the user name is still not populated, inject it manually
      if (!newPostWithUserInfo.user || !newPostWithUserInfo.user.name) {
        newPostWithUserInfo.user = { 
          _id: userId,
          name: userName || localStorage.getItem("name") || "Me" 
        };
      }
      
      setPosts([newPostWithUserInfo, ...posts]);
      setNewPost({ title: "", content: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/comments`,
        { content: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCommentText({ ...commentText, [postId]: "" });
      
      // Update just the specific post with the new comment
      const updatedPosts = posts.map(post => 
        post._id === postId ? response.data : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleLike = async (postId, commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/posts/${postId}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update just the specific post with the updated likes
      const updatedPosts = posts.map(post => 
        post._id === postId ? response.data : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    setDeletingComment(commentId);
    try {
      await axios.delete(
        `http://localhost:3001/api/posts/${postId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the UI by removing the deleted comment
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment._id !== commentId)
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingComment(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Community Posts</h1>

      {/* Create Post */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Write something..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* List of Posts */}
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 shadow rounded mb-6">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500">
              By: {post.user?.name || localStorage.getItem("userName") || "Unknown User"}
            </p>

            {/* Comment Input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({ ...commentText, [post._id]: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleComment(post._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Comment
              </button>
            </div>

            {/* Comments */}
            <div className="mt-4">
              {Array.isArray(post.comments) && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-100 p-3 rounded mb-2"
                  >
                    <div className="flex justify-between">
                      <p className="text-gray-800">
                        <span className="font-semibold">
                          {comment.user?.name || "Anonymous"}:{" "}
                        </span>
                        {comment.content}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleLike(post._id, comment._id)}
                          className="flex items-center"
                        >
                          {comment.likes.includes(userId) ? (
                            <FaThumbsUp className="text-blue-500" />
                          ) : (
                            <FaRegThumbsUp />
                          )}
                          <span className="ml-1 text-gray-600">
                            {comment.likes.length}
                          </span>
                        </button>
                        
                        {/* Delete button - Only visible to comment owner */}
                        {comment.user?._id === userId && (
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            disabled={deletingComment === comment._id}
                            className="text-red-500 hover:text-red-700"
                            title="Delete comment"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Community;