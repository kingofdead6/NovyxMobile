import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const BRAND_GRADIENTS = [
  ["#F59E0B", "#92400E"],
  ["#6C2BD9", "#4C1D95"],
  ["#0EA5E9", "#0369A1"],
  ["#10B981", "#065F46"],
  ["#EC4899", "#9D174D"],
  ["#22D3EE", "#0E7490"],
];

export default function PhonesPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/phone-brands`)
      .then((r) => setBrands(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 26px 40px" }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 14px" }}>
          // SMARTPHONES
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-.03em", margin: "0 0 18px", lineHeight: 1.1 }}>
          Shop Phones
        </h1>
        <p style={{ fontFamily: "'Manrope'", fontSize: 17, color: "#94A3B8", margin: 0, maxWidth: 520, lineHeight: 1.65 }}>
          Original smartphones from the world's top brands. Best prices, guaranteed authenticity, fast delivery across Algeria.
        </p>
      </section>

      {/* Brand Grid */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 26px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, margin: 0 }}>
            Shop by Brand
          </h2>
          <button
            onClick={() => navigate("/phones/all")}
            style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: 14, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", transition: "color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94A3B8")}
          >
            View all phones →
          </button>
        </div>

        {loading ? (
          <div className="nv-brand-row">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: 200, height: 280, borderRadius: 24, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", animation: "glowPulse 1.8s infinite" }} />
            ))}
          </div>
        ) : (
          <div className="nv-brand-row">
            {brands.map((brand, idx) => {
              const [g1, g2] = BRAND_GRADIENTS[idx % BRAND_GRADIENTS.length];
              return (
                <div
                  key={brand._id}
                  className="nv-brand-card"
                  onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
                  style={{ position: "relative", borderRadius: 24, cursor: "pointer", border: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.01))" }}
                >
                  <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", zIndex: 0 }}>
                    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 120%,${g1},transparent 70%)`, opacity: 0.55 }} />
                    <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `linear-gradient(135deg,${g1},${g2})`, filter: "blur(34px)", opacity: 0.6, animation: "blob 12s ease-in-out infinite" }} />
                  </div>
                  {brand.logo?.url && (
                    <img src={brand.logo.url} alt={brand.name} className="nv-brand-logo" />
                  )}
                  <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 22 }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "rgba(255,255,255,.6)" }}>Brand</span>
                    <div>
                      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>{brand.name}</h3>
                      {brand.description && (
                        <p style={{ fontFamily: "'Manrope'", fontSize: 13, color: "rgba(255,255,255,.6)", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* All Phones CTA */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 26px 80px" }}>
        <div
          style={{
            background: "linear-gradient(135deg,rgba(108,43,217,.15),rgba(34,211,238,.08))",
            border: "1px solid rgba(139,92,246,.2)",
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
              Browse all smartphones
            </h3>
            <p style={{ fontFamily: "'Manrope'", fontSize: 15, color: "#94A3B8", margin: 0 }}>
              Filter by brand, price range, and more.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            style={{
              fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16,
              padding: "16px 36px", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff",
              cursor: "pointer", boxShadow: "0 12px 32px -8px rgba(108,43,217,.8)",
              transition: "transform .2s,box-shadow .2s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 18px 40px -8px rgba(108,43,217,.9)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(108,43,217,.8)"; }}
          >
            View All Phones
          </button>
        </div>
      </section>
    </main>
  );
}
