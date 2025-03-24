import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from 'axios';
import AddArtwork from '../components/AddArtwork';

// Import your artwork images as fallback
import peace from '../assets/images/Peace and Harmony.png'
import living from '../assets/images/Living Goddess.png'
import seto from '../assets/images/Holy Seto Machhindranath.png'
import culture from '../assets/images/Culture behind the Mask.png'
import ganesh from '../assets/images/Ganesh of Navadurga Nach.png'
import shree from '../assets/images/Shree Pachali Bhairav.png'
import millions from '../assets/images/Millions of Dots.png'
import gufa from '../assets/images/Gufa.png'
import green from '../assets/images/Green Tara.png'
import sop from '../assets/images/Sophisticated Nature.png'

// Backend URL
const API_URL = 'http://localhost:3001';

const Feed = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiWorking, setApiWorking] = useState(true);

  // Get user role from localStorage
  const userRole = localStorage.getItem("role");

  // Fallback artworks data in case API fails
  const fallbackArtworks = [
    { title: "Peace and Harmony", price: "Rs. 30,000", image: peace },
    { title: "Living Goddess", price: "Rs. 50,000", image: living },
    { title: "Holy Seto Machhindranath", price: "Rs. 40,000", image: seto },
    { title: "Millions of Dots", price: "Rs. 2,000", image: millions},
    { title: "Ganesh of Navadurga Nach", price: "Rs. 10,000", image: ganesh },
    { title: "Culture behind the Mask", price: "Rs. 60,000", image: culture },
    { title: "Shree Pachali Bhairav", price: "Rs. 80,000", image: shree },
    { title: "Gufa", price: "Rs. 10,000", image: gufa },
    { title: "Green Tara", price: "Rs. 2,000", image: green },
    { title: "Sophisticated Nature", price: "Rs. 1,000", image: sop },
  ];

  // Helper function to format image URLs
  const getImageUrl = (artwork) => {
    // If it's a local image (from fallback)
    if (artwork.image) {
      return artwork.image;
    }
    
    // If it's an API image with relative path
    if (artwork.imageUrl && artwork.imageUrl.startsWith('/')) {
      return `${API_URL}${artwork.imageUrl}`;
    }
    
    // If it's an API image with absolute path
    if (artwork.imageUrl) {
      return artwork.imageUrl;
    }
    
    // Fallback to a placeholder
    return 'https://via.placeholder.com/300';
  };

  useEffect(() => {
    // Fetch artworks from API
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/artwork`);
        console.log("API Response:", response.data);
        
        // Check if the data is an array
        if (Array.isArray(response.data)) {
          setArtworks(response.data);
          setApiWorking(true);
        } else if (response.data && Array.isArray(response.data.artworks)) {
          // If the data is nested under an "artworks" property
          setArtworks(response.data.artworks);
          setApiWorking(true);
        } else {
          console.error("API response is not an array:", response.data);
          // Fallback to local data
          setArtworks(fallbackArtworks);
          setApiWorking(false);
          setError("API data format invalid. Using local data instead.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        // Fallback to local data if API fails
        setArtworks(fallbackArtworks);
        setApiWorking(false);
        setError('Failed to fetch from API. Using local data instead.');
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleAddArtwork = (newArtwork) => {
    if (apiWorking) {
      // For newly added artworks, make sure the image path is correctly formatted
      if (newArtwork.imageUrl && newArtwork.imageUrl.startsWith('/')) {
        newArtwork.imageUrl = `${API_URL}${newArtwork.imageUrl}`;
      }
      setArtworks(prev => [newArtwork, ...prev]);
    } else {
      alert("API is not working. New artwork will not be saved to server.");
      // Add to local state anyway for demo purposes
      const fakeArtwork = {
        title: newArtwork.title,
        price: newArtwork.price,
        image: sop, // Use a placeholder image
        _id: Date.now() // Create a fake ID
      };
      setArtworks(prev => [fakeArtwork, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Most Popular</h2>
            <span className="text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M22.5 4.375V18.125" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22.5 25.625C23.5355 25.625 24.375 24.7855 24.375 23.75C24.375 22.7145 23.5355 21.875 22.5 21.875C21.4645 21.875 20.625 22.7145 20.625 23.75C20.625 24.7855 21.4645 25.625 22.5 25.625Z" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 25.625V11.875" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 8.125C16.0355 8.125 16.875 7.28553 16.875 6.25C16.875 5.21447 16.0355 4.375 15 4.375C13.9645 4.375 13.125 5.21447 13.125 6.25C13.125 7.28553 13.9645 8.125 15 8.125Z" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 3.75V17.5" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 25.625C8.53553 25.625 9.375 24.7855 9.375 23.75C9.375 22.7145 8.53553 21.875 7.5 21.875C6.46447 21.875 5.625 22.7145 5.625 23.75C5.625 24.7855 6.46447 25.625 7.5 25.625Z" stroke="#000D26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          
          {/* Only show Add Artwork button for artists */}
          {userRole === 'artist' && (
            <AddArtwork onArtworkAdded={handleAddArtwork} />
          )}
        </div>

        {/* API Connection Warning */}
        {!apiWorking && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>Using local data - API connection failed. Some features may be limited.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && !artworks.length ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {artworks.map((artwork, index) => (
              <div key={artwork._id || index} className="artwork-card">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
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
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-base text-gray-900">{artwork.title}</h3>
                  <p className="text-gray-700">{artwork.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {artworks.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No artworks available yet.</p>
            {userRole === 'artist' && (
              <p className="mt-2">
                Start showcasing your work by adding your first artwork!
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Feed