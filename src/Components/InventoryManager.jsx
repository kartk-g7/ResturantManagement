import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2"; 

export default function InventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", sku: "", category: "", price: "", quantity: "", lowStockThreshold: 5 });
  const [editingId, setEditingId] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInventory(items);
      setLoading(false);

      
      setTotalItems(items.length);

      
      const lowStockItems = items.filter(
        (item) => item.quantity <= (item.lowStockThreshold || 5)
      );

      if (lowStockItems.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Low Stock Alert!",
          html: lowStockItems
            .map((item) => ⁠`<b>${item.name}</b> (Qty: ${item.quantity})`⁠)
            .join("<br>"),
          confirmButtonText: "OK",
          confirmButtonColor: "#f97316",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sku) {
      Swal.fire("Error", "Name & SKU are required", "error");
      return;
    }

    const itemData = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
    };

    if (editingId) {
      await updateDoc(doc(db, "inventory", editingId), itemData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "inventory"), itemData);
    }

    setForm({ name: "", sku: "", category: "", price: "", quantity: "", lowStockThreshold: 5 });
  };

  
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "inventory", id));
        Swal.fire("Deleted!", "Item removed from inventory.", "success");
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📦 Inventory Manager</h2>

      
      <p className="mb-4 text-lg font-semibold">Total Items: {totalItems}</p>

      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <input className="border p-2 rounded" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input className="border p-2 rounded" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        <input className="border p-2 rounded" name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        <input className="border p-2 rounded" name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" />
        <input className="border p-2 rounded" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" />
        <input className="border p-2 rounded" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleChange} placeholder="Low Stock Threshold" type="number" />
        <button type="submit" className="col-span-2 md:col-span-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">SKU</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Threshold</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.sku}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">₹{item.price}</td>
                  <td className={⁠`border p-2 ${item.quantity <= (item.lowStockThreshold || 5) ? "text-red-500 font-bold" : ""}`}>
                    {item.quantity}
                    {item.quantity <= (item.lowStockThreshold || 5) && " ⚠"}
                  </td>
                  <td className="border p-2">{item.lowStockThreshold || 5}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
