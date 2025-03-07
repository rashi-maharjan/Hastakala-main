import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Settings, LogOut } from "lucide-react";

const AdminNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="fixed top-0 left-0 h-full bg-gray-800 text-white w-64">
            <div className="p-6">
                <h1 className="text-2xl font-bold">Hastakala</h1>
            </div>
            <nav className="mt-10">
                <NavLink
                    to="/admin-dashboard"
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-6 py-2 bg-gray-700 text-white"
                            : "flex items-center px-6 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/admin-dashboard/events"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-6 py-2 bg-gray-700 text-white"
                            : "flex items-center px-6 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                >
                    <Calendar className="w-5 h-5 mr-3" />
                    Events
                </NavLink>
                {/* Add more navigation links here */}
            </nav>
            <div className="mt-auto p-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center px-6 py-2 text-gray-300 hover:bg-red-600 hover:text-white w-full rounded-lg transition-colors duration-200 ease-in-out"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminNav;