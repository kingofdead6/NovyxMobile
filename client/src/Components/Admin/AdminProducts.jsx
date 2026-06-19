"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, X, Edit, Trash2 } from "lucide-react";

const CONDITIONS = ["new", "used", "refurbished"];

export default function AdminProducts() {
  const [phones, setPhones] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "", brand: "", price: "", storage: "", ram: "",
    color: "", condition: "new", stock: "", description: "", images: [],
  });

  useEffect(() => {
    fetchPhones();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/phone-brands`);
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPhones = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/phones`);
      setPhones(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des téléphones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const result = phones.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBrand = !selectedBrand || p.brand?._id === selectedBrand || p.brand?.name === selectedBrand;
      return matchSearch && matchBrand;
    });
    setFiltered(result);
  }, [phones, searchTerm, selectedBrand]);

  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("price", form.price);
    formData.append("storage", form.storage);
    formData.append("ram", form.ram);
    formData.append("color", form.color);
    formData.append("condition", form.condition);
    formData.append("stock", form.stock || 0);
    formData.append("description", form.description);
    form.images.filter((img) => img.file).forEach((img) => formData.append("images", img.file));

    const headers = { Authorization: `Bearer ${getToken()}` };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/phones/${editingId}`, formData, { headers });
        toast.success("Téléphone mis à jour");
      } else {
        await axios.post(`${API_BASE_URL}/phones`, formData, { headers });
        toast.success("Téléphone créé avec succès");
      }
      resetForm();
      fetchPhones();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", brand: "", price: "", storage: "", ram: "", color: "", condition: "new", stock: "", description: "", images: [] });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (phone) => {
    setEditingId(phone._id);
    setForm({
      name: phone.name,
      brand: phone.brand?._id || phone.brand || "",
      price: phone.price,
      storage: phone.storage || "",
      ram: phone.ram || "",
      color: phone.color || "",
      condition: phone.condition || "new",
      stock: phone.stock ?? "",
      description: phone.description || "",
      images: phone.images.map((img) => ({ preview: img.url, url: img.url })),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce téléphone ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/phones/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPhones((p) => p.filter((x) => x._id !== id));
      toast.success("Téléphone supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImgs].slice(0, 10) }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h1 className="text-4xl sm:text-5xl font-light mb-8 text-center sm:text-left">
          Gestion des Téléphones
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition w-full sm:w-auto"
          >
            <Plus size={24} /> Nouveau Téléphone
          </button>

          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full sm:w-56 py-4 px-5 border border-gray-300 rounded-2xl focus:border-black outline-none"
            >
              <option value="">Toutes les marques</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((phone) => (
            <div key={phone._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-[0.97]">
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={phone.images?.[0]?.url || "/placeholder.jpg"}
                  alt={phone.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{phone.brand?.name || ""}</p>
                <h3 className="font-semibold text-base line-clamp-2 leading-tight">{phone.name}</h3>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {phone.storage && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{phone.storage}</span>}
                  {phone.ram && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{phone.ram}</span>}
                  {phone.condition !== "new" && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{phone.condition}</span>}
                </div>
                <p className="text-lg font-medium mt-2">{phone.price.toLocaleString()} DA</p>
                <p className="text-xs text-gray-400">Stock: {phone.stock ?? 0}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(phone)}
                    className="flex-1 py-3 bg-black text-white rounded-2xl text-sm font-medium active:bg-gray-800"
                  >
                    <Edit size={16} className="inline mr-1" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(phone._id)}
                    className="flex-1 py-3 border border-red-500 text-red-600 rounded-2xl text-sm font-medium active:bg-red-50"
                  >
                    <Trash2 size={16} className="inline mr-1" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-20">Aucun téléphone trouvé</p>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex justify-center p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-lg"
            >
              <div className="p-6 sm:p-8 pb-4 flex justify-between items-center border-b">
                <h2 className="text-2xl font-semibold">
                  {editingId ? "Modifier le téléphone" : "Nouveau téléphone"}
                </h2>
                <button onClick={resetForm} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="overflow-y-auto px-6 sm:px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text" placeholder="Nom du téléphone *" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-4 border rounded-2xl"
                  />

                  <select
                    required value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-4 border rounded-2xl"
                  >
                    <option value="">Marque *</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number" placeholder="Prix (DA) *" required
                      value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="p-4 border rounded-2xl"
                    />
                    <input
                      type="number" placeholder="Stock"
                      value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="p-4 border rounded-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text" placeholder="Stockage (ex: 128 Go)"
                      value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })}
                      className="p-4 border rounded-2xl"
                    />
                    <input
                      type="text" placeholder="RAM (ex: 8 Go)"
                      value={form.ram} onChange={(e) => setForm({ ...form, ram: e.target.value })}
                      className="p-4 border rounded-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text" placeholder="Couleur"
                      value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="p-4 border rounded-2xl"
                    />
                    <select
                      value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      className="p-4 border rounded-2xl"
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    placeholder="Description (optionnel)"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-4 border rounded-2xl h-24 resize-y"
                  />

                  <div>
                    <p className="font-medium mb-3">Images (max 10)</p>
                    <input
                      type="file" multiple accept="image/*" onChange={handleImageUpload}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl"
                    />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img.preview || img.url} className="w-full aspect-square object-cover rounded-2xl" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-4 rounded-2xl font-medium text-lg active:bg-gray-800 disabled:opacity-70">
                      {loading ? "Sauvegarde..." : editingId ? "Mettre à jour" : "Créer le téléphone"}
                    </button>
                    <button type="button" onClick={resetForm} className="flex-1 py-4 border rounded-2xl font-medium text-lg">
                      Annuler
                    </button>
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
