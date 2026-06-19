"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, X, Edit, Trash2 } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = !selectedCategory || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);

    form.images
      .filter((img) => img.file)
      .forEach((img) => formData.append("images", img.file));

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, formData);
        toast.success("Produit mis à jour");
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData);
        toast.success("Produit créé avec succès");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", category: "", price: "", description: "", images: [] });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || "",
      images: product.images.map((img) => ({ preview: img.url, url: img.url })),
    });
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImgs].slice(0, 10),
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h1 className="text-4xl sm:text-5xl font-light mb-8 text-center sm:text-left">
          Gestion des Produits
        </h1>

        {/* Controls - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition w-full sm:w-auto"
          >
            <Plus size={24} /> Nouveau Produit
          </button>

          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-56 py-4 px-5 border border-gray-300 rounded-2xl focus:border-black outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all active:scale-[0.97]"
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-base line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                <p className="text-lg font-medium mt-2">
                  {product.price.toLocaleString()} DA
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-3 bg-black text-white rounded-2xl text-sm font-medium active:bg-gray-800"
                  >
                    <Edit size={18} className="inline mr-1" /> Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Supprimer ce produit ?")) {
                        axios.delete(`${API_BASE_URL}/products/${product._id}`);
                        setProducts((p) => p.filter((x) => x._id !== product._id));
                      }
                    }}
                    className="flex-1 py-3 border border-red-500 text-red-600 rounded-2xl text-sm font-medium active:bg-red-50"
                  >
                    <Trash2 size={18} className="inline mr-1" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-20">Aucun produit trouvé</p>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
  <div className="fixed inset-0 bg-black/70 z-50 flex   justify-center p-4">
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] lg:max-h-[90vh] flex flex-col shadow-lg"
    >
      <div className="p-6 sm:p-8 pb-4 flex justify-between items-center border-b">
        <h2 className="text-2xl font-semibold">
          {editingId ? "Modifier le produit" : "Nouveau produit"}
        </h2>
        <button
          onClick={resetForm}
          className="text-3xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* 🔥 SCROLLABLE BODY */}
      <div className="overflow-y-auto px-6 sm:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Nom du produit"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-4 border rounded-2xl"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-4 border rounded-2xl"
              required
            >
              <option value="">Catégorie</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Prix (DA)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="p-4 border rounded-2xl"
              required
            />
          </div>

          <textarea
            placeholder="Description (optionnel)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-4 border rounded-2xl h-28 resize-y"
          />

          <div>
            <p className="font-medium mb-3">Images (max 10)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl"
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img.preview || img.url}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-medium text-lg active:bg-gray-800 disabled:opacity-70"
            >
              {loading
                ? "Sauvegarde..."
                : editingId
                ? "Mettre à jour"
                : "Créer le produit"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-4 border rounded-2xl font-medium text-lg"
            >
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