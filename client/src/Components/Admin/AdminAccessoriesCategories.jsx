import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit, X } from "lucide-react";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

export default function AdminAccessoriesCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/accessories-categories`, { headers: authH() });
      setCategories(res.data);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", isActive: true });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Category name is required");
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("isActive", form.isActive);
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/accessories-categories/${editingId}`, fd, { headers: authH() });
        toast.success("Category updated");
      } else {
        await axios.post(`${API_BASE_URL}/accessories-categories`, fd, { headers: authH() });
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || "", isActive: cat.isActive });
    setImagePreview(cat.image?.url || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/accessories-categories/${id}`, { headers: authH() });
      setCategories(c => c.filter(x => x._id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "56px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(26px,4vw,44px)", color: "#fff", margin: 0 }}>Accessories Categories</h1>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8", textAlign: "center", paddingTop: 60 }}>Loading...</p>
      ) : categories.length === 0 ? (
        <p style={{ color: "#64748B", textAlign: "center", paddingTop: 60, fontSize: 20 }}>No categories yet</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: "rgba(15,23,42,.8)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, overflow: "hidden" }}>
              {cat.image?.url ? (
                <img src={cat.image.url} alt={cat.name} style={{ width: "100%", height: 130, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 130, background: "rgba(139,92,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📦</div>
              )}
              <div style={{ padding: 16 }}>
                <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#fff", margin: "0 0 4px" }}>{cat.name}</p>
                {cat.description && <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.4 }}>{cat.description}</p>}
                {!cat.isActive && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'JetBrains Mono'" }}>inactive</span>}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => handleEdit(cat)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#cbd5e1", cursor: "pointer", fontSize: 13 }}>
                    <Edit size={13} style={{ display: "inline", marginRight: 4 }} />Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#fca5a5", cursor: "pointer", fontSize: 13 }}>
                    <Trash2 size={13} style={{ display: "inline", marginRight: 4 }} />Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: "rgba(15,23,42,.98)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, width: "100%", maxWidth: 480, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0 }}>{editingId ? "Edit Category" : "New Category"}</h2>
                <button onClick={resetForm} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}><X size={22} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input required placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: 15, outline: "none" }} />
                <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: 15, outline: "none", resize: "vertical" }} />
                <div>
                  <p style={{ color: "#94A3B8", fontSize: 13, margin: "0 0 8px" }}>Image (optional)</p>
                  <input type="file" accept="image/*" onChange={e => { setImageFile(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} style={{ color: "#94A3B8", fontSize: 14 }} />
                  {imagePreview && <img src={imagePreview} alt="" style={{ width: "100%", height: 100, objectFit: "cover", marginTop: 10, borderRadius: 10 }} />}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#94A3B8", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: "#8B5CF6" }} /> Active
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={resetForm} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
