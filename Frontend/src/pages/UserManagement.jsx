import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        }
    };

    // Update user role
    const handleRoleChange = async (userId, newRole) => {
        try {
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
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role');
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
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
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user');
            }
        }
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
                    >
                        <option value="normal_user">Normal User</option>
                        <option value="artist">Artist</option>
                        <option value="admin">Admin</option>
                    </select>
                </td>
                <td className="p-3">
                    <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="flex">
            <AdminNav />
            <div className="flex-1 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-6">User Management</h1>

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