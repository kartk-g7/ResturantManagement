
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, FileText, AlertCircle, Plus } from "lucide-react";

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Item
  const addItem = () => {
    if (newItem.name && newItem.quantity) {
      setInventory([
        ...inventory,
        { ...newItem, quantity: Number(newItem.quantity) },
      ]);
      setNewItem({ name: "", quantity: "" });
    }
  };

  // Update Item (from modal)
  const updateItem = () => {
    if (selectedItem) {
      setInventory(
        inventory.map((item) =>
          item.name === selectedItem.name ? selectedItem : item
        )
      );
      setSelectedItem(null);
    }
  };

  // Delete Item
  const deleteItem = (name) => {
    setInventory(inventory.filter((item) => item.name !== name));
  };

  // Check Low Stock
  const checkLowStock = () => {
    setLowStockItems(
      inventory.filter((item) => item.quantity <= (item.lowStockThreshold || 5))
    );
  };

  // Export Inventory Report
  const exportReport = () => {
    const content = inventory
      .map((item) => `<b>${item.name}</b> (Qty: ${item.quantity})`)
      .join("\n");

    const newWindow = window.open();
    newWindow.document.write(
      `<html><head><title>Inventory Report</title></head><body><h2>Inventory Report</h2><pre>${content}</pre></body></html>`
    );
    newWindow.document.close();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Panel Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-red-800">
          📦 Inventory Management
        </h2>
      </div>

      {/* Add New Item Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Item Name"
          className="border rounded-lg p-2 flex-1"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border rounded-lg p-2 w-32"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: e.target.value })
          }
        />
        <button
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg flex items-center gap-2 px-4 py-2"
          onClick={addItem}
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        className="border rounded-lg p-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Inventory Table Card */}
      <div className="overflow-x-auto mb-6 bg-white p-4 rounded-xl shadow-md">
        <table className="border-collapse border w-full rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left font-semibold">Item Name</th>
              <th className="border p-3 text-center font-semibold">Quantity</th>
              <th className="border p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`transition ${
                  item.quantity <= 5
                    ? "bg-red-50"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="border p-3">{item.name}</td>
                <td className="border p-3 text-center relative">
                  <input
                    type="number"
                    className={`w-16 text-center border rounded-md p-1 ${
                      item.quantity <= 5
                        ? "text-red-600 font-bold animate-pulse"
                        : ""
                    }`}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = Number(e.target.value);
                      setInventory(
                        inventory.map((i) =>
                          i.name === item.name ? { ...i, quantity: newQty } : i
                        )
                      );
                    }}
                  />
                  {item.quantity <= 5 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full animate-pulse">
                      Low
                    </span>
                  )}
                </td>
                <td className="border p-3 flex justify-center gap-3">
                  <button
                    className="border border-gray-400 rounded-lg flex items-center gap-1 px-2 py-1 hover:bg-gray-100"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className="border border-red-400 bg-red-600 text-white rounded-lg flex items-center gap-1 px-2 py-1 hover:bg-red-700"
                    onClick={() => deleteItem(item.name)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Item Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Edit Item</h3>
            <input
              type="text"
              className="border rounded-lg p-2 w-full mb-3"
              value={selectedItem.name}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border rounded-lg p-2 w-full mb-3"
              value={selectedItem.quantity}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  quantity: Number(e.target.value),
                })
              }
            />
            <div className="flex justify-end gap-3">
              <button
                className="border border-gray-400 rounded-lg px-4 py-2 hover:bg-gray-100"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
                onClick={updateItem}
              >
                Update
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
        <button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
          onClick={checkLowStock}
        >
          <AlertCircle size={18} /> Check Low Stock
        </button>
        <button
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
          onClick={exportReport}
        >
          <FileText size={18} /> Export Report
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 border border-red-300 bg-red-50 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
            <AlertCircle /> Low Stock Alert
          </h3>
          <ul className="list-disc ml-6 mt-2">
            {lowStockItems.map((item, idx) => (
              <li key={idx}>
                {item.name} - Only {item.quantity} left!
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryManager;



