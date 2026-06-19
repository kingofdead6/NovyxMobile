import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";

const GRADIENTS = [
  ["#8B5CF6", "#6C2BD9"],
  ["#EC4899", "#BE185D"],
  ["#22D3EE", "#0891B2"],
  ["#F59E0B", "#D97706"],
  ["#10B981", "#059669"],
  ["#6366F1", "#4338CA"],
];

function CaseCard({ item, index, onClick }) {
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

      <div onClick={onClick} style={{ position: "relative", height: 240, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 30%,rgba(139,92,246,.16),transparent 60%)", overflow: "hidden", cursor: "pointer" }}>
        {item.images?.[0]?.url ? (
          <img src={item.images[0].url} alt={item.name} style={{ maxWidth: 160, maxHeight: 220, objectFit: "contain", transform: "translateZ(30px)", filter: "drop-shadow(0 20px 40px rgba(0,0,0,.7))" }} />
        ) : (
          <div style={{ width: 80, height: 160, borderRadius: 18, background: `linear-gradient(165deg,${g1},${g2})`, transform: "translateZ(30px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.25),transparent 40%)" }} />
          </div>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 4, padding: 18 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#94A3B8", margin: "0 0 4px" }}>
          {item.brand?.name || ""}
        </p>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, margin: "0 0 10px", lineHeight: 1.3 }}>
          {item.name}
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {item.material && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.25)", color: "#c4b5fd" }}>
              {item.material}
            </span>
          )}
          {item.color && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#94A3B8" }}>
              {item.color}
            </span>
          )}
          {item.compatibleModels?.length > 0 && (
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, padding: "3px 8px", borderRadius: 6, background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.2)", color: "#67e8f9" }}>
              {item.compatibleModels.length} model{item.compatibleModels.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18 }}>
            {(item.price || 0).toLocaleString()} DA
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

export default function CasesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [material, setMaterial] = useState("All");
  const [color, setColor] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    const b = searchParams.get("brand");
    if (b) setBrand(b);
  }, [searchParams]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/cases`)
      .then(r => setCases(r.data || []))
      .catch(() => toast.error("Failed to load cases"))
      .finally(() => setLoading(false));
  }, []);

  const brands    = useMemo(() => ["All", ...new Set(cases.map(c => c.brand?.name).filter(Boolean))], [cases]);
  const materials = useMemo(() => ["All", ...new Set(cases.map(c => c.material).filter(Boolean))], [cases]);
  const colors    = useMemo(() => ["All", ...new Set(cases.map(c => c.color).filter(Boolean))], [cases]);

  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (brand !== "All" && c.brand?.name !== brand) return false;
      if (material !== "All" && c.material !== material) return false;
      if (color !== "All" && c.color !== color) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchBrand = (c.brand?.name || "").toLowerCase().includes(q);
        const matchModels = (c.compatibleModels || []).some(m => m.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchModels) return false;
      }
      return true;
    });
  }, [cases, brand, material, color, search]);

  const handleBrandChange = (val) => {
    setBrand(val);
    if (val === "All") navigate("/cases", { replace: true });
    else navigate(`/cases?brand=${encodeURIComponent(val)}`, { replace: true });
  };

  const clearAll = () => {
    setBrand("All");
    setMaterial("All");
    setColor("All");
    setSearch("");
    navigate("/cases", { replace: true });
  };

  const hasActiveFilters = brand !== "All" || material !== "All" || color !== "All" || search;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#8B5CF6", animation: "glowPulse 1.5s infinite" }}>Loading cases…</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn .5s", maxWidth: 1280, margin: "0 auto", padding: "50px 26px 80px" }}>
      {/* Header */}
      <div style={{ animation: "fadeUp .6s both", marginBottom: 30 }}>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, letterSpacing: ".12em", color: "#22D3EE", margin: "0 0 10px" }}>
          // {filtered.length} CASES
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-.025em", margin: 0 }}>
          Phone Cases
        </h1>
      </div>

      {/* Sticky filter bar */}
      <div style={{ position: "sticky", top: 72, zIndex: 40, background: "rgba(5,8,22,.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: 14, marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: filtersOpen ? 12 : 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 13, padding: "10px 15px" }}>
            <span style={{ color: "#94A3B8", fontSize: 17 }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cases, brands, compatible models…"
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

        {filtersOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <FilterChips label="BRAND"    options={brands}    value={brand}    onChange={handleBrandChange} />
            {materials.length > 1 && <FilterChips label="MATERIAL" options={materials} value={material} onChange={setMaterial} />}
            {colors.length > 1    && <FilterChips label="COLOR"    options={colors}    value={color}    onChange={setColor} />}
          </div>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>No cases match</p>
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
        {filtered.map((c, i) => (
          <CaseCard key={c._id} item={c} index={i} onClick={() => navigate(`/case/${c._id}`)} />
        ))}
      </div>
    </div>
  );
}
