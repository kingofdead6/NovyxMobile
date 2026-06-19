import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";

export default function RepairPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", itemName: "", issueDescription: "", preferredDate: "" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files) => {
    const newImgs = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImgs].slice(0, 6));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append("images", img.file));
    try {
      await axios.post(`${API_BASE_URL}/repair-requests`, formData);
      toast.success("Repair request submitted! We'll contact you to confirm.");
      setForm({ name: "", email: "", phone: "", itemName: "", issueDescription: "", preferredDate: "" });
      setImages([]);
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 14,
    background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
    color: "#fff", fontFamily: "'Manrope'", fontSize: 15, outline: "none",
    transition: "border-color .2s", boxSizing: "border-box",
  };
  const focus = e => (e.target.style.borderColor = "rgba(34,211,238,.6)");
  const blur = e => (e.target.style.borderColor = "rgba(255,255,255,.1)");

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 26px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 14px" }}>
            // REPAIR SERVICE
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,56px)", letterSpacing: "-.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Repair Request
          </h1>
          <p style={{ fontFamily: "'Manrope'", fontSize: 16, color: "#94A3B8", margin: 0, lineHeight: 1.65 }}>
            Cracked screen, dead battery, or any other issue — our technicians have you covered. Submit a request and we'll get your device fixed.
          </p>
        </div>

        {/* Services */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 44 }}>
          {[
            { icon: "📱", label: "Screen Repair" },
            { icon: "🔋", label: "Battery Replacement" },
            { icon: "🔌", label: "Charging Port" },
            { icon: "📷", label: "Camera Fix" },
            { icon: "🔊", label: "Speaker / Mic" },
            { icon: "💧", label: "Water Damage" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.12)", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
              <span style={{ fontSize: 22, display: "block", marginBottom: 6 }}>{icon}</span>
              <span style={{ fontFamily: "'Manrope'", fontSize: 12.5, fontWeight: 600, color: "#94A3B8" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 28, padding: "40px 36px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <input type="text" placeholder="Full Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={focus} onBlur={blur} />
            <input type="email" placeholder="Email Address *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <input type="tel" placeholder="Phone Number *" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} onFocus={focus} onBlur={blur} />
            <input type="text" placeholder="Device to Repair *" required value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Manrope'", fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>Preferred Drop-off Date</label>
            <input
              type="date"
              value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark" }} onFocus={focus} onBlur={blur}
            />
          </div>
          <textarea
            placeholder="Describe the issue in detail *" rows={6} required
            value={form.issueDescription} onChange={e => setForm({ ...form, issueDescription: e.target.value })}
            style={{ ...inputStyle, resize: "vertical", marginBottom: 24 }} onFocus={focus} onBlur={blur}
          />

          {/* Image Upload */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, margin: "0 0 12px" }}>
              Problem Photos <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: 13 }}>(recommended — up to 6)</span>
            </p>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? "rgba(34,211,238,.7)" : "rgba(255,255,255,.15)"}`,
                borderRadius: 18, padding: "36px 24px", textAlign: "center",
                background: dragOver ? "rgba(34,211,238,.05)" : "rgba(255,255,255,.02)",
                transition: "all .2s",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔧</div>
              <p style={{ fontFamily: "'Manrope'", fontSize: 14, color: "#94A3B8", margin: "0 0 14px" }}>
                Drag & drop photos of the damage, or
              </p>
              <label htmlFor="repair-upload" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 12, background: "rgba(34,211,238,.12)", border: "1px solid rgba(34,211,238,.3)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Choose Files
              </label>
              <input type="file" id="repair-upload" multiple accept="image/*" onChange={e => addFiles(e.target.files)} style={{ display: "none" }} />
            </div>

            {images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden" }}>
                    <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button" onClick={() => removeImage(i)}
                      style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,.9)", border: "none", color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "17px 32px", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg,#22D3EE,#0891b2)", color: "#031018",
              fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              boxShadow: "0 12px 32px -8px rgba(34,211,238,.6)", transition: "transform .2s,box-shadow .2s",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 18px 40px -8px rgba(34,211,238,.8)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(34,211,238,.6)"; }}
          >
            {loading ? "Submitting..." : "Submit Repair Request"}
          </button>
        </form>
      </section>
    </main>
  );
}
