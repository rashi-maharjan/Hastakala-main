import { useState } from 'react';
import axios from 'axios';

// Backend API URL - change this if your backend is on a different port
const API_URL = 'http://localhost:3001'; 

const AddArtwork = ({ onArtworkAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !price || !image) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', `Rs. ${price}`); // Format price consistently
      formData.append('image', image);

      // Get token from localStorage using your existing pattern
      const token = localStorage.getItem("token");
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      console.log('Sending request to:', `${API_URL}/api/artwork`);
      console.log('Token:', token);

      // Send request to add artwork with absolute URL to backend
      const response = await axios.post(`${API_URL}/api/artwork`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });

      console.log('API Response:', response.data);

      // Reset form
      setTitle('');
      setPrice('');
      setImage(null);
      setPreviewUrl('');
      setShowModal(false);
      
      // Add new artwork to the feed
      if (onArtworkAdded) {
        onArtworkAdded(response.data.artwork);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error adding artwork:', err);
      
      // Provide more detailed error message based on error type
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response:', err.response.data);
        setError(err.response.data.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.log('Error request:', err.request);
        setError('No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Add Artwork
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Artwork</h2>
              
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                      Rs.
                    </span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="10,000"
                      className="w-full p-2 border border-gray-300 rounded-r"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artwork Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  
                  {previewUrl && (
                    <div className="mt-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Artwork'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddArtwork;