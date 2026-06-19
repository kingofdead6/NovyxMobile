"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, Trash2, X, Upload } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // New state for button loading
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      return toast.error("Le nom de la catégorie est requis");
    }

    setIsCreating(true);   // ← Start loading state

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", newCategoryName.trim());
      if (newCategoryDescription.trim()) {
        formData.append("description", newCategoryDescription.trim());
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await axios.post(`${API_BASE_URL}/categories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCategories([...categories, res.data]);
      resetForm();
      setShowAddModal(false);
      toast.success("Catégorie ajoutée avec succès");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout de la catégorie");
    } finally {
      setIsCreating(false);   // ← Stop loading state (whether success or error)
    }
  };

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryDescription("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success("Catégorie supprimée");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8 px-4 mt-14"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-stone-950">
              Gestion des Catégories
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Ajoutez, modifiez et gérez vos catégories avec images
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-stone-900 text-white font-medium rounded-2xl hover:bg-blue-700 transition"
            >
              <Plus size={24} />
              Ajouter une catégorie
            </button>

            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-stone-300 rounded-2xl focus:border-stone-900 outline-none"
              />
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-stone-500">Chargement...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-stone-400">Aucune catégorie trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category._id}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all relative"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    {category.image?.url ? (
                      <motion.img
                        src={category.image.url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                        Pas d'image disponible
                      </div>
                    )}

                    <motion.div
                      className="absolute inset-0 bg-black/20"
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-stone-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-stone-600 mt-2 line-clamp-2">{category.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(category._id, category.name)}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Category Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Nouvelle Catégorie</h2>
                    <button 
                      onClick={() => { setShowAddModal(false); resetForm(); }} 
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X size={28} />
                    </button>
                  </div>

                  <form onSubmit={handleAddCategory} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Nom de la catégorie</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-5 py-4 border border-stone-300 rounded-2xl focus:border-stone-900 outline-none"
                        placeholder="Ex: Coffres-forts"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Description (optionnel)</label>
                      <textarea
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        className="w-full px-5 py-4 border border-stone-300 rounded-2xl focus:border-stone-900 outline-none h-24 resize-y"
                        placeholder="Description de la catégorie..."
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">Image de la catégorie</label>
                      <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:border-stone-400 transition">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          id="category-image"
                          disabled={isCreating}
                        />
                        <label htmlFor="category-image" className="cursor-pointer flex flex-col items-center">
                          <Upload size={40} className="text-stone-400 mb-3" />
                          <span className="text-sm text-stone-600">Cliquez pour ajouter une image</span>
                          <span className="text-xs text-stone-500 mt-1">(Recommandé: 800x600px)</span>
                        </label>
                      </div>

                      {imagePreview && (
                        <div className="mt-4 relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                          <button
                            type="button"
                            onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                            disabled={isCreating}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-medium hover:bg-blue-700 transition disabled:bg-stone-400 flex items-center justify-center gap-2"
                        disabled={isCreating || !newCategoryName.trim()}
                      >
                        {isCreating ? (
                          <>
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            Création en cours...
                          </>
                        ) : (
                          "Créer la catégorie"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => { setShowAddModal(false); resetForm(); }}
                        className="flex-1 py-4 border border-stone-300 rounded-2xl font-medium hover:bg-stone-100 transition"
                        disabled={isCreating}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}