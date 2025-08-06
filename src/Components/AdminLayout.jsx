
import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/inventory" className="block text-gray-700 hover:text-blue-600">Inventory</Link>
          <Link to="/users" className="block text-gray-700 hover:text-blue-600">Users</Link>
        </nav>
      </aside>

   
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button className="text-red-500 hover:underline">Logout</button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
