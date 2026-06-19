"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Eye, X, Tag, User, Phone, Mail, Calendar } from "lucide-react";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const S = {
  page: { minHeight: "100vh", padding: "56px 24px 80px" },
  inner: { maxWidth: 1280, margin: "0 auto" },
  h1: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(28px,4vw,52px)", color: "#fff", margin: "0 0 36px", letterSpacing: "-.02em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 },
  card: { background: "rgba(15,23,42,.85)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s, box-shadow .2s" },
  imgStrip: { display: "flex", gap: 6, padding: "14px 14px 0" },
  thumb: { width: 72, height: 72, objectFit: "cover", borderRadius: 10, cursor: "pointer", flexShrink: 0, transition: "transform .2s" },
  thumbPlaceholder: { width: 72, height: 72, borderRadius: 10, background: "rgba(139,92,246,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  body: { padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  itemName: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#E2E8F0", margin: 0, lineHeight: 1.3 },
  price: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#22D3EE", margin: 0 },
  desc: { fontSize: 13, color: "#94A3B8", lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },
  meta: { display: "flex", flexDirection: "column", gap: 4, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.06)" },
  metaRow: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#64748B" },
  metaVal: { color: "#CBD5E1" },
  actions: { display: "flex", gap: 8, marginTop: 4 },
  viewBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "rgba(34,211,238,.1)", border: "1px solid rgba(34,211,238,.25)", color: "#22D3EE", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  delBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#FCA5A5", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  empty: { textAlign: "center", color: "#334155", fontSize: 20, paddingTop: 80, fontFamily: "'Space Grotesk'" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#0D1526", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.6)" },
  modalHeader: { padding: "22px 26px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.07)", flexShrink: 0 },
  modalTitle: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: "#fff", margin: 0 },
  closeBtn: { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#94A3B8", borderRadius: 10, padding: 6, cursor: "pointer", display: "flex" },
  modalBody: { overflowY: "auto", padding: "22px 26px", display: "flex", flexDirection: "column", gap: 18 },
  modalPrice: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, color: "#22D3EE" },
  sectionLabel: { fontSize: 11, color: "#64748B", fontFamily: "'JetBrains Mono'", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 },
  modalDesc: { fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  modalImgGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  modalImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12, cursor: "pointer", transition: "transform .2s" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  infoBox: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "12px 14px" },
  infoLabel: { fontSize: 11, color: "#64748B", fontFamily: "'JetBrains Mono'", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 },
  infoVal: { fontSize: 14, color: "#E2E8F0", fontWeight: 500 },
};

export default function AdminSellRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sell-requests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRequests(res.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this sell request?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/sell-requests/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Request deleted");
      setRequests(r => r.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94A3B8", fontSize: 18, fontFamily: "'Space Grotesk'" }}>Loading...</p>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <h1 style={S.h1}>Sell Requests</h1>

        {requests.length === 0 ? (
          <p style={S.empty}>No sell requests yet.</p>
        ) : (
          <div style={S.grid}>
            {requests.map((req, i) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={S.card}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,.25)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.boxShadow = ""; }}
              >
                {/* Image strip */}
                {req.images?.length > 0 && (
                  <div style={S.imgStrip}>
                    {req.images.slice(0, 4).map((img, j) => (
                      <img
                        key={j}
                        src={img.url}
                        alt=""
                        style={S.thumb}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.currentTarget.style.transform = ""}
                        onClick={() => window.open(img.url, "_blank")}
                      />
                    ))}
                    {req.images.length > 4 && (
                      <div style={{ ...S.thumbPlaceholder }}>
                        <span style={{ color: "#64748B", fontSize: 13, fontWeight: 600 }}>+{req.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={S.body}>
                  {/* Title + price */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <h3 style={S.itemName}>{req.itemName}</h3>
                    <span style={{ ...S.price, fontSize: 16, whiteSpace: "nowrap" }}>{req.proposedPrice?.toLocaleString()} DA</span>
                  </div>

                  {/* Description */}
                  {req.description && <p style={S.desc}>{req.description}</p>}

                  {/* Meta */}
                  <div style={S.meta}>
                    <div style={S.metaRow}><User size={13} /><span style={S.metaVal}>{req.name}</span></div>
                    <div style={S.metaRow}><Phone size={13} /><span style={S.metaVal}>{req.phone}</span></div>
                    <div style={S.metaRow}><Mail size={13} /><span style={S.metaVal}>{req.email}</span></div>
                    <div style={S.metaRow}><Calendar size={13} /><span>{new Date(req.createdAt).toLocaleDateString('en-GB')}</span></div>
                  </div>

                  {/* Actions */}
                  <div style={S.actions}>
                    <button style={S.viewBtn} onClick={() => setSelected(req)}><Eye size={14} /> View</button>
                    <button style={S.delBtn} onClick={() => handleDelete(req._id)}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div style={S.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div style={S.modal} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}>

              <div style={S.modalHeader}>
                <h2 style={S.modalTitle}>{selected.itemName}</h2>
                <button style={S.closeBtn} onClick={() => setSelected(null)}><X size={18} /></button>
              </div>

              <div style={S.modalBody}>
                {/* Price */}
                <div>
                  <p style={S.sectionLabel}>Proposed price</p>
                  <p style={S.modalPrice}>{selected.proposedPrice?.toLocaleString()} DA</p>
                </div>

                {/* Contact info */}
                <div style={S.infoGrid}>
                  <div style={S.infoBox}>
                    <p style={S.infoLabel}>Name</p>
                    <p style={S.infoVal}>{selected.name}</p>
                  </div>
                  <div style={S.infoBox}>
                    <p style={S.infoLabel}>Phone</p>
                    <p style={S.infoVal}>{selected.phone}</p>
                  </div>
                  <div style={{ ...S.infoBox, gridColumn: "1 / -1" }}>
                    <p style={S.infoLabel}>Email</p>
                    <p style={S.infoVal}>{selected.email}</p>
                  </div>
                  <div style={{ ...S.infoBox, gridColumn: "1 / -1" }}>
                    <p style={S.infoLabel}>Submitted</p>
                    <p style={S.infoVal}>{new Date(selected.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>

                {/* Description */}
                {selected.description && (
                  <div>
                    <p style={S.sectionLabel}>Description</p>
                    <p style={S.modalDesc}>{selected.description}</p>
                  </div>
                )}

                {/* Images */}
                {selected.images?.length > 0 && (
                  <div>
                    <p style={S.sectionLabel}>Photos ({selected.images.length})</p>
                    <div style={S.modalImgGrid}>
                      {selected.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt=""
                          style={S.modalImg}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                          onMouseLeave={e => e.currentTarget.style.transform = ""}
                          onClick={() => window.open(img.url, "_blank")}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete */}
                <button
                  style={{ ...S.delBtn, padding: "13px", borderRadius: 12, fontSize: 14 }}
                  onClick={() => handleDelete(selected._id)}
                >
                  <Trash2 size={15} /> Delete Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
