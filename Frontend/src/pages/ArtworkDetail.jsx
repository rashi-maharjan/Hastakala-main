import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import { addToCart } from '../utils/CartUtils'; // Import cart utility function

// Backend URL
const API_URL = 'http://localhost:3001';

const ArtworkDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Check if artwork was passed via location state
  const passedArtwork = location.state?.artwork;

  useEffect(() => {
    // If artwork is passed in location state, use it directly
    if (passedArtwork) {
      setArtwork(passedArtwork);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        // Only try API fetch if the ID doesn't start with "fallback"
        if (!id.startsWith('fallback')) {
          const response = await axios.get(`${API_URL}/api/artwork/${id}`);
          if (response.data) {
            setArtwork(response.data);
          } else {
            throw new Error('Artwork not found');
          }
        } else {
          throw new Error('Cannot fetch fallback artwork without state data');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artwork details:', err);
        setError('Could not load artwork details. Please try again later.');
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [id, passedArtwork]);

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

  // Helper function to format dimensions with cm
  const formatDimension = (value) => {
    if (!value) return '';
    
    // If the value already contains 'cm', return as is
    if (value.toString().toLowerCase().includes('cm')) {
      return value;
    }
    
    // Otherwise, append 'cm' to the value
    return `${value} cm`;
  };
  
  // Helper function to format price with commas
  const formatPrice = (price) => {
    if (!price) return '';
    
    // If price already has 'Rs.' prefix, don't modify it
    if (price.toString().includes('Rs.')) {
      // Ensure numbers in price have commas
      return price.replace(/Rs\.\s*(\d+)/, (match, number) => {
        // Format with commas
        const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `Rs. ${formattedNumber}`;
      });
    }
    
    // Add prefix and commas for raw numbers
    const numericValue = price.toString().replace(/[^\d]/g, '');
    const formattedNumber = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `Rs. ${formattedNumber}`;
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleAddToCart = () => {
    if (artwork && artwork.inStock) {
      addToCart(artwork);
      setAddedToCart(true);
      
      // Reset "Added to Cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <button 
          onClick={handleGoBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Gallery
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={handleGoBack} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Return to Gallery
            </button>
          </div>
        ) : artwork ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Artwork Image with Watermark */}
              <div className="h-full relative">
                <img
                  src={getImageUrl(artwork)}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.src = 'https://via.placeholder.com/300';
                    e.target.onerror = null;
                  }}
                />
                {/* Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-5xl font-bold text-white opacity-30 transform rotate-[-45deg]">
                    Hastakala
                  </div>
                </div>
              </div>

              {/* Artwork Details */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
                <p className="text-gray-600 mb-6">{artwork.category || 'Artwork'}</p>
                
                {/* Artist info */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    {typeof artwork.artist === 'object' && artwork.artist.profileImage ? (
                      <img 
                        src={artwork.artist.profileImage.startsWith('/') 
                          ? `${API_URL}${artwork.artist.profileImage}` 
                          : artwork.artist.profileImage} 
                        alt={artwork.artist.name || 'Artist'}className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {typeof artwork.artist === 'object' 
                          ? artwork.artist.name || 'Unknown Artist'
                          : artwork.artist || 'Unknown Artist'}
                      </p>
                      <p className="text-sm text-gray-500">Artist</p>
                    </div>
                  </div>
                  
                  {/* Stock status */}
                  <p className={`font-medium mb-6 ${artwork.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {artwork.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                  
                  {/* Artwork specifications */}
                  <div className="space-y-2 mb-8">
                    {artwork.height && (
                      <div className="flex">
                        <span className="font-medium w-32">Height:</span>
                        <span>{formatDimension(artwork.height)}</span>
                      </div>
                    )}
                    
                    {artwork.width && (
                      <div className="flex">
                        <span className="font-medium w-32">Width:</span>
                        <span>{formatDimension(artwork.width)}</span>
                      </div>
                    )}
                    
                    {artwork.medium && (
                      <div className="flex">
                        <span className="font-medium w-32">Medium:</span>
                        <span>{artwork.medium}</span>
                      </div>
                    )}
                    
                    {artwork.paper && (
                      <div className="flex">
                        <span className="font-medium w-32">Paper:</span>
                        <span>{artwork.paper}</span>
                      </div>
                    )}
                    
                    {artwork.orientation && (
                      <div className="flex">
                        <span className="font-medium w-32">Orientation:</span>
                        <span>{artwork.orientation}</span>
                      </div>
                    )}
                    
                    <div className="flex">
                      <span className="font-medium w-32">Frame:</span>
                      <span>{artwork.frame || 'Not Included'}</span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-32">Price:</span>
                      <span className="font-medium">{formatPrice(artwork.price)}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {artwork.description && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">Description</h2>
                      <p className="text-gray-700">{artwork.description}</p>
                    </div>
                  )}
  
                  {/* Add to Cart button */}
                  <div className="flex flex-col space-y-2">
                    {artwork.inStock ? (
                      <button 
                        onClick={handleAddToCart}
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors focus:outline-none"
                        disabled={addedToCart}
                      >
                        {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                      </button>
                    ) : (
                      <div className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg text-center cursor-not-allowed">
                        Out of Stock
                      </div>
                    )}
                    
                    {addedToCart && (
                      <div className="text-green-600 text-center">
                        Item added to your cart successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Artwork not found.</p>
            </div>
          )}
        </main>
      </div>
    );
  };
  
  export default ArtworkDetail;