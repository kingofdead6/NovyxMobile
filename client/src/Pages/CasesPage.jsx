import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/cases`)
      .then((r) => setCases(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const TYPE_COLORS = {
    "Silicone": ["#8B5CF6", "#4C1D95"],
    "Leather": ["#F59E0B", "#92400E"],
    "Clear": ["#22D3EE", "#0E7490"],
    "Rugged": ["#10B981", "#065F46"],
    "Wallet": ["#EC4899", "#9D174D"],
  };

  const getColors = (type) => TYPE_COLORS[type] || ["#6C2BD9", "#4C1D95"];

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 26px 40px" }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 14px" }}>
          // CASES & COVERS
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-.03em", margin: "0 0 18px", lineHeight: 1.1 }}>
          Phone Cases
        </h1>
        <p style={{ fontFamily: "'Manrope'", fontSize: 17, color: "#94A3B8", margin: 0, maxWidth: 520, lineHeight: 1.65 }}>
          Protect your device in style. Premium cases for every phone model — silicone, leather, clear, rugged, and more.
        </p>
      </section>

      {/* Case Types */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 26px 40px" }}>
        <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, margin: "0 0 24px" }}>
          Shop by Type
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
          {Object.entries(TYPE_COLORS).map(([type, [g1, g2]]) => (
            <div
              key={type}
              onClick={() => navigate(`/products?caseType=${encodeURIComponent(type)}`)}
              style={{
                position: "relative", borderRadius: 20, cursor: "pointer",
                border: "1px solid rgba(255,255,255,.08)",
                background: "linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.01))",
                padding: "28px 24px", overflow: "hidden",
                transition: "transform .25s, border-color .25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}
            >
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 20 }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 130%,${g1},transparent 65%)`, opacity: 0.45 }} />
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg,${g1},${g2})`, filter: "blur(28px)", opacity: 0.5 }} />
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "rgba(255,255,255,.5)", display: "block", marginBottom: 10 }}>Type</span>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>{type}</h3>
                <span style={{ fontFamily: "'Manrope'", fontSize: 13, color: "rgba(255,255,255,.55)" }}>Browse →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cases Grid */}
      {!loading && cases.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 26px 40px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, margin: "0 0 24px" }}>
            Featured Cases
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
            {cases.slice(0, 8).map((item) => {
              const [g1] = getColors(item.type);
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/products?caseType=${encodeURIComponent(item.type || "")}`)}
                  style={{
                    borderRadius: 20, cursor: "pointer",
                    border: "1px solid rgba(255,255,255,.08)",
                    background: "rgba(255,255,255,.03)",
                    overflow: "hidden",
                    transition: "transform .25s, border-color .25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}
                >
                  {item.images?.[0]?.url ? (
                    <div style={{ height: 200, background: `linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src={item.images[0].url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ height: 200, background: `linear-gradient(135deg,${g1}22,rgba(255,255,255,.02))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                      📱
                    </div>
                  )}
                  <div style={{ padding: "18px 20px" }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#22D3EE", display: "block", marginBottom: 6 }}>
                      {item.type || "Case"}
                    </span>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, margin: "0 0 8px", lineHeight: 1.3 }}>{item.name}</h3>
                    {item.price && (
                      <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#22D3EE", margin: 0 }}>
                        {item.price.toLocaleString()} DA
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Loading skeletons */}
      {loading && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 26px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 300, borderRadius: 20, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", animation: "glowPulse 1.8s infinite" }} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 26px 80px" }}>
        <div
          style={{
            background: "linear-gradient(135deg,rgba(236,72,153,.1),rgba(108,43,217,.08))",
            border: "1px solid rgba(236,72,153,.2)",
            borderRadius: 28,
            padding: "48px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 30,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, margin: "0 0 10px" }}>
              Can't find your model?
            </h3>
            <p style={{ fontFamily: "'Manrope'", fontSize: 15, color: "#94A3B8", margin: 0 }}>
              Contact us and we'll source the right case for you.
            </p>
          </div>
          <button
            onClick={() => navigate("/contact")}
            style={{
              fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16,
              padding: "16px 36px", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg,#EC4899,#9D174D)", color: "#fff",
              cursor: "pointer", boxShadow: "0 12px 32px -8px rgba(236,72,153,.7)",
              transition: "transform .2s,box-shadow .2s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 18px 40px -8px rgba(236,72,153,.9)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(236,72,153,.7)"; }}
          >
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}
