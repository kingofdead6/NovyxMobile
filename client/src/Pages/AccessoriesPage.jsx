import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";

const GRADIENTS = [
  ["#8B5CF6", "#6C2BD9"],
  ["#22D3EE", "#0891B2"],
  ["#F59E0B", "#D97706"],
  ["#EC4899", "#BE185D"],
  ["#10B981", "#059669"],
  ["#6366F1", "#4338CA"],
];

function AccessoryCard({ item, index, onClick }) {
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
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 34px 60px -22px rgba(34,211,238,.4)")}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(220px circle at var(--mx) var(--my),rgba(34,211,238,.15),transparent 60%)", pointerEvents: "none", zIndex: 3 }} />

      <div onClick={onClick} style={{ position: "relative", height: 220, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 30%,rgba(34,211,238,.1),transparent 60%)", overflow: "hidden", cursor: "pointer" }}>
        {item.images?.[0]?.url ? (
          <img src={item.images[0].url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "translateZ(20px)" }} />
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: 20, background: `linear-gradient(135deg,${g1},${g2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, transform: "translateZ(20px)" }}>📦</div>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 4, padding: 18 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#22D3EE", margin: "0 0 5px", letterSpacing: ".04em" }}>
          {item.category?.name?.toUpperCase() || "ACCESSORY"}
        </p>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, margin: "0 0 4px", lineHeight: 1.25 }}>{item.name}</h3>
        {item.brand && (
          <p style={{ fontFamily: "'Manrope'", fontSize: 12.5, color: "#64748B", margin: "0 0 12px" }}>{item.brand}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18 }}>{(item.price || 0).toLocaleString()} DA</span>
          <button
            onClick={onClick}
            style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13, padding: "9px 14px", borderRadius: 11, border: "1px solid rgba(34,211,238,.35)", background: "rgba(34,211,238,.1)", color: "#67e8f9", cursor: "pointer", transition: "all .25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0891b2"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0891b2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,.1)"; e.currentTarget.style.color = "#67e8f9"; e.currentTarget.style.borderColor = "rgba(34,211,238,.35)"; }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccessoriesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  // Sync category from URL param
  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCat(cat || "All");
  }, [searchParams]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [itemsRes, catsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/accessories`),
          axios.get(`${API_BASE_URL}/accessories-categories`),
        ]);
        setItems(itemsRes.data || []);
        setCategories(catsRes.data || []);
      } catch {
        toast.error("Failed to load accessories");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const catName = item.category?.name || "";
      const matchCat = selectedCat === "All" || catName === selectedCat;
      const matchSearch = !search
        || item.name.toLowerCase().includes(search.toLowerCase())
        || catName.toLowerCase().includes(search.toLowerCase())
        || (item.brand || "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCat, search]);

  const setCategory = (name) => {
    setSelectedCat(name);
    if (name === "All") navigate("/accessories", { replace: true });
    else navigate(`/accessories?category=${encodeURIComponent(name)}`, { replace: true });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#22D3EE", animation: "glowPulse 1.5s infinite" }}>
          Loading accessories…
        </p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn .5s", maxWidth: 1280, margin: "0 auto", padding: "50px 26px 60px" }}>
      {/* Header */}
      <div style={{ animation: "fadeUp .6s both", marginBottom: 30 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 10px" }}>
          // {filtered.length} ITEMS
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-.025em", margin: 0 }}>
          Accessories
        </h1>
      </div>

      {/* Sticky filter bar */}
      <div style={{
        position: "sticky", top: 72, zIndex: 40,
        background: "rgba(5,8,22,.7)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,.08)", borderRadius: 18,
        padding: 14, marginBottom: 28,
        display: "flex", flexDirection: "column", gap: 13,
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 13, padding: "11px 15px" }}>
          <span style={{ color: "#94A3B8", fontSize: 17 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accessories, brands, categories…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'Manrope'", fontSize: 15 }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", ...categories.map(c => c.name)].map(cat => {
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13.5,
                  padding: "8px 15px", borderRadius: 11, cursor: "pointer", transition: "all .25s",
                  color: active ? "#fff" : "#94A3B8",
                  background: active ? "rgba(34,211,238,.25)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${active ? "rgba(34,211,238,.55)" : "rgba(255,255,255,.08)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>No accessories found</p>
          <p style={{ margin: 0 }}>Try a different category or search term.</p>
          {(search || selectedCat !== "All") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              style={{ marginTop: 20, padding: "10px 22px", borderRadius: 12, background: "rgba(34,211,238,.15)", border: "1px solid rgba(34,211,238,.3)", color: "#22D3EE", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(258px,1fr))", gap: 18 }}>
        {filtered.map((item, i) => (
          <AccessoryCard key={item._id} item={item} index={i} onClick={() => navigate(`/accessory/${item._id}`)} />
        ))}
      </div>
    </div>
  );
}
