"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Eye } from "lucide-react";

export default function AdminSellRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sell-requests`);
      setRequests(res.data);
    } catch (err) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette proposition ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/sell-requests/${id}`);
      toast.success("Proposition supprimée");
      fetchRequests();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-light mb-10">Propositions de Vente</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {requests.map((req) => (
          <div key={req._id} className="bg-white border border-stone-200 rounded-3xl p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-medium">{req.itemName}</h3>
                <p className="text-blue-700 font-medium mt-1">{req.proposedPrice.toLocaleString()} DA</p>
              </div>
              <button
                onClick={() => handleDelete(req._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={22} />
              </button>
            </div>

            <p className="text-stone-600 mt-4 line-clamp-3">{req.description}</p>

            <div className="flex gap-2 mt-6">
              {req.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className="w-20 h-20 object-cover rounded-2xl cursor-pointer hover:scale-105 transition"
                  onClick={() => window.open(img.url, "_blank")}
                />
              ))}
            </div>

            <div className="mt-8 text-sm text-stone-500">
              <p><strong>{req.name}</strong> • {req.phone}</p>
              <p>{req.email}</p>
              <p className="text-xs mt-2">{new Date(req.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && <p className="text-center text-stone-500 py-20">Aucune proposition pour le moment.</p>}
    </div>
  );
}