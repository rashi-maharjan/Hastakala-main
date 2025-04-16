import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Calendar, UserRound, Settings, LogOut, Menu } from "lucide-react";
import logo from "../assets/images/white-logo.png";

const AdminNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(true);
            } else {
                setMobileOpen(false);
            }
        };
        
        // Set initial state
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    // NavLink component with animations
    const NavItem = ({ to, icon, text }) => {
        return (
            <NavLink
                to={to}
                end={to === "/admin-dashboard"}
                className={({ isActive }) =>
                    `flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-300 ease-in-out ${
                        isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`
                }
                onClick={() => window.innerWidth < 768 && setMobileOpen(false)}
            >
                {({ isActive }) => (
                    <>
                        <div className="flex justify-center w-8">
                            {React.cloneElement(icon, { className: "w-5 h-5 mr-3 transition-all duration-300" })}
                        </div>
                        <span className="whitespace-nowrap transition-all duration-300">
                            {text}
                        </span>
                        {isActive && (
                            <div className="ml-auto">
                                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                            </div>
                        )}
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <>
            {/* Mobile menu button - fixed on top left corner */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-30 bg-gray-800 p-2 rounded-full text-white shadow-lg md:hidden hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle mobile menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* Sidebar navigation */}
            <div className={`fixed h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-20 w-64
                ${mobileOpen ? "left-0" : "-left-full md:left-0"}
                shadow-2xl shadow-gray-900/50`}>
                <div className="p-4 flex items-center justify-center border-b border-gray-700">
                    <div className="flex items-center justify-center">
                        <img src={logo} alt="logo"  width={150}/>
                    </div>
                </div>

                {/* User info section */}
                <div className="p-4">
                    <div className="bg-gray-700/50 rounded-lg p-3 mb-6">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center ring-2 ring-gray-600">
                                <UserRound className="w-4 h-4 text-white" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-semibold">Admin User</h3>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-3">
                    <NavItem 
                        to="/admin-dashboard" 
                        icon={<Home />} 
                        text="Dashboard" 
                    />
                    <NavItem 
                        to="/admin-dashboard/events" 
                        icon={<Calendar />} 
                        text="Events" 
                    />
                    <NavItem 
                        to="/admin-dashboard/users" 
                        icon={<UserRound />} 
                        text="Manage Users" 
                    />
                </nav>

                {/* Logout button at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-medium"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Content padding - to ensure content doesn't hide behind the sidebar on larger screens */}
            <div className="transition-all duration-300 md:pl-64"></div>
        </>
    );
};

export default AdminNav;