import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";

export default function SellPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", itemName: "", description: "", proposedPrice: "" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files) => {
    const newImgs = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImgs].slice(0, 8));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error("Please upload at least one photo."); return; }
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(img => formData.append("images", img.file));
    try {
      await axios.post(`${API_BASE_URL}/sell-requests`, formData);
      toast.success("Sell request submitted! We'll contact you with an offer.");
      setForm({ name: "", email: "", phone: "", itemName: "", description: "", proposedPrice: "" });
      setImages([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit. Please try again.");
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
  const focus = e => (e.target.style.borderColor = "rgba(139,92,246,.6)");
  const blur = e => (e.target.style.borderColor = "rgba(255,255,255,.1)");

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 26px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 14px" }}>
            // SELL YOUR DEVICE
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,56px)", letterSpacing: "-.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Sell Us Your Phone
          </h1>
          <p style={{ fontFamily: "'Manrope'", fontSize: 16, color: "#94A3B8", margin: 0, lineHeight: 1.65 }}>
            Get instant cash for your old device. Fill in the details below and we'll get back to you with a fair offer.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 44 }}>
          {[
            { n: "01", title: "Submit Details", desc: "Tell us about your device" },
            { n: "02", title: "Get an Offer", desc: "We review and send a price" },
            { n: "03", title: "Get Paid", desc: "Cash in hand, fast" },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "20px 18px" }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#8B5CF6", display: "block", marginBottom: 8 }}>{n}</span>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{title}</p>
              <p style={{ fontFamily: "'Manrope'", fontSize: 12.5, color: "#94A3B8", margin: 0 }}>{desc}</p>
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
            <input type="text" placeholder="Device Name *" required value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <input
            type="number" placeholder="Your Asking Price (DA) *" required
            value={form.proposedPrice} onChange={e => setForm({ ...form, proposedPrice: e.target.value })}
            style={{ ...inputStyle, marginBottom: 16 }} onFocus={focus} onBlur={blur}
          />
          <textarea
            placeholder="Describe your device — condition, storage, color, accessories included... *" rows={5} required
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, resize: "vertical", marginBottom: 24 }} onFocus={focus} onBlur={blur}
          />

          {/* Image Upload */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, margin: "0 0 12px" }}>
              Photos <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: 13 }}>(required — up to 8)</span>
            </p>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? "rgba(139,92,246,.7)" : "rgba(255,255,255,.15)"}`,
                borderRadius: 18, padding: "36px 24px", textAlign: "center",
                background: dragOver ? "rgba(139,92,246,.06)" : "rgba(255,255,255,.02)",
                transition: "all .2s", cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>📷</div>
              <p style={{ fontFamily: "'Manrope'", fontSize: 14, color: "#94A3B8", margin: "0 0 14px" }}>
                Drag & drop photos here, or
              </p>
              <label htmlFor="sell-upload" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 12, background: "rgba(139,92,246,.2)", border: "1px solid rgba(139,92,246,.4)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Choose Files
              </label>
              <input type="file" id="sell-upload" multiple accept="image/*" onChange={e => addFiles(e.target.files)} style={{ display: "none" }} />
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
              background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff",
              fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              boxShadow: "0 12px 32px -8px rgba(108,43,217,.8)", transition: "transform .2s,box-shadow .2s",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 18px 40px -8px rgba(108,43,217,.9)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(108,43,217,.8)"; }}
          >
            {loading ? "Submitting..." : "Submit Sell Request"}
          </button>
        </form>
      </section>
    </main>
  );
}
