import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import InventoryManager from '../Components/InventoryManager';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [totalStock, setTotalStock] = useState(0);

  const logout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="dash p-6">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p>Welcome, you're logged in as <strong>{user.email}</strong></p>
      <p>Your role: <strong>{user.role}</strong></p>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-2"
      >
        Logout
      </button>

      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold">Total Stock</h3>
          <p className="text-3xl font-bold text-blue-700">{totalStock}</p>
        </div>
      </div>

      {user.role === 'admin' ? (
        <InventoryManager onTotalStockChange={setTotalStock} />
      ) : (
        <p className="mt-4 text-red-500 font-semibold">
          You do not have access to inventory management.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
