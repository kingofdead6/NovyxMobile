"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Upload } from "lucide-react";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/gallery`);
      setImages(res.data);
    } catch (err) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("images", file));

    try {
      await axios.post(`${API_BASE_URL}/gallery`, formData);
      toast.success("Images ajoutées avec succès");
      fetchGallery();
    } catch (err) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/gallery/${id}`);
      toast.success("Image supprimée");
      fetchGallery();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-light">Galerie Admin</h1>
        <label className="cursor-pointer bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-amber-800">
          <Upload size={24} />
          <span>Ajouter des images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploading && <p className="text-amber-700 mb-4">Upload en cours...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img._id} className="relative group rounded-3xl overflow-hidden border border-stone-200">
            <img
              src={img.image}
              alt=""
              className="w-full aspect-square object-cover"
            />
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}