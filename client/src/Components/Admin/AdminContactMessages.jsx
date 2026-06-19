"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Eye } from "lucide-react";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contact`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Message deleted");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-light mb-10">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white border border-stone-200 rounded-3xl p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{msg.subject}</h3>
                <p className="text-blue-600 font-medium mt-1">{msg.name}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye size={22} />
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-stone-600">
              <p><strong>Email:</strong> {msg.email}</p>
              {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
            </div>

            <p className="mt-5 line-clamp-4 text-stone-700 leading-relaxed">
              {msg.message}
            </p>

            <p className="text-xs text-stone-500 mt-6">
              {new Date(msg.createdAt).toLocaleDateString('en-GB', {
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

      {messages.length === 0 && (
        <p className="text-center text-stone-500 py-20 text-xl">
          No contact messages yet.
        </p>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">{selectedMessage.subject}</h2>

            <div className="space-y-4 text-stone-700">
              <p><strong>From:</strong> {selectedMessage.name}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              {selectedMessage.phone && <p><strong>Phone:</strong> {selectedMessage.phone}</p>}
              <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString('en-GB')}</p>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium mb-3">Message:</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
                {selectedMessage.message}
              </p>
            </div>

            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-8 w-full py-4 bg-stone-900 text-white rounded-2xl hover:bg-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
