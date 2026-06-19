import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit, X } from "lucide-react";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

export default function AdminPhoneBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", isActive: true });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/phone-brands`, { headers: authH() });
      setBrands(res.data);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const resetForm = () => {
    setForm({ name: "", isActive: true });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Brand name is required");
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("isActive", form.isActive);
    if (logoFile) fd.append("logo", logoFile);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/phone-brands/${editingId}`, fd, { headers: authH() });
        toast.success("Brand updated");
      } else {
        await axios.post(`${API_BASE_URL}/phone-brands`, fd, { headers: authH() });
        toast.success("Brand created");
      }
      resetForm();
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving brand");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setForm({ name: brand.name, isActive: brand.isActive });
    setLogoPreview(brand.logo?.url || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/phone-brands/${id}`, { headers: authH() });
      setBrands(b => b.filter(x => x._id !== id));
      toast.success("Brand deleted");
    } catch {
      toast.error("Error deleting brand");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "56px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(28px,4vw,48px)", color: "#fff", margin: 0 }}>Phone Brands</h1>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          <Plus size={20} /> Add Brand
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8", textAlign: "center", paddingTop: 60 }}>Loading...</p>
      ) : brands.length === 0 ? (
        <p style={{ color: "#64748B", textAlign: "center", paddingTop: 60, fontSize: 20 }}>No brands yet</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 18 }}>
          {brands.map(brand => (
            <div key={brand._id} style={{ background: "rgba(15,23,42,.8)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {brand.logo?.url ? (
                <img src={brand.logo.url} alt={brand.name} style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "rgba(139,92,246,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#8B5CF6" }}>
                  {brand.name[0]}
                </div>
              )}
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#fff", margin: 0 }}>{brand.name}</p>
              {!brand.isActive && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'JetBrains Mono'" }}>inactive</span>}
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <button onClick={() => handleEdit(brand)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#cbd5e1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}>
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(brand._id)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#fca5a5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: "rgba(15,23,42,.98)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, width: "100%", maxWidth: 460, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0 }}>{editingId ? "Edit Brand" : "New Brand"}</h2>
                <button onClick={resetForm} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}><X size={22} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <input
                  required placeholder="Brand name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: 16, outline: "none" }}
                />
                <div>
                  <p style={{ color: "#94A3B8", fontSize: 13, margin: "0 0 8px" }}>Logo (optional)</p>
                  <input type="file" accept="image/*" onChange={e => { setLogoFile(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])); }}
                    style={{ color: "#94A3B8", fontSize: 14 }} />
                  {logoPreview && <img src={logoPreview} alt="" style={{ width: 60, height: 60, objectFit: "contain", marginTop: 10, borderRadius: 10 }} />}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#94A3B8", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: "#8B5CF6" }} />
                  Active
                </label>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={resetForm} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
