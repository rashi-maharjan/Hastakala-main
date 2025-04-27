import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal popup state
    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: "info", // info, success, error, warning
        onConfirm: null,
        confirmText: "OK",
        showCancel: false
    });

    // Function to show popup
    const showPopup = (message, type = "info", onConfirm = null, confirmText = "OK", showCancel = false) => {
        setPopup({
            show: true,
            message,
            type,
            onConfirm,
            confirmText,
            showCancel
        });
    };

    // Function to hide popup
    const hidePopup = () => {
        setPopup({
            ...popup,
            show: false
        });
    };

    // Function to handle confirmation with popup
    const confirmAction = (message, onConfirm) => {
        showPopup(message, "warning", onConfirm, "Yes, I'm sure", true);
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/users/all?page=${currentPage}&search=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setLoading(false);
            showPopup('Failed to fetch users. Please try again.', 'error');
        }
    };

    // Update user role
    const handleRoleChange = async (userId, newRole) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/users/update-role/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            // Refresh users list
            fetchUsers();
            showPopup('User role updated successfully!', 'success');
        } catch (err) {
            console.error('Error updating user role:', err);
            showPopup('Failed to update user role. Please try again.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        confirmAction('Are you sure you want to delete this user? This action cannot be undone.', async () => {
            try {
                setActionLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/users/delete/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                // Refresh users list
                fetchUsers();
                showPopup('User deleted successfully!', 'success');
            } catch (err) {
                console.error('Error deleting user:', err);
                showPopup('Failed to delete user. Please try again.', 'error');
            } finally {
                setActionLoading(false);
            }
        });
    };

    // Fetch users on component mount and page change
    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Profile image rendering
    const renderProfileImage = (user) => {
        if (user.profileImage) {
            return (
                <img
                    src={`http://localhost:3001${user.profileImage}`}
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                />
            );
        }

        // Fallback to initials
        return (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
        );
    };

    // Render users table
    const renderUsersTable = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="text-center text-red-500 py-4">
                        Error: {error}
                    </td>
                </tr>
            );
        }

        if (users.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                        No users found
                    </td>
                </tr>
            );
        }

        return users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                    {renderProfileImage(user)}
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="p-1 border rounded"
                        disabled={actionLoading}
                    >
                        <option value="normal_user">Normal User</option>
                        <option value="artist">Artist</option>
                        <option value="admin">Admin</option>
                    </select>
                </td>
                <td className="p-3">
                    <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };

    // Popup icon based on type
    const getPopupIcon = (type) => {
        switch (type) {
            case "success":
                return (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case "error":
                return (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case "warning":
                return (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            default: // info
                return (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="flex">
            <AdminNav />
            <div className="flex-1 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-6">User Management</h1>

                    {/* Modal Popup */}
                    {popup.show && (
                        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                {/* Background overlay */}
                                <div 
                                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                                    aria-hidden="true"
                                    onClick={() => !popup.onConfirm && hidePopup()}
                                ></div>

                                {/* Modal panel */}
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            {/* Icon */}
                                            {getPopupIcon(popup.type)}

                                            {/* Content */}
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    {popup.type === 'success' ? 'Success!' : 
                                                    popup.type === 'error' ? 'Error' : 
                                                    popup.type === 'warning' ? 'Warning' : 'Information'}
                                                </h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {popup.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                                                popup.type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                                                popup.type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 
                                                popup.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 
                                                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                            }`}
                                            onClick={() => {
                                                if (popup.onConfirm) {
                                                    popup.onConfirm();
                                                }
                                                hidePopup();
                                            }}
                                        >
                                            {popup.confirmText}
                                        </button>
                                        {popup.showCancel && (
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={hidePopup}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search and Filter */}
                    <div className="mb-4 flex items-center">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchUsers();
                            }} 
                            className="flex w-full"
                        >
                            <input
                                type="text"
                                placeholder="Search users by name or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow p-2 border rounded-l-md outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchUsers();
                                }}
                                className="ml-2 bg-gray-200 p-2 rounded-md border"
                            >
                                Clear
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3 text-left">Profile</th>
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Role</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderUsersTable()}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {users.length > 0 && (
                            <div className="p-4 flex justify-between items-center bg-gray-100">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;