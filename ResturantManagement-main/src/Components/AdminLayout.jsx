import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Users,
  LogOut,
  Settings,
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/inventory', icon: Box, label: 'Inventory' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold mb-8 text-teal-400">Admin Panel</h2>
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  }`
                }
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-8">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            {/* Dynamically update header based on route */}
            {navLinks.find(link => window.location.pathname.startsWith(link.to))?.label || 'Admin Dashboard'}
          </h1>
        </header>

        <div className="bg-white rounded-xl shadow-md p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;