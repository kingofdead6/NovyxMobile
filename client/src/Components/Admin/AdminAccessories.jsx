import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, Trash2, Edit, X } from "lucide-react";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

export default function AdminAccessories() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", brand: "", description: "", images: [] });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/accessories-categories`, { headers: authH() });
      setCategories(res.data);
    } catch { /* silent */ }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/accessories`, { headers: authH() });
      setItems(res.data);
    } catch {
      toast.error("Error loading accessories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiltered(items.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = !selectedCat || p.category?._id === selectedCat || p.category === selectedCat;
      return matchSearch && matchCat;
    }));
  }, [items, searchTerm, selectedCat]);

  const resetForm = () => {
    setForm({ name: "", category: "", price: "", stock: "", brand: "", description: "", images: [] });
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    ["name", "category", "price", "stock", "brand", "description"].forEach(k => fd.append(k, form[k]));
    form.images.filter(i => i.file).forEach(i => fd.append("images", i.file));
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/accessories/${editingId}`, fd, { headers: authH() });
        toast.success("Accessory updated");
      } else {
        await axios.post(`${API_BASE_URL}/accessories`, fd, { headers: authH() });
        toast.success("Accessory created");
      }
      resetForm(); fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally { setSaving(false); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, category: item.category?._id || item.category || "", price: item.price, stock: item.stock ?? "", brand: item.brand || "", description: item.description || "", images: item.images.map(i => ({ preview: i.url, url: i.url })) });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this accessory?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/accessories/${id}`, { headers: authH() });
      setItems(p => p.filter(x => x._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Error deleting"); }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h1 className="text-4xl sm:text-5xl font-light mb-8">Accessories</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition w-full sm:w-auto">
            <Plus size={22} /> New Accessory
          </button>
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none" />
            </div>
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="w-full sm:w-52 py-4 px-4 border border-gray-300 rounded-2xl focus:border-black outline-none">
              <option value="">All categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square bg-gray-100">
                <img src={item.images?.[0]?.url || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400">{item.category?.name || ""}</p>
                <h3 className="font-semibold text-sm line-clamp-2 mt-0.5">{item.name}</h3>
                <p className="text-base font-medium mt-1">{item.price?.toLocaleString()} DA</p>
                <p className="text-xs text-gray-400">Stock: {item.stock ?? 0}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(item)} className="flex-1 py-2.5 bg-black text-white rounded-xl text-xs font-medium"><Edit size={13} className="inline mr-1" />Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="flex-1 py-2.5 border border-red-400 text-red-600 rounded-xl text-xs font-medium"><Trash2 size={13} className="inline mr-1" />Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && !loading && <p className="text-center text-gray-500 py-20">No accessories found</p>}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex justify-center p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-lg">
              <div className="p-6 pb-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold">{editingId ? "Edit Accessory" : "New Accessory"}</h2>
                <button onClick={resetForm} className="text-2xl text-gray-400">×</button>
              </div>
              <div className="overflow-y-auto px-6 py-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-4 border rounded-2xl" />
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-4 border rounded-2xl">
                    <option value="">Category *</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="number" placeholder="Price (DA) *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="p-4 border rounded-2xl" />
                    <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="p-4 border rounded-2xl" />
                  </div>
                  <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full p-4 border rounded-2xl" />
                  <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-4 border rounded-2xl h-20 resize-y" />
                  <div>
                    <p className="font-medium mb-2">Images (max 8)</p>
                    <input type="file" multiple accept="image/*" onChange={e => { const newImgs = Array.from(e.target.files).map(f => ({ file: f, preview: URL.createObjectURL(f) })); setForm(p => ({ ...p, images: [...p.images, ...newImgs].slice(0, 8) })); }} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-2xl" />
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img.preview || img.url} className="w-full aspect-square object-cover rounded-xl" />
                          <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-4 rounded-2xl font-medium disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update" : "Create"}</button>
                    <button type="button" onClick={resetForm} className="flex-1 py-4 border rounded-2xl font-medium">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
