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

  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/repair-requests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this repair request?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/repair-requests/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Request deleted");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-light mb-10">Repair Requests</h1>

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
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              {req.preferredDate && (
                <p><strong>Preferred date:</strong> {new Date(req.preferredDate).toLocaleDateString('en-GB')}</p>
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
              {new Date(req.createdAt).toLocaleDateString('en-GB', {
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
          No repair requests yet.
        </p>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">{selectedRequest.itemName}</h2>

            <div className="space-y-4 text-stone-700">
              <p><strong>Customer:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              {selectedRequest.preferredDate && (
                <p><strong>Preferred date:</strong> {new Date(selectedRequest.preferredDate).toLocaleDateString('en-GB')}</p>
              )}
              <p><strong>Request date:</strong> {new Date(selectedRequest.createdAt).toLocaleString('en-GB')}</p>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium mb-3">Issue description:</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
                {selectedRequest.issueDescription}
              </p>
            </div>

            {selectedRequest.images && selectedRequest.images.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Attached photos:</h3>
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
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
