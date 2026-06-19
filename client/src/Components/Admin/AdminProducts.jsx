"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, X, Edit, Trash2 } from "lucide-react";

const CONDITIONS = ["new", "used", "refurbished"];
const CONDITION_LABELS = { new: "Neuf", used: "Occasion", refurbished: "Reconditionné" };
const CONDITION_COLORS = { new: "#22D3EE", used: "#F59E0B", refurbished: "#A78BFA" };

const S = {
  page: { minHeight: "100vh", padding: "56px 24px 80px" },
  inner: { maxWidth: 1280, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 },
  h1: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(28px,4vw,52px)", color: "#fff", margin: 0, letterSpacing: "-.02em" },
  addBtn: { display: "flex", alignItems: "center", gap: 9, padding: "13px 24px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(108,43,217,.35)", whiteSpace: "nowrap" },
  toolbar: { display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36 },
  searchWrap: { position: "relative", flex: "1 1 220px" },
  searchIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B", pointerEvents: "none" },
  searchInput: { width: "100%", padding: "13px 14px 13px 42px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  select: { padding: "13px 14px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", minWidth: 180 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 },
  card: { background: "rgba(15,23,42,.85)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, overflow: "hidden", transition: "transform .2s,border-color .2s,box-shadow .2s", cursor: "default" },
  cardImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", background: "rgba(139,92,246,.07)" },
  cardBody: { padding: "14px 16px 16px" },
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44`, marginRight: 4, marginTop: 3 }),
  price: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#fff", marginTop: 6, marginBottom: 0 },
  muted: { fontSize: 12, color: "#64748B", marginTop: 2 },
  actionRow: { display: "flex", gap: 8, marginTop: 12 },
  editBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px", background: "rgba(139,92,246,.15)", border: "1px solid rgba(139,92,246,.3)", color: "#A78BFA", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  delBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#FCA5A5", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0" },
  modal: { background: "#0D1526", border: "1px solid rgba(255,255,255,.1)", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 560, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 -20px 60px rgba(0,0,0,.5)" },
  modalHeader: { padding: "24px 28px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.07)" },
  modalTitle: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0 },
  closeBtn: { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#94A3B8", borderRadius: 10, padding: 6, cursor: "pointer", display: "flex" },
  formScroll: { overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 },
  input: { padding: "14px 16px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  inputFocusCss: "1px solid #8B5CF6",
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  textarea: { padding: "14px 16px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", width: "100%", minHeight: 80, resize: "vertical", boxSizing: "border-box" },
  fileZone: { padding: "18px 14px", border: "2px dashed rgba(139,92,246,.4)", borderRadius: 12, color: "#8B5CF6", fontSize: 14, cursor: "pointer", textAlign: "center" },
  thumbGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 },
  thumb: { position: "relative" },
  thumbImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 10 },
  thumbX: { position: "absolute", top: -5, right: -5, background: "#EF4444", border: "none", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 },
  submitBtn: { flex: 1, padding: "15px", background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "15px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#94A3B8", borderRadius: 12, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, cursor: "pointer" },
  btnRow: { display: "flex", gap: 12 },
  empty: { textAlign: "center", color: "#334155", fontSize: 20, paddingTop: 80, fontFamily: "'Space Grotesk'" },
  sectionLabel: { fontSize: 12, color: "#64748B", fontFamily: "'JetBrains Mono'", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8, display: "block" },
};

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

export default function AdminProducts() {
  const [phones, setPhones] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", brand: "", price: "", storage: "", ram: "", color: "", condition: "new", stock: "", description: "", images: [] });

  useEffect(() => { fetchPhones(); fetchBrands(); }, []);

  const fetchBrands = async () => {
    try { const res = await axios.get(`${API_BASE_URL}/phone-brands`); setBrands(res.data); } catch { /* silent */ }
  };

  const fetchPhones = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API_BASE_URL}/phones`); setPhones(res.data); }
    catch { toast.error("Erreur lors du chargement des téléphones"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    setFiltered(phones.filter(p => {
      const s = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const b = !selectedBrand || p.brand?._id === selectedBrand || p.brand?.name === selectedBrand;
      return s && b;
    }));
  }, [phones, searchTerm, selectedBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    ["name", "brand", "price", "storage", "ram", "color", "condition", "description"].forEach(k => fd.append(k, form[k]));
    fd.append("stock", form.stock || 0);
    form.images.filter(i => i.file).forEach(i => fd.append("images", i.file));
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      if (editingId) { await axios.put(`${API_BASE_URL}/phones/${editingId}`, fd, { headers }); toast.success("Téléphone mis à jour"); }
      else { await axios.post(`${API_BASE_URL}/phones`, fd, { headers }); toast.success("Téléphone créé"); }
      resetForm(); fetchPhones();
    } catch (err) { toast.error(err.response?.data?.message || "Erreur"); }
    finally { setSaving(false); }
  };

  const resetForm = () => { setForm({ name: "", brand: "", price: "", storage: "", ram: "", color: "", condition: "new", stock: "", description: "", images: [] }); setEditingId(null); setShowModal(false); };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, brand: p.brand?._id || p.brand || "", price: p.price, storage: p.storage || "", ram: p.ram || "", color: p.color || "", condition: p.condition || "new", stock: p.stock ?? "", description: p.description || "", images: p.images.map(i => ({ preview: i.url, url: i.url })) });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce téléphone ?")) return;
    try { await axios.delete(`${API_BASE_URL}/phones/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } }); setPhones(p => p.filter(x => x._id !== id)); toast.success("Supprimé"); }
    catch { toast.error("Erreur"); }
  };

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={S.header}>
          <h1 style={S.h1}>Téléphones</h1>
          <button style={S.addBtn} onClick={() => setShowModal(true)}><Plus size={20} /> Nouveau</button>
        </div>

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <Search style={S.searchIcon} size={17} />
            <input style={S.searchInput} placeholder="Rechercher un téléphone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select style={S.select} value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
            <option value="">Toutes les marques</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        {filtered.length === 0 && !loading && <p style={S.empty}>Aucun téléphone trouvé</p>}

        <div style={S.grid}>
          {filtered.map((phone, i) => (
            <motion.div key={phone._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={S.card}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(139,92,246,.35)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.boxShadow = ""; }}>
              <img src={phone.images?.[0]?.url || "/placeholder.jpg"} alt={phone.name} style={S.cardImg} />
              <div style={S.cardBody}>
                <p style={{ fontSize: 11, color: "#6D28D9", fontFamily: "'JetBrains Mono'", margin: "0 0 4px", fontWeight: 600 }}>{phone.brand?.name?.toUpperCase()}</p>
                <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: "#E2E8F0", margin: 0, lineHeight: 1.3 }}>{phone.name}</p>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap" }}>
                  {phone.storage && <span style={S.badge("#22D3EE")}>{phone.storage}</span>}
                  {phone.ram && <span style={S.badge("#A78BFA")}>{phone.ram}</span>}
                  {phone.condition !== "new" && <span style={S.badge(CONDITION_COLORS[phone.condition])}>{CONDITION_LABELS[phone.condition]}</span>}
                </div>
                <p style={S.price}>{phone.price?.toLocaleString()} DA</p>
                <p style={S.muted}>Stock: {phone.stock ?? 0}</p>
                <div style={S.actionRow}>
                  <button style={S.editBtn} onClick={() => handleEdit(phone)}><Edit size={13} /> Modifier</button>
                  <button style={S.delBtn} onClick={() => handleDelete(phone._id)}><Trash2 size={13} /> Suppr.</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div style={S.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div style={S.modal} initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}>
              <div style={S.modalHeader}>
                <h2 style={S.modalTitle}>{editingId ? "Modifier le téléphone" : "Nouveau téléphone"}</h2>
                <button style={S.closeBtn} onClick={resetForm}><X size={18} /></button>
              </div>
              <div style={S.formScroll}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input required placeholder="Nom du téléphone *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={S.input} />
                  <select required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} style={S.input}>
                    <option value="">Marque *</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                  <div style={S.row2}>
                    <input required type="number" placeholder="Prix (DA) *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={S.input} />
                    <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={S.input} />
                  </div>
                  <div style={S.row2}>
                    <input placeholder="Stockage (ex: 128 Go)" value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} style={S.input} />
                    <input placeholder="RAM (ex: 8 Go)" value={form.ram} onChange={e => setForm({ ...form, ram: e.target.value })} style={S.input} />
                  </div>
                  <div style={S.row2}>
                    <input placeholder="Couleur" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={S.input} />
                    <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} style={S.input}>
                      {CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Description (optionnel)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={S.textarea} />

                  <div>
                    <span style={S.sectionLabel}>Images (max 10)</span>
                    <label style={S.fileZone}>
                      <input type="file" multiple accept="image/*" style={{ display: "none" }}
                        onChange={e => { const imgs = Array.from(e.target.files).map(f => ({ file: f, preview: URL.createObjectURL(f) })); setForm(p => ({ ...p, images: [...p.images, ...imgs].slice(0, 10) })); }} />
                      + Ajouter des images
                    </label>
                    {form.images.length > 0 && (
                      <div style={S.thumbGrid}>
                        {form.images.map((img, i) => (
                          <div key={i} style={S.thumb}>
                            <img src={img.preview || img.url} style={S.thumbImg} />
                            <button type="button" style={S.thumbX} onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}><X size={11} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={S.btnRow}>
                    <button type="submit" disabled={saving} style={{ ...S.submitBtn, opacity: saving ? 0.7 : 1 }}>{saving ? "Sauvegarde..." : editingId ? "Mettre à jour" : "Créer"}</button>
                    <button type="button" onClick={resetForm} style={S.cancelBtn}>Annuler</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
