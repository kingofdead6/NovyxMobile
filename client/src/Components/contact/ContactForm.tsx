"use client";

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/contact`, form);
      toast.success("Message envoyé avec succès ! Nous vous répondrons bientôt.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light">Contactez-nous</h2>
        <p className="text-stone-600 mt-2">Nous sommes à votre écoute</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input type="text" placeholder="Votre nom complet *" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
        <input type="email" placeholder="Votre email *" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input type="tel" placeholder="Téléphone" 
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
        <input type="text" placeholder="Sujet *" required
          value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none" />
      </div>

      <textarea placeholder="Votre message *" rows={8} required
        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full p-5 border border-stone-200 rounded-2xl focus:border-black outline-none resize-y" />

      <button type="submit" disabled={loading}
        className="w-full py-6 bg-black hover:bg-blue-800 text-white text-xl font-medium rounded-3xl transition">
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}