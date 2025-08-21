import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", contact: "", email: "", orderHistory: "" });
  const [editingId, setEditingId] = useState(null);
  const [totalSuppliers, setTotalSuppliers] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "suppliers"), (snapshot) => {
      const supplierItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuppliers(supplierItems);
      setLoading(false);
      setTotalSuppliers(supplierItems.length);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      Swal.fire("Error", "Supplier name is required", "error");
      return;
    }

    const supplierData = {
      name: form.name,
      contact: form.contact,
      email: form.email,
      orderHistory: form.orderHistory,
    };

    if (editingId) {
      await updateDoc(doc(db, "suppliers", editingId), supplierData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "suppliers"), supplierData);
    }

    setForm({ name: "", contact: "", email: "", orderHistory: "" });
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This supplier will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "suppliers", id));
        Swal.fire("Deleted!", "Supplier removed from records.", "success");
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🤝 Supplier Manager</h2>
      <p className="mb-4 text-lg font-semibold">Total Suppliers: {totalSuppliers}</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input className="border p-2 rounded" name="name" value={form.name} onChange={handleChange} placeholder="Supplier Name" />
        <input className="border p-2 rounded" name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Person" />
        <input className="border p-2 rounded" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
        <input className="border p-2 rounded" name="orderHistory" value={form.orderHistory} onChange={handleChange} placeholder="Order History" />
        <button type="submit" className="col-span-2 md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {editingId ? "Update Supplier" : "Add Supplier"}
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
                <th className="border p-2">Contact</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Order History</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.contact}</td>
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2">{item.orderHistory}</td>
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