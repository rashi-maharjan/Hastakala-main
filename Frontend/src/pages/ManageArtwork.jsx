import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import AddArtwork from '../components/AddArtwork';

// Backend URL
const API_URL = 'http://localhost:3001';

const ManageArtwork = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Get actual token from localStorage
  const getAuthToken = () => localStorage.getItem("token");
  
  // Get current user info
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData(user);
        console.log("User data:", user);
      } else {
        console.log("No user data found in localStorage");
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }, []);
  
  // Protect this route for artists only
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== 'artist') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch artist's artworks - ONLY FOR THE CURRENT USER
  useEffect(() => {
    const fetchArtworks = async () => {
      if (!userData || !userData.id) {
        console.log("Waiting for user data...");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching artworks for user ID:", userData.id);
        
        // Get all artworks
        const response = await axios.get(`${API_URL}/api/artwork`);
        
        if (Array.isArray(response.data)) {
          // Filter only artworks created by the current user
          const userArtworks = response.data.filter(artwork => {
            const artistId = artwork.artist?._id || artwork.artist;
            const userId = userData.id || userData.userId || userData._id;
            
            console.log(`Comparing artist ID: ${artistId} with user ID: ${userId}`);
            
            // Use includes for flexible matching in case of ObjectId vs String formats
            return artistId && userId && 
                  (artistId.includes(userId) || userId.includes(artistId));
          });
          
          console.log(`Found ${userArtworks.length} artworks belonging to current user`);
          setArtworks(userArtworks);
        } else if (response.data && Array.isArray(response.data.artworks)) {
          const userArtworks = response.data.artworks.filter(artwork => {
            const artistId = artwork.artist?._id || artwork.artist;
            const userId = userData.id || userData.userId || userData._id;
            return artistId && userId && 
                  (artistId.includes(userId) || userId.includes(artistId));
          });
          setArtworks(userArtworks);
        } else {
          setError("Invalid response format from API");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to fetch artworks. Please try again.');
        setLoading(false);
      }
    };

    if (userData) {
      fetchArtworks();
    }
  }, [userData]);

  // Helper function to format image URL
  const getImageUrl = (artwork) => {
    // If it's an API image with relative path
    if (artwork.imageUrl && artwork.imageUrl.startsWith('/')) {
      return `${API_URL}${artwork.imageUrl}`;
    }
    
    // If it's an API image with absolute path
    if (artwork.imageUrl) {
      return artwork.imageUrl;
    }
    
    // If it's a local image (from fallback)
    if (artwork.image) {
      return artwork.image;
    }
    
    // Fallback to a placeholder
    return 'https://via.placeholder.com/300';
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return '';
    
    // If it already has currency format (Rs. X,XXX)
    if (typeof price === 'string' && price.includes('Rs.')) {
      return price;
    }
    
    // Format as currency
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  // Handle add new artwork
  const handleAddArtwork = (newArtwork) => {
    setArtworks(prev => [newArtwork, ...prev]);
    setShowAddModal(false);
  };

  // Handle edit artwork
  const handleEditArtwork = (artwork) => {
    setEditingArtwork(artwork);
    setShowAddModal(true);
  };

  // Handle update artwork
  const handleUpdateArtwork = async (updatedArtwork) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      const token = getAuthToken();
      
      // Create a FormData if we have a file, otherwise use JSON
      if (updatedArtwork.file) {
        const formData = new FormData();
        formData.append('title', updatedArtwork.title);
        formData.append('price', updatedArtwork.price);
        formData.append('description', updatedArtwork.description || '');
        formData.append('inStock', updatedArtwork.inStock);
        formData.append('height', updatedArtwork.height || '');
        formData.append('width', updatedArtwork.width || '');
        formData.append('medium', updatedArtwork.medium || '');
        formData.append('paper', updatedArtwork.paper || '');
        formData.append('orientation', updatedArtwork.orientation || '');
        formData.append('frame', updatedArtwork.frame || '');
        formData.append('image', updatedArtwork.file);
        
        const response = await axios.put(
          `${API_URL}/api/artwork/${updatedArtwork._id}`, 
          formData,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data && (response.data.artwork || response.data)) {
          const updatedItem = response.data.artwork || response.data;
          
          setArtworks(prev => 
            prev.map(art => art._id === updatedArtwork._id ? updatedItem : art)
          );
          
          setEditingArtwork(null);
          setShowAddModal(false);
        }
      } else {
        // Send as JSON if no file
        const response = await axios.put(
          `${API_URL}/api/artwork/${updatedArtwork._id}`, 
          updatedArtwork,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && (response.data.artwork || response.data)) {
          const updatedItem = response.data.artwork || response.data;
          
          setArtworks(prev => 
            prev.map(art => art._id === updatedArtwork._id ? updatedItem : art)
          );
          
          setEditingArtwork(null);
          setShowAddModal(false);
        }
      }
    } catch (err) {
      console.error('Error updating artwork:', err);
      
      if (err.response?.status === 403) {
        setActionError('You do not have permission to update this artwork.');
      } else {
        setActionError('Failed to update artwork. Please try again.');
      }
      
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete artwork
  const handleDeleteArtwork = async (id) => {
    if (confirmDelete && deletingId === id) {
      setActionLoading(true);
      setActionError(null);
      
      try {
        const token = getAuthToken();
        
        // Optimistic update - remove from UI first
        setArtworks(prev => prev.filter(art => art._id !== id));
        
        // Then try to delete from server
        await axios.delete(`${API_URL}/api/artwork/${id}`, {
          headers: {
            Authorization: token
          }
        });
        
        setConfirmDelete(false);
        setDeletingId(null);
      } catch (err) {
        console.error('Error deleting artwork:', err);
        
        // Restore the artwork in the UI if deletion fails
        if (err.response?.status === 403) {
          setActionError('You do not have permission to delete this artwork.');
          
          // Refetch artworks to restore state
          const response = await axios.get(`${API_URL}/api/artwork`);
          if (Array.isArray(response.data)) {
            setArtworks(response.data);
          }
        } else {
          setActionError('Failed to delete artwork. Please try again.');
        }
        
        setTimeout(() => setActionError(null), 5000);
      } finally {
        setActionLoading(false);
        setConfirmDelete(false);
        setDeletingId(null);
      }
    } else {
      // First click - ask for confirmation
      setDeletingId(id);
      setConfirmDelete(true);
      // Auto-clear confirmation after 5 seconds
      setTimeout(() => {
        if (deletingId === id) {
          setConfirmDelete(false);
          setDeletingId(null);
        }
      }, 5000);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setConfirmDelete(false);
    setDeletingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Your Artwork</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => {
                setEditingArtwork(null);
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Artwork
            </button>
          </div>
        </div>

        {/* Action Error Message */}
        {actionError && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md flex items-center justify-between">
            <span>{actionError}</span>
            <button 
              onClick={() => setActionError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Info about current user */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {userData ? (
                  <>
                    Logged in as: <strong>{userData.name}</strong> ({userData.email})<br/>
                    User ID: <span className="font-mono text-xs">{userData.id || userData.userId || userData._id}</span><br/>
                    Only showing artworks created by you.
                  </>
                ) : (
                  "Loading user information..."
                )}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Log In Again
            </button>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700">You haven't added any artwork yet.</p>
            <button
              onClick={() => {
                setEditingArtwork(null);
                setShowAddModal(true);
              }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Artwork
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map(artwork => (
              <div key={artwork._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative group">
                  <img 
                    src={getImageUrl(artwork)} 
                    alt={artwork.title} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleEditArtwork(artwork)}
                      className="mr-2 p-2 bg-white rounded-full"
                      disabled={actionLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteArtwork(artwork._id)}
                      className="p-2 bg-white rounded-full"
                      disabled={actionLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-900">{artwork.title}</h3>
                  <p className="text-gray-700">{formatPrice(artwork.price)}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 text-xs leading-none rounded-full ${artwork.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {artwork.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    
                    <div className="flex space-x-2">
                      {!confirmDelete || deletingId !== artwork._id ? (
                        <>
                          <button 
                            onClick={() => handleEditArtwork(artwork)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteArtwork(artwork._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center text-sm">
                          <button 
                            onClick={() => handleDeleteArtwork(artwork._id)}
                            className="text-red-600 font-medium mr-2"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button 
                            onClick={cancelDelete}
                            className="text-gray-600"
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Artwork Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
                    </h3>
                    <div className="mt-4">
                      <AddArtwork 
                        onArtworkAdded={handleAddArtwork}
                        editingArtwork={editingArtwork}
                        onArtworkUpdated={handleUpdateArtwork}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingArtwork(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageArtwork;