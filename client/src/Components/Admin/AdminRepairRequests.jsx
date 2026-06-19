"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Eye } from "lucide-react";

export default function AdminRepairRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/repair-requests`);
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
    if (!confirm("Supprimer cette demande de réparation ?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/repair-requests/${id}`);
      toast.success("Demande supprimée");
      fetchRequests();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-light mb-10">Demandes de Réparation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {requests.map((req) => (
          <div 
            key={req._id} 
            className="bg-white border border-stone-200 rounded-3xl p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-medium">{req.itemName}</h3>
                <p className="text-blue-700 font-medium mt-1">{req.name}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye size={22} />
                </button>
                <button
                  onClick={() => handleDelete(req._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-stone-600">
              <p><strong>Email :</strong> {req.email}</p>
              <p><strong>Tél :</strong> {req.phone}</p>
              {req.preferredDate && (
                <p><strong>Date souhaitée :</strong> {new Date(req.preferredDate).toLocaleDateString('fr-FR')}</p>
              )}
            </div>

            <p className="mt-5 line-clamp-4 text-stone-700 leading-relaxed">
              {req.issueDescription}
            </p>

            {req.images && req.images.length > 0 && (
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
            )}

            <p className="text-xs text-stone-500 mt-6">
              {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <p className="text-center text-stone-500 py-20 text-xl">
          Aucune demande de réparation pour le moment.
        </p>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">{selectedRequest.itemName}</h2>
            
            <div className="space-y-4 text-stone-700">
              <p><strong>Client :</strong> {selectedRequest.name}</p>
              <p><strong>Email :</strong> {selectedRequest.email}</p>
              <p><strong>Téléphone :</strong> {selectedRequest.phone}</p>
              {selectedRequest.preferredDate && (
                <p><strong>Date préférée :</strong> {new Date(selectedRequest.preferredDate).toLocaleDateString('fr-FR')}</p>
              )}
              <p><strong>Date de demande :</strong> {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}</p>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium mb-3">Description du problème :</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
                {selectedRequest.issueDescription}
              </p>
            </div>

            {selectedRequest.images && selectedRequest.images.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Photos jointes :</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedRequest.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className="rounded-2xl cursor-pointer hover:scale-105 transition"
                      onClick={() => window.open(img.url, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedRequest(null)}
              className="mt-10 w-full py-4 bg-stone-900 text-white rounded-2xl hover:bg-black transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}