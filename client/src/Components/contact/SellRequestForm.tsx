"use client";

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

export default function SellRequestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    itemName: "",
    description: "",
    proposedPrice: "",
  });
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 8));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Veuillez uploader au moins une image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach(img => formData.append("images", img.file));

    try {
      await axios.post(`${API_BASE_URL}/sell-requests`, formData);
      toast.success("Proposition envoyée avec succès !");
      setForm({ name: "", email: "", phone: "", itemName: "", description: "", proposedPrice: "" });
      setImages([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light">Vendez-nous votre article</h2>
        <p className="text-stone-600 mt-2">Coffres-forts, portes blindées, etc.</p>
      </div>

      {/* Same fields as your original code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input type="text" placeholder="Votre nom complet *" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
        <input type="email" placeholder="Votre email *" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input type="tel" placeholder="Numéro de téléphone *" required value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
        <input type="text" placeholder="Nom de l'article *" required value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
      </div>

      <input type="number" placeholder="Prix proposé (DA) *" required value={form.proposedPrice}
        onChange={(e) => setForm({ ...form, proposedPrice: e.target.value })}
        className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />

      <textarea placeholder="Description détaillée (état, marque, année...)" rows={5} required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none resize-y" />

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">Photos de l'article *</label>
        <div className="border-2 border-dashed border-stone-300 rounded-3xl p-8 text-center hover:border-blue-700 transition cursor-pointer">
          <Upload className="mx-auto w-10 h-10 text-stone-400" />
          <p className="mt-3 text-stone-600">Cliquez ou glissez vos images</p>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="sell-upload" />
          <label htmlFor="sell-upload" className="mt-4 inline-block px-6 py-3 bg-stone-900 text-white rounded-2xl cursor-pointer hover:bg-blue-800">
            Choisir des fichiers
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-6">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img.preview} alt="" className="w-full aspect-square object-cover rounded-2xl" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-6 bg-black hover:bg-blue-800 text-white text-xl font-medium rounded-3xl transition disabled:opacity-70">
        {loading ? "Envoi en cours..." : "Envoyer ma proposition"}
      </button>
    </form>
  );
}