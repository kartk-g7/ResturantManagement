// import React from 'react';
// import { auth } from '../firebase';
// import { useNavigate } from 'react-router-dom';
// import AdminPage from './AdminPage';

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const logout = async () => {
//     await auth.signOut();
//     navigate('/login');
//   };

//   return (
//     <div className="dash">
//       <h2>Admin Dashboard</h2>
//       <AdminPage />
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default AdminDashboard;





import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import { LogOut } from "lucide-react"; // nice logout icon

const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Manage Your Admin Panel
          </h2>
          <AdminPage />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
