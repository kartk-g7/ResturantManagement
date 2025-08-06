
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0,
    description: '',
  });
  const [editItemId, setEditItemId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrUpdateItem = async () => {
    if (!newItem.name) {
      alert('Product name is required');
      return;
    }

    try {
      if (editItemId) {
        await setDoc(doc(db, 'inventory', editItemId), {
          ...newItem,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'inventory'), {
          ...newItem,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setNewItem({
        name: '',
        sku: '',
        category: '',
        price: 0,
        quantity: 0,
        description: '',
      });
      setEditItemId(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to save item:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'inventory', id));
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      name: item.name,
      sku: item.sku,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      description: item.description,
    });
    setEditItemId(item.id);
    setShowAddModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📦 Inventory Manager</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          onClick={() => {
            setEditItemId(null);
            setNewItem({
              name: '',
              sku: '',
              category: '',
              price: 0,
              quantity: 0,
              description: '',
            });
            setShowAddModal(true);
          }}
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading inventory...</p>
      ) : inventory.length === 0 ? (
        <p className="text-gray-500">No items in inventory.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition border-t border-gray-200"
                >
                  <td className="px-6 py-4 text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-gray-800">${item.price?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-800">{item.quantity}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition"
                      onClick={() => handleEdit(item)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {editItemId ? 'Edit Item' : 'Add New Item'}
            </h3>
            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                type="text"
                placeholder="Product Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                type="text"
                placeholder="SKU"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                type="text"
                placeholder="Category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })
                }
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })
                }
              />
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={handleAddOrUpdateItem}
              >
                {editItemId ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
