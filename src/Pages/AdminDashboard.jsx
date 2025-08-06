import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dash">
      <h2>Admin Dashboard</h2>
      <p>You are logged in as an Admin.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
