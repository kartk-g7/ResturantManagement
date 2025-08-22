import React from 'react';

const stats = [
  { label: '📦 Total Items', value: 128, color: 'text-blue-600' },
  { label: '👥 Users', value: 15, color: 'text-green-600' },
  { label: '⚠️ Low Stock', value: 4, color: 'text-red-500' },
];

const AdminPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-semibold">👋 Welcome, Admin!</h1>
      <p className="text-sm text-gray-500">Here’s your dashboard overview.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium">{s.label}</h3>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>

    <div className="flex gap-4">
      <a href="/inventory" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Inventory</a>
      <a href="/users" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">Users</a>
    </div>
  </div>
);

export default AdminPage;
