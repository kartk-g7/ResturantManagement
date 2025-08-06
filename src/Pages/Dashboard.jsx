import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dash">
      <h2>Client Dashboard</h2>
      <p>Welcome, you're logged in as a client.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
