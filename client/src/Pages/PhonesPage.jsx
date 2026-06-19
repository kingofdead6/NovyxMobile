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

function PhoneCard({ phone, index, onClick }) {
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

  const conditionColor = { new: "#10B981", used: "#F59E0B", refurbished: "#22D3EE" };

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
      <div
        onClick={onClick}
        style={{ position: "relative", height: 240, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "radial-gradient(circle at 50% 30%,rgba(139,92,246,.16),transparent 60%)", overflow: "hidden" }}
      >
        {phone.condition && (
          <span style={{ position: "absolute", top: 13, left: 13, zIndex: 4, fontFamily: "'JetBrains Mono'", fontSize: 10.5, fontWeight: 600, padding: "5px 10px", borderRadius: 8, background: `${conditionColor[phone.condition]}22`, border: `1px solid ${conditionColor[phone.condition]}66`, color: conditionColor[phone.condition], textTransform: "uppercase" }}>
            {phone.condition}
          </span>
        )}
        {phone.images?.[0]?.url ? (
          <img
            src={phone.images[0].url}
            alt={phone.name}
            style={{ width: 122, height: "auto", maxHeight: 220, objectFit: "contain", transform: "translateZ(36px)", filter: "drop-shadow(0 24px 44px rgba(0,0,0,.7))" }}
          />
        ) : (
          <div style={{ width: 110, height: 220, borderRadius: 26, padding: 6, background: "linear-gradient(160deg,#1b2440,#0a0e1d)", border: "1px solid rgba(255,255,255,.1)", transform: "translateZ(36px)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 20, background: `linear-gradient(165deg,${g1},${g2})`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 40, height: 10, borderRadius: 6, background: "#05070f" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.3),transparent 40%)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ position: "relative", zIndex: 4, padding: 18 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#94A3B8", margin: "0 0 4px" }}>
          {phone.brand?.name || ""}
        </p>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, margin: "0 0 10px", lineHeight: 1.3 }}>
          {phone.name}
        </h3>

        {/* Spec pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {phone.ram && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.25)", color: "#c4b5fd" }}>
              {phone.ram} RAM
            </span>
          )}
          {phone.storage && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(34,211,238,.1)", border: "1px solid rgba(34,211,238,.25)", color: "#67e8f9" }}>
              {phone.storage}
            </span>
          )}
          {phone.color && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#94A3B8" }}>
              {phone.color}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18 }}>
            {(phone.price || 0).toLocaleString()} DA
          </span>
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

function FilterChips({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, color: "#64748B", letterSpacing: ".06em", flexShrink: 0 }}>
        {label}
      </span>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? "All" : opt)}
            style={{
              fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13,
              padding: "6px 13px", borderRadius: 10, cursor: "pointer", transition: "all .2s",
              color: active ? "#fff" : "#94A3B8",
              background: active ? "rgba(139,92,246,.35)" : "rgba(255,255,255,.04)",
              border: `1px solid ${active ? "rgba(139,92,246,.6)" : "rgba(255,255,255,.07)"}`,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PhonesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [ram, setRam] = useState("All");
  const [storage, setStorage] = useState("All");
  const [condition, setCondition] = useState("All");
  const [color, setColor] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    const b = searchParams.get("brand");
    if (b) setBrand(b);
  }, [searchParams]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/phones`)
      .then(r => setPhones(r.data || []))
      .catch(() => toast.error("Failed to load phones"))
      .finally(() => setLoading(false));
  }, []);

  // Derive unique filter options from actual data
  const brands    = useMemo(() => ["All", ...new Set(phones.map(p => p.brand?.name).filter(Boolean))], [phones]);
  const rams      = useMemo(() => ["All", ...new Set(phones.map(p => p.ram).filter(Boolean)).values()].sort((a, b) => a === "All" ? -1 : parseInt(a) - parseInt(b)), [phones]);
  const storages  = useMemo(() => ["All", ...new Set(phones.map(p => p.storage).filter(Boolean))].sort((a, b) => a === "All" ? -1 : parseInt(a) - parseInt(b)), [phones]);
  const conditions = useMemo(() => ["All", ...new Set(phones.map(p => p.condition).filter(Boolean))], [phones]);
  const colors    = useMemo(() => ["All", ...new Set(phones.map(p => p.color).filter(Boolean))], [phones]);

  const filtered = useMemo(() => {
    return phones.filter(p => {
      if (brand !== "All" && p.brand?.name !== brand) return false;
      if (ram !== "All" && p.ram !== ram) return false;
      if (storage !== "All" && p.storage !== storage) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (color !== "All" && p.color !== color) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !(p.brand?.name || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [phones, brand, ram, storage, condition, color, search]);

  const handleBrandChange = (val) => {
    setBrand(val);
    if (val === "All") navigate("/phones", { replace: true });
    else navigate(`/phones?brand=${encodeURIComponent(val)}`, { replace: true });
  };

  const clearAll = () => {
    setBrand("All");
    setRam("All");
    setStorage("All");
    setCondition("All");
    setColor("All");
    setSearch("");
    navigate("/phones", { replace: true });
  };

  const hasActiveFilters = brand !== "All" || ram !== "All" || storage !== "All" || condition !== "All" || color !== "All" || search;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#8B5CF6", animation: "glowPulse 1.5s infinite" }}>Loading phones…</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn .5s", maxWidth: 1280, margin: "0 auto", padding: "50px 26px 80px" }}>
      {/* Header */}
      <div style={{ animation: "fadeUp .6s both", marginBottom: 30 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 10px" }}>
          // {filtered.length} PHONES
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-.025em", margin: 0 }}>
          All Smartphones
        </h1>
      </div>

      {/* Sticky filter bar */}
      <div style={{ position: "sticky", top: 72, zIndex: 40, background: "rgba(5,8,22,.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: 14, marginBottom: 28 }}>
        {/* Search + toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: filtersOpen ? 12 : 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 13, padding: "10px 15px" }}>
            <span style={{ color: "#94A3B8", fontSize: 17 }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search phones, brands…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'Manrope'", fontSize: 15 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 16 }}>✕</button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(v => !v)}
            style={{ padding: "10px 16px", borderRadius: 13, border: "1px solid rgba(255,255,255,.08)", background: filtersOpen ? "rgba(139,92,246,.2)" : "rgba(255,255,255,.04)", color: filtersOpen ? "#c4b5fd" : "#94A3B8", fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}
          >
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              style={{ padding: "10px 16px", borderRadius: 13, border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.1)", color: "#fca5a5", fontFamily: "'Manrope'", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter rows */}
        {filtersOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <FilterChips label="BRAND"     options={brands}     value={brand}     onChange={handleBrandChange} />
            {rams.length > 1      && <FilterChips label="RAM"       options={rams}       value={ram}       onChange={setRam} />}
            {storages.length > 1  && <FilterChips label="STORAGE"   options={storages}   value={storage}   onChange={setStorage} />}
            {conditions.length > 1 && <FilterChips label="CONDITION" options={conditions} value={condition} onChange={setCondition} />}
            {colors.length > 1    && <FilterChips label="COLOR"     options={colors}     value={color}     onChange={setColor} />}
          </div>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>No phones match</p>
          <p style={{ margin: 0 }}>Try adjusting your filters or search term.</p>
          <button
            onClick={clearAll}
            style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, border: "1px solid rgba(139,92,246,.4)", background: "rgba(139,92,246,.15)", color: "#c4b5fd", fontFamily: "'Manrope'", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(258px,1fr))", gap: 18 }}>
        {filtered.map((phone, i) => (
          <PhoneCard
            key={phone._id}
            phone={phone}
            index={i}
            onClick={() => navigate(`/product/${phone._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
