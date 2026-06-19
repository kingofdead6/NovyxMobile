import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";

const GRADIENTS = [
  ["#8B5CF6","#6C2BD9"],
  ["#22D3EE","#0891B2"],
  ["#F59E0B","#D97706"],
  ["#EC4899","#BE185D"],
  ["#10B981","#059669"],
  ["#6366F1","#4338CA"],
];

function ProductCard({ product, index, onClick }) {
  const cardRef = useRef(null);
  const [g1, g2] = GRADIENTS[index % GRADIENTS.length];

  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.08)",
        background: "linear-gradient(170deg,rgba(255,255,255,.055),rgba(255,255,255,.015))",
        backdropFilter: "blur(8px)",
        transition: "box-shadow .3s",
        transformStyle: "preserve-3d",
        animation: "fadeUp .55s both",
        animationDelay: `${index * 0.05}s`,
        "--mx": "50%", "--my": "50%",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 34px 60px -22px rgba(108,43,217,.6)"}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(220px circle at var(--mx) var(--my),rgba(139,92,246,.2),transparent 60%)", pointerEvents: "none", zIndex: 3 }} />

      {/* Image area */}
      <div onClick={onClick} style={{ position: "relative", height: 240, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "radial-gradient(circle at 50% 30%,rgba(139,92,246,.16),transparent 60%)", overflow: "hidden" }}>
        {product.badge && (
          <span style={{ position: "absolute", top: 13, left: 13, zIndex: 4, fontFamily: "'JetBrains Mono'", fontSize: 10.5, fontWeight: 600, padding: "5px 10px", borderRadius: 8, background: "rgba(34,211,238,.15)", border: "1px solid rgba(34,211,238,.4)", color: "#22D3EE" }}>{product.badge}</span>
        )}
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.name} style={{ width: 122, height: "auto", maxHeight: 252, objectFit: "contain", transform: "translateZ(36px)", filter: "drop-shadow(0 24px 44px rgba(0,0,0,.7))" }} />
        ) : (
          <div style={{ width: 122, height: 252, borderRadius: 28, padding: 7, background: "linear-gradient(160deg,#1b2440,#0a0e1d)", border: "1px solid rgba(255,255,255,.1)", transform: "translateZ(36px)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 22, background: `linear-gradient(165deg,${g1},${g2})`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 42, height: 12, borderRadius: 7, background: "#05070f" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.3),transparent 40%)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ position: "relative", zIndex: 4, padding: 18 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#94A3B8", margin: "0 0 6px" }}>{product.brand?.name || ""}</p>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, margin: "0 0 14px" }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18 }}>{(product.price || 0).toLocaleString()} DA</span>
          <button
            onClick={onClick}
            style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13, padding: "9px 14px", borderRadius: 11, border: "1px solid rgba(139,92,246,.4)", background: "rgba(139,92,246,.14)", color: "#e9deff", cursor: "pointer", transition: "all .25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#6C2BD9"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,.14)"; e.currentTarget.style.color = "#e9deff"; }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const brand = searchParams.get("brand");
    setSelectedCategory(brand || "All");
  }, [searchParams]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/phones/featured`)
      .then(r => {
        const all = r.data || [];
        setProducts(all);
        const cats = ["All", ...new Set(all.map(p => p.brand?.name).filter(Boolean))];
        setAvailableCategories(cats);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const brandName = p.brand?.name || "";
      const matchCat = selectedCategory === "All" || brandName === selectedCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || brandName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const setCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") navigate("/products", { replace: true });
    else navigate(`/products?brand=${encodeURIComponent(cat)}`, { replace: true });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#8B5CF6", animation: "glowPulse 1.5s infinite" }}>Loading devices…</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn .5s", maxWidth: 1280, margin: "0 auto", padding: "50px 26px 40px" }}>
      {/* Header */}
      <div style={{ animation: "fadeUp .6s both", marginBottom: 30 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 10px" }}>// {filtered.length} DEVICES</p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-.025em", margin: 0 }}>All Smartphones</h1>
      </div>

      {/* Filter bar */}
      <div style={{ position: "sticky", top: 72, zIndex: 40, background: "rgba(5,8,22,.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: 14, marginBottom: 28, display: "flex", flexDirection: "column", gap: 13 }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 13, padding: "11px 15px" }}>
          <span style={{ color: "#94A3B8", fontSize: 17 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices, brands, specs…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'Manrope'", fontSize: 15 }}
          />
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {availableCategories.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13.5,
                  padding: "8px 15px", borderRadius: 11, cursor: "pointer", transition: "all .25s",
                  color: active ? "#fff" : "#94A3B8",
                  background: active ? "rgba(139,92,246,.35)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${active ? "rgba(139,92,246,.6)" : "rgba(255,255,255,.08)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>No devices match</p>
          <p style={{ margin: 0 }}>Try a different brand or search term.</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(258px,1fr))", gap: 18 }}>
        {filtered.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} onClick={() => navigate(`/product/${p._id}`)} />
        ))}
      </div>
    </div>
  );
}
