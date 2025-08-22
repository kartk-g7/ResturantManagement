import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase";

const AdminLayout = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-48 bg-white shadow-md p-4 fixed h-screen top-0 left-0 z-10">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/inventory" className="block text-gray-700 hover:text-blue-600">Inventory</Link>
          <Link to="/inventory-charts" className="block text-gray-700 hover:text-blue-600">Reports</Link>
          <Link to="/suppliers" className="block text-gray-700 hover:text-blue-600">Suppliers</Link>
          <Link to="/users" className="block text-gray-700 hover:text-blue-600">Users</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 ml-48 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button className="text-red-500 hover:underline">Logout</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {React.Children.map(children, child =>
            React.cloneElement(child, { inventory, loading })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;