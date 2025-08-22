import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import AdminPage from './AdminPage';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dash">
      <h2>Admin Dashboard</h2>
      <AdminPage />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
