import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import InventoryManager from '../Components/InventoryManager';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="dash">
      <h2>Dashboard</h2>
      <p>Welcome, you're logged in as <strong>{user.email}</strong></p>
      <p>Your role: <strong>{user.role}</strong></p>
      <button onClick={logout}>Logout</button>

      
      {user.role === 'admin' ? (
        <InventoryManager />
      ) : (
        <p>You do not have access to inventory management.</p>
      )}
    </div>
  );
};

export default Dashboard;

