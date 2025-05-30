import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiWorking, setApiWorking] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    medium: null,
    paper: null,
    orientation: null,
    frame: null,
    stock: null  // New stock filter
  });

  // Filter options
  const filterOptions = {
    medium: ['Acrylic', 'Oil', 'Watercolor', 'Ink', 'Pastel', 'Digital', 'Gouache', 'Charcoal', 'Markers', 'Pencil'],
    paper: ['Waterpad', 'Sketch', 'Canvas', 'A(four)'],
    orientation: ['Landscape', 'Portrait'],
    frame: ['Included', 'Not Included'],
    stock: ['In Stock', 'Out of Stock']  // New stock filter options
  };

  // Get active filter count
  const activeFilterCount = Object.values(filters).filter(value => value !== null).length;

  // Ref for filter popup (to detect clicks outside)
  const filterPopupRef = useRef(null);

  // Get user role from localStorage
  const userRole = localStorage.getItem("role");

  // Helper function to format price with commas
  const formatPrice = (price) => {
    if (!price) return '';
    
    // If price already has 'Rs.' prefix, ensure it has commas
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

  // Fallback artworks data in case API fails
  const fallbackArtworks = [
    { title: "Peace and Harmony", price: "Rs. 30,000", image: peace, _id: "fallback1", medium: "Acrylic", paper: "Canvas", orientation: "Landscape", frame: "Included", inStock: true },
    { title: "Living Goddess", price: "Rs. 50,000", image: living, _id: "fallback2", medium: "Oil", paper: "Canvas", orientation: "Portrait", frame: "Included", inStock: true },
    { title: "Holy Seto Machhindranath", price: "Rs. 40,000", image: seto, _id: "fallback3", medium: "Acrylic", paper: "Waterpad", orientation: "Portrait", frame: "Not Included", inStock: false },
    { title: "Millions of Dots", price: "Rs. 2,000", image: millions, _id: "fallback4", medium: "Ink", paper: "A4", orientation: "Landscape", frame: "Not Included", inStock: true },
    { title: "Ganesh of Navadurga Nach", price: "Rs. 10,000", image: ganesh, _id: "fallback5", medium: "Watercolor", paper: "Waterpad", orientation: "Portrait", frame: "Not Included", inStock: false },
    { title: "Culture behind the Mask", price: "Rs. 60,000", image: culture, _id: "fallback6", medium: "Acrylic", paper: "Canvas", orientation: "Portrait", frame: "Included", inStock: true },
    { title: "Shree Pachali Bhairav", price: "Rs. 80,000", image: shree, _id: "fallback7", medium: "Acrylic", paper: "Waterpad", orientation: "Portrait", frame: "Not Included", inStock: true },
    { title: "Gufa", price: "Rs. 10,000", image: gufa, _id: "fallback8", medium: "Digital", paper: "Canvas", orientation: "Landscape", frame: "Not Included", inStock: false },
    { title: "Green Tara", price: "Rs. 2,000", image: green, _id: "fallback9", medium: "Gouache", paper: "Sketch", orientation: "Portrait", frame: "Not Included", inStock: true },
    { title: "Sophisticated Nature", price: "Rs. 1,000", image: sop, _id: "fallback10", medium: "Pencil", paper: "A4", orientation: "Landscape", frame: "Not Included", inStock: true },
  ];

  // Helper function to format image URLs
  const getImageUrl = (artwork) => {
    if (artwork.image) return artwork.image;
    if (artwork.imageUrl && artwork.imageUrl.startsWith('/')) return `${API_URL}${artwork.imageUrl}`;
    if (artwork.imageUrl) return artwork.imageUrl;
    return 'https://via.placeholder.com/300';
  };

  // Handle navigation to artwork details
  const handleArtworkClick = (artwork) => {
    const artworkId = artwork._id || `fallback-${artwork.title.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(`/artwork/${artworkId}`, { state: { artwork } });
  };

  // Toggle filter popup
  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  // Handle filter selection
  const handleFilterSelect = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setShowFilterPopup(false);

    const filtered = artworks.filter(artwork => {
      for (const [category, selectedValue] of Object.entries(filters)) {
        if (category === 'stock') {
          // Special handling for stock filter
          if (selectedValue === 'In Stock' && !artwork.inStock) return false;
          if (selectedValue === 'Out of Stock' && artwork.inStock) return false;
        } else if (selectedValue && artwork[category]?.toLowerCase() !== selectedValue.toLowerCase()) {
          return false;
        }
      }
      return true;
    });

    setFilteredArtworks(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      medium: null,
      paper: null,
      orientation: null,
      frame: null,
      stock: null
    });
    setFilteredArtworks(artworks);
    setShowFilterPopup(false);
  };

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch artworks from API
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/artwork`);
        console.log("API Response:", response.data);

        let fetchedArtworks;

        if (Array.isArray(response.data)) {
          fetchedArtworks = response.data;
          setApiWorking(true);
        } else if (response.data && Array.isArray(response.data.artworks)) {
          fetchedArtworks = response.data.artworks;
          setApiWorking(true);
        } else {
          console.error("API response is not an array:", response.data);
          fetchedArtworks = fallbackArtworks;
          setApiWorking(false);
          setError("API data format invalid. Using local data instead.");
        }

        const processedArtworks = fetchedArtworks.map(artwork => ({
          ...artwork,
          medium: artwork.medium || 'Acrylic',
          paper: artwork.paper || 'Canvas',
          orientation: artwork.orientation || 'Landscape',
          frame: artwork.frame || 'Not Included',
          inStock: artwork.inStock !== undefined ? artwork.inStock : true
        }));

        setArtworks(processedArtworks);
        setFilteredArtworks(processedArtworks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setArtworks(fallbackArtworks);
        setFilteredArtworks(fallbackArtworks);
        setApiWorking(false);
        setError('Failed to fetch from API. Using local data instead.');
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleAddArtwork = (newArtwork) => {
    if (apiWorking) {
      if (newArtwork.imageUrl && newArtwork.imageUrl.startsWith('/')) {
        newArtwork.imageUrl = `${API_URL}${newArtwork.imageUrl}`;
      }

      const artworkWithFilters = {
        ...newArtwork,
        medium: newArtwork.medium || 'Acrylic',
        paper: newArtwork.paper || 'Canvas',
        orientation: newArtwork.orientation || 'Landscape',
        frame: newArtwork.frame || 'Not Included',
        inStock: newArtwork.inStock !== undefined ? newArtwork.inStock : true
      };

      setArtworks(prev => [artworkWithFilters, ...prev]);
      setFilteredArtworks(prev => [artworkWithFilters, ...prev]);
    } else {
      alert("API is not working. New artwork will not be saved to server.");
      const fakeArtwork = {
        title: newArtwork.title,
        price: newArtwork.price,
        image: sop,
        _id: Date.now(),
        medium: newArtwork.medium || 'Acrylic',
        paper: newArtwork.paper || 'Canvas',
        orientation: newArtwork.orientation || 'Landscape',
        frame: newArtwork.frame || 'Not Included',
        inStock: true
      };
      setArtworks(prev => [fakeArtwork, ...prev]);
      setFilteredArtworks(prev => [fakeArtwork, ...prev]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Most Popular</h2>
            <div className="relative">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                onClick={toggleFilterPopup}
                aria-label="Filter artworks"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>

                {/* Filter count badge - fixed positioning */}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Only show Add Artwork button for artists */}
          {userRole === 'artist' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
            >
              Add Artwork
            </button>
          )}
        </div>

        {/* Improved Filter Popup */}
        {showFilterPopup && (
          <div className="fixed inset-0 z-40 overflow-y-auto" aria-labelledby="filter-modal">
            <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowFilterPopup(false)}></div>

              <div
                ref={filterPopupRef}
                className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)' }}
              >
                <div className="bg-white px-6 py-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
                        <path d="M3 6h18M6 12h12M10 18h4" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900">Filter Artworks</h3>
                    </div>
                    <button
                      onClick={() => setShowFilterPopup(false)}
                      className="rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Medium Filter */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Medium</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.medium.map(option => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`medium-${option}`}
                              name="medium"
                              checked={filters.medium === option}
                              onChange={() => handleFilterSelect('medium', option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <label htmlFor={`medium-${option}`} className="ml-2 block text-sm text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paper Filter */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Paper</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.paper.map(option => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`paper-${option}`}
                              name="paper"
                              checked={filters.paper === option}
                              onChange={() => handleFilterSelect('paper', option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <label htmlFor={`paper-${option}`} className="ml-2 block text-sm text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Orientation Filter */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Orientation</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.orientation.map(option => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`orientation-${option}`}
                              name="orientation"
                              checked={filters.orientation === option}
                              onChange={() => handleFilterSelect('orientation', option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <label htmlFor={`orientation-${option}`} className="ml-2 block text-sm text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Frame Filter */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Frame</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.frame.map(option => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`frame-${option}`}
                              name="frame"
                              checked={filters.frame === option}
                              onChange={() => handleFilterSelect('frame', option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <label htmlFor={`frame-${option}`} className="ml-2 block text-sm text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Stock</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.stock.map(option => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`stock-${option}`}
                              name="stock"
                              checked={filters.stock === option}
                              onChange={() => handleFilterSelect('stock', option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <label htmlFor={`stock-${option}`} className="ml-2 block text-sm text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="pt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={resetFilters}
                        className="py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm font-medium transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
                        className="py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm font-medium transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Connection Warning */}
        {!apiWorking && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">Using local data - API connection failed. Some features may be limited.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && !filteredArtworks.length ? (
          <div className="text-red-500 text-center p-10 bg-red-50 rounded-lg border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-lg font-medium">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork._id || index}
                className="artwork-card cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white border border-gray-100"
                onClick={() => handleArtworkClick(artwork)}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={getImageUrl(artwork)}
                    alt={artwork.title}
                    className={`w-full h-full object-cover transform transition-transform hover:scale-105 duration-500 ${!artwork.inStock ? 'opacity-50' : ''}`}
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.src = 'https://via.placeholder.com/300';
                      e.target.onerror = null;
                    }}
                  />
                  {!artwork.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{artwork.title}</h3>
                  <p className="text-gray-700 font-semibold mt-1">{formatPrice(artwork.price)}</p>
                  <p className={`text-sm mt-1 ${artwork.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {artwork.inStock ? 'Available' : 'Sold Out'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredArtworks.length === 0 && !loading && !error && (
          <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-600 mb-4">No matching artworks found.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Add Artwork Modal */}
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
                      Add New Artwork
                    </h3>
                    <div className="mt-4">
                      <AddArtwork onArtworkAdded={handleAddArtwork} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
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

export default Feed;