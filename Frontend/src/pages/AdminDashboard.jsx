import React from 'react';
import AdminNav from '../components/AdminNav';

function AdminDashboard() {
  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;