import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

// Backend URL for images
const API_URL = 'http://localhost:3001';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search results from location state
  const { query, results } = location.state || { query: '', results: {} };

  // Function to handle going back to previous page
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  // Helper function to format image URL
  const getImageUrl = (item, type) => {
    if (type === 'artwork') {
      if (item.imageUrl && item.imageUrl.startsWith('/')) {
        return `${API_URL}${item.imageUrl}`;
      }
      return item.imageUrl || 'https://via.placeholder.com/300';
    }
    if (type === 'event') {
      if (item.image && item.image.startsWith('/')) {
        return `${API_URL}${item.image}`;
      }
      return item.image || 'https://via.placeholder.com/300';
    }
    return 'https://via.placeholder.com/300';
  };

  // Handle artwork click
  const handleArtworkClick = (artwork) => {
    navigate(`/artwork/${artwork._id}`, { state: { artwork } });
  };

  // Render search results
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
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
        
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Search Results for "{query}"
        </h1>

        {/* No results found */}
        {(!results.artworks?.length && !results.communityPosts?.length && !results.events?.length) && (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
            <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
              No results found for "{query}"
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Try different keywords or check for spelling errors
            </p>
          </div>
        )}

        {/* Artworks Section */}
        {results.artworks && results.artworks.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Artworks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {results.artworks.map((artwork) => (
                <div 
                  key={artwork._id} 
                  className="artwork-card cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white border border-gray-100"
                  onClick={() => handleArtworkClick(artwork)}
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={getImageUrl(artwork, 'artwork')}
                      alt={artwork.title}
                      className={`w-full h-full object-cover transform transition-transform hover:scale-105 duration-500 ${!artwork.inStock ? 'opacity-50' : ''}`}
                    />
                    {!artwork.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Sold Out
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="font-medium text-gray-900 line-clamp-1 text-sm sm:text-base">{artwork.title}</h3>
                    <p className="text-gray-700 font-semibold mt-1 text-sm sm:text-base">{artwork.price}</p>
                    <p className={`text-xs sm:text-sm mt-1 ${artwork.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {artwork.inStock ? 'Available' : 'Sold Out'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community Posts Section */}
        {results.communityPosts && results.communityPosts.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Community Posts</h2>
            <div className="space-y-3 sm:space-y-4">
              {results.communityPosts.map((post) => (
                <Link 
                  to={`/community/post/${post._id}`} 
                  key={post._id} 
                  className="block bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{post.content}</p>
                  <div className="mt-2 text-xs sm:text-sm text-gray-500">
                    By {post.username || 'Anonymous'}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        {results.events && results.events.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {results.events.map((event) => (
                <Link 
                  to={`/events/${event._id}`} 
                  key={event._id} 
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video">
                    <img
                      src={getImageUrl(event, 'event')}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{event.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">{event.location}</p>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {event.start_date} - {event.end_date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SearchResults;