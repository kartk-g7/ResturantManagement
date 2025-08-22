import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import InventoryCharts from './Components/InventoryCharts';
import SupplierManager from './Components/SupplierManager';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/AdminDashboard';
import Unauthorized from './Pages/Unauthorized';
import InventoryManager from './Components/InventoryManager';
import AdminLayout from './Components/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <InventoryManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-charts"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <InventoryCharts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <SupplierManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;