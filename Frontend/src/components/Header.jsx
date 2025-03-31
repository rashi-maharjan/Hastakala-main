import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/rashi.png"; // Keep as fallback
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();

    // Load cart items count from localStorage
    const getCartItems = () => {
      try {
        const cartItems = localStorage.getItem('cartItems');
        if (cartItems) {
          const items = JSON.parse(cartItems);
          setCartItemsCount(items.length);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setCartItemsCount(0);
      }
    };

    getCartItems();

    // Add click outside listener to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      getCartItems();
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Reset state
    setUser(null);
    setUserRole(null);
    setIsDropdownOpen(false);
    
    // Redirect to login page
    navigate('/login');
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get user profile image URL
  const getProfileImageUrl = () => {
    if (user && user.profileImage) {
      // If the image path is relative (from our server)
      if (user.profileImage.startsWith('/')) {
        return `http://localhost:3001${user.profileImage}`;
      }
      // If it's already a full URL
      return user.profileImage;
    }
    return defaultAvatar;
  };

  return (
    <header className="relative bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/feed" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </Link>
          <button
            className="xl:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleSidePanel}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <nav className="hidden xl:flex space-x-8">
            <Link 
              to="/feed" 
              className={`text-gray-900 hover:text-primary ${location.pathname === "/feed" ? "text-primary" : ""}`}
            >
              Feed
            </Link>
            <Link 
              to="/community" 
              className={`text-gray-900 hover:text-primary ${location.pathname === "/community" ? "text-primary" : ""}`}
            >
              Community
            </Link>
            <Link 
              to="/events" 
              className={`text-gray-900 hover:text-primary ${location.pathname === "/events" ? "text-primary" : ""}`}
            >
              Events
            </Link>
            {/* Show Manage Artwork link only for artists */}
            {userRole === 'artist' && (
              <Link 
                to="/manage-artwork" 
                className={`text-gray-900 hover:text-primary ${location.pathname === "/manage-artwork" ? "text-primary" : ""}`}
              >
                Manage Artwork
              </Link>
            )}
          </nav>

          <div className="hidden xl:block relative w-1/3">
            <input
              type="search"
              placeholder="Search"
              className="border rounded-3xl py-2 pr-4 pl-10 placeholder-black outline-none bg-gray-200/70 w-full"
            />
            <svg
              className="absolute top-1/4 left-3"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M11.7188 18.5C15.5847 18.5 18.7188 15.366 18.7188 11.5C18.7188 7.63401 15.5847 4.5 11.7188 4.5C7.85276 4.5 4.71875 7.63401 4.71875 11.5C4.71875 15.366 7.85276 18.5 11.7188 18.5Z"
                stroke="#000D26"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.7188 16.5L19.7188 19.5"
                stroke="#000D26"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="hidden xl:flex items-center space-x-4">
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 17.5C19.005 17.8581 18.8818 18.2061 18.6525 18.4812C18.4233 18.7563 18.1032 18.9404 17.75 19H17.5H6.50005H6.25005C5.89694 18.9404 5.57682 18.7563 5.34757 18.4812C5.11831 18.2061 4.99504 17.8581 5.00005 17.5C4.99297 17.1414 5.11549 16.7923 5.34511 16.5167C5.57473 16.2412 5.89604 16.0577 6.25005 16V10.25C6.25005 8.72501 6.85585 7.26247 7.93418 6.18414C9.01252 5.1058 10.4751 4.5 12 4.5C13.525 4.5 14.9876 5.1058 16.0659 6.18414C17.1442 7.26247 17.75 8.72501 17.75 10.25V16C18.1041 16.0577 18.4254 16.2412 18.655 16.5167C18.8846 16.7923 19.0071 17.1414 19 17.5Z"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 21H14"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.82 4.57C12.9367 4.4028 12.9995 4.20391 13 4C13 3.73478 12.8946 3.48043 12.7071 3.29289C12.5196 3.10536 12.2652 3 12 3C11.7348 3 11.4804 3.10536 11.2929 3.29289C11.1054 3.48043 11 3.73478 11 4C11.0005 4.20391 11.0633 4.4028 11.18 4.57"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link to="/cart" className="text-gray-400 hover:text-gray-500 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.25 18.81C9.80228 18.81 10.25 18.3623 10.25 17.81C10.25 17.2577 9.80228 16.81 9.25 16.81C8.69772 16.81 8.25 17.2577 8.25 17.81C8.25 18.3623 8.69772 18.81 9.25 18.81Z"
                  fill="#000D26"
                />
                <path
                  d="M17.25 18.81C17.8023 18.81 18.25 18.3623 18.25 17.81C18.25 17.2577 17.8023 16.81 17.25 16.81C16.6977 16.81 16.25 17.2577 16.25 17.81C16.25 18.3623 16.6977 18.81 17.25 18.81Z"
                  fill="#000D26"
                />
                <path
                  d="M3.54004 5.19H5.27004C5.64256 5.19037 6.00179 5.32843 6.27868 5.57763C6.55557 5.82683 6.73057 6.16958 6.77004 6.54L7.50004 13.84C7.53514 14.2122 7.70885 14.5575 7.9867 14.8076C8.26455 15.0577 8.62625 15.1942 9.00004 15.19H18.3C18.6684 15.1899 19.0238 15.0543 19.2986 14.809C19.5734 14.5638 19.7483 14.226 19.79 13.86L20.46 7.86C20.4837 7.65255 20.4639 7.44244 20.4017 7.2431C20.3395 7.04377 20.2365 6.85962 20.099 6.70242C19.9616 6.54522 19.7929 6.41845 19.6036 6.33021C19.4144 6.24198 19.2088 6.19422 19 6.19H6.73004"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* User Profile Image or Login Link */}
            {!isLoading && (
              user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex-shrink-0 focus:outline-none rounded-full"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={getProfileImageUrl()}
                      alt={user.name || "User profile"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>
                  
                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium truncate">{user.name}</div>
                        <div className="truncate text-gray-500">{user.email}</div>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      {userRole === 'artist' && (
                        <Link 
                          to="/manage-artwork" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Manage Artwork
                        </Link>
                      )}
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                  Login
                </Link>
              )
            )}
            
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5C11.1716 4.5 10.5 5.17157 10.5 6C10.5 6.82843 11.1716 7.5 12 7.5Z"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19.5C12.8284 19.5 13.5 18.8284 13.5 18C13.5 17.1716 12.8284 16.5 12 16.5C11.1716 16.5 10.5 17.1716 10.5 18C10.5 18.8284 11.1716 19.5 12 19.5Z"
                  stroke="#000D26"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidePanelOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out xl:hidden`}
      >
        <div className="p-6">
          <button
            onClick={toggleSidePanel}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
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

          <div className="mt-8">
            {!isLoading && user ? (
              <div className="flex items-center mb-6">
                <img
                  src={getProfileImageUrl()}
                  alt={user.name || "User profile"}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                  Login
                </Link>
              </div>
            )}

            <div className="mb-6">
              <input
                type="search"
                placeholder="Search"
                className="border rounded-full py-2 px-4 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <nav className="space-y-4">
              <Link 
                to="/feed" 
                className={`block ${location.pathname === "/feed" ? "text-primary" : "text-gray-700 hover:text-gray-900"}`}
                onClick={() => setIsSidePanelOpen(false)}
              >
                Feed
              </Link>
              <Link 
                to="/community" 
                className={`block ${location.pathname === "/community" ? "text-primary" : "text-gray-700 hover:text-gray-900"}`}
                onClick={() => setIsSidePanelOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/events" 
                className={`block ${location.pathname === "/events" ? "text-primary" : "text-gray-700 hover:text-gray-900"}`}
                onClick={() => setIsSidePanelOpen(false)}
              >
                Events
              </Link>
              {/* Show Manage Artwork link only for artists in mobile menu too */}
              {userRole === 'artist' && (
                <Link 
                  to="/manage-artwork" 
                  className={`block ${location.pathname === "/manage-artwork" ? "text-primary" : "text-gray-700 hover:text-gray-900"}`}
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Manage Artwork
                </Link>
              )}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="#"
                className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-3"
                >
                  <path
                    d="M19 17.5C19.005 17.8581 18.8818 18.2061 18.6525 18.4812C18.4233 18.7563 18.1032 18.9404 17.75 19H17.5H6.50005H6.25005C5.89694 18.9404 5.57682 18.7563 5.34757 18.4812C5.11831 18.2061 4.99504 17.8581 5.00005 17.5C4.99297 17.1414 5.11549 16.7923 5.34511 16.5167C5.57473 16.2412 5.89604 16.0577 6.25005 16V10.25C6.25005 8.72501 6.85585 7.26247 7.93418 6.18414C9.01252 5.1058 10.4751 4.5 12 4.5C13.525 4.5 14.9876 5.1058 16.0659 6.18414C17.1442 7.26247 17.75 8.72501 17.75 10.25V16C18.1041 16.0577 18.4254 16.2412 18.655 16.5167C18.8846 16.7923 19.0071 17.1414 19 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 21H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Notifications
              </Link>
              <Link
                to="/cart"
                className="flex items-center text-gray-700 hover:text-gray-900 relative"
                onClick={() => setIsSidePanelOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-3"
                >
                  <path
                    d="M9.25 18.81C9.80228 18.81 10.25 18.3623 10.25 17.81C10.25 17.2577 9.80228 16.81 9.25 16.81C8.69772 16.81 8.25 17.2577 8.25 17.81C8.25 18.3623 8.69772 18.81 9.25 18.81Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.25 18.81C17.8023 18.81 18.25 18.3623 18.25 17.81C18.25 17.2577 17.8023 16.81 17.25 16.81C16.6977 16.81 16.25 17.2577 16.25 17.81C16.25 18.3623 16.6977 18.81 17.25 18.81Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.54004 5.19H5.27004C5.64256 5.19037 6.00179 5.32843 6.27868 5.57763C6.55557 5.82683 6.73057 6.16958 6.77004 6.54L7.50004 13.84C7.53514 14.2122 7.70885 14.5575 7.9867 14.8076C8.26455 15.0577 8.62625 15.1942 9.00004 15.19H18.3C18.6684 15.1899 19.0238 15.0543 19.2986 14.809C19.5734 14.5638 19.7483 14.226 19.79 13.86L20.46 7.86C20.4837 7.65255 20.4639 7.44244 20.4017 7.2431C20.3395 7.04377 20.2365 6.85962 20.099 6.70242C19.9616 6.54522 19.7929 6.41845 19.6036 6.33021C19.4144 6.24198 19.2088 6.19422 19 6.19H6.73004"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={toggleSidePanel}
        ></div>
      )}
    </header>
  );
}

export default Header;