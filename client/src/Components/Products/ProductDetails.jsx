import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";

const ACCORDIONS = [
  { title: "In the box", body: "Device, charging cable, SIM ejector tool, documentation. Charger and earphones sold separately (varies by model)." },
  { title: "Warranty & returns", body: "2-year manufacturer warranty. 7-day return policy for sealed, unopened items. Contact us for claims." },
  { title: "Delivery info", body: "Free delivery within 48h across Algeria. Cash on delivery only. No hidden fees." },
];

function RelatedCard({ product, onClick }) {
  const cardRef = useRef(null);
  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
  const onMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  };

  return (
    <div ref={cardRef} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{ position: "relative", borderRadius: 22, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(170deg,rgba(255,255,255,.055),rgba(255,255,255,.015))", transition: "box-shadow .3s", transformStyle: "preserve-3d", "--mx": "50%", "--my": "50%" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 30px 56px -22px rgba(108,43,217,.55)"}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(200px circle at var(--mx) var(--my),rgba(139,92,246,.18),transparent 60%)", pointerEvents: "none", zIndex: 3 }} />
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 30%,rgba(139,92,246,.14),transparent 60%)" }}>
        {product.images?.[0]?.url
          ? <img src={product.images[0].url} alt={product.name} style={{ maxWidth: 100, maxHeight: 180, objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }} />
          : <div style={{ width: 104, height: 214, borderRadius: 24, padding: 6, background: "linear-gradient(160deg,#1b2440,#0a0e1d)", border: "1px solid rgba(255,255,255,.1)" }}><div style={{ width: "100%", height: "100%", borderRadius: 19, background: "linear-gradient(165deg,#8B5CF6,#6C2BD9)", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.28),transparent 40%)" }} /></div></div>
        }
      </div>
      <div style={{ position: "relative", zIndex: 4, padding: 16 }}>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
        <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: "#22D3EE", margin: 0 }}>{(product.price || 0).toLocaleString()} DA</p>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [related, setRelated] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setSelectedImg(0);
    axios.get(`${API_BASE_URL}/products/${id}`)
      .then(r => {
        setProduct(r.data);
        if (r.data.category) {
          axios.get(`${API_BASE_URL}/products?category=${encodeURIComponent(r.data.category)}`)
            .then(r2 => setRelated((r2.data || []).filter(p => p._id !== id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const item = { productId: product._id, name: product.name, price: product.price, image: product.images?.[selectedImg]?.url, quantity: 1, addedAt: new Date().toISOString() };
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex(i => i.productId === item.productId && i.image === item.image);
    if (idx !== -1) cart[idx].quantity += 1;
    else cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart!");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const onTilt = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
  const onTiltLeave = () => { if (cardRef.current) cardRef.current.style.transform = "rotateX(0) rotateY(0)"; };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#8B5CF6", animation: "glowPulse 1.5s infinite" }}>Loading product…</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: "#94A3B8" }}>Product not found.</p>
    </div>
  );

  const images = product.images || [];

  return (
    <div style={{ animation: "fadeIn .5s", maxWidth: 1280, margin: "0 auto", padding: "34px 26px 40px" }}>
      {/* Back */}
      <button onClick={() => navigate("/products")} style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 7, transition: "color .2s" }}
        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
        onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
      >
        ← Back to phones
      </button>

      <div style={{ display: "flex", gap: 46, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Gallery */}
        <div style={{ flex: 1, minWidth: 300, position: "sticky", top: 96, animation: "fadeUp .6s both" }}>
          <div
            ref={cardRef}
            onMouseMove={onTilt}
            onMouseLeave={onTiltLeave}
            style={{
              position: "relative", borderRadius: 30, overflow: "hidden",
              border: "1px solid rgba(255,255,255,.08)",
              background: "radial-gradient(circle at 50% 25%,rgba(139,92,246,.22),rgba(255,255,255,.02))",
              height: 520, display: "flex", alignItems: "center", justifyContent: "center",
              transformStyle: "preserve-3d", transition: "transform .25s",
              "--mx": "50%", "--my": "50%",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(300px circle at var(--mx) var(--my),rgba(34,211,238,.18),transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,rgba(139,92,246,.5),transparent 65%)`, filter: "blur(40px)", opacity: .5 }} />

            {images.length > 0 ? (
              <img
                src={images[selectedImg]?.url}
                alt={product.name}
                style={{ position: "relative", zIndex: 2, maxWidth: 240, maxHeight: 460, objectFit: "contain", transform: "translateZ(50px)", filter: "drop-shadow(0 50px 90px rgba(0,0,0,.8))", transition: "transform .4s" }}
              />
            ) : (
              <div style={{ position: "relative", zIndex: 2, width: 218, height: 446, borderRadius: 42, padding: 10, background: "linear-gradient(160deg,#1b2440,#0a0e1d)", border: "1px solid rgba(255,255,255,.12)", transform: "translateZ(50px)" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: 33, background: "linear-gradient(165deg,#8B5CF6,#6C2BD9)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 74, height: 20, borderRadius: 12, background: "#05070f" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.3),transparent 38%)" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center" }}>
                    <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, margin: 0 }}>{product.category || "NOVYX"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 11, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)} style={{ width: 66, height: 80, borderRadius: 14, cursor: "pointer", overflow: "hidden", border: `2px solid ${i === selectedImg ? "#8B5CF6" : "rgba(255,255,255,.1)"}`, transition: "all .25s", padding: 0 }}>
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 300, animation: "fadeUp .6s both .08s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            {product.category && (
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, padding: "5px 11px", borderRadius: 8, background: "rgba(139,92,246,.16)", border: "1px solid rgba(139,92,246,.35)", color: "#d7c9ff" }}>{product.category}</span>
            )}
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#86efac", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "ringPulse 2s infinite", display: "block" }} />
              In Stock
            </span>
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(32px,4.4vw,52px)", letterSpacing: "-.025em", lineHeight: 1.04, margin: "0 0 12px" }}>{product.name}</h1>

          {product.description && (
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "#94A3B8", margin: "0 0 22px" }}>{product.description}</p>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: 13, marginBottom: 26 }}>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 38, background: "linear-gradient(120deg,#fff,#22D3EE)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {(product.price || 0).toLocaleString()} DA
            </span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: "#94A3B8" }}>
              or 12× {Math.round((product.price || 0) / 12).toLocaleString()} DA/mo
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <button
              onClick={addToCart}
              className="nv-mag-btn"
              style={{ flex: 1, minWidth: 180, padding: 17, border: "none", borderRadius: 15, background: added ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, cursor: "pointer", boxShadow: "0 18px 44px -14px rgba(108,43,217,.95)", transition: "background .4s" }}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
            <a
              href="https://wa.me/213XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="nv-mag-btn"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "17px 24px", border: "1px solid rgba(52,211,153,.45)", borderRadius: 15, background: "rgba(52,211,153,.12)", color: "#a7f3d0", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, cursor: "pointer", textDecoration: "none" }}
            >
              <span style={{ fontSize: 18 }}>💬</span> WhatsApp
            </a>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#94A3B8", margin: "0 0 26px" }}>
            🚚 Free delivery in 48h · 🔒 Cash on delivery · 🛡 2-year warranty
          </p>

          {/* Accordions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ACCORDIONS.map((acc, i) => (
              <div key={i} style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,.025)" }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15.5, textAlign: "left" }}
                >
                  {acc.title}
                  <span style={{ fontSize: 18, color: "#22D3EE", transition: "transform .3s", transform: openAccordion === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {openAccordion === i && (
                  <div style={{ padding: "0 18px 18px", color: "#94A3B8", fontSize: 14.5, lineHeight: 1.6, animation: "fadeUp .3s" }}>
                    {acc.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, letterSpacing: "-.02em", margin: "0 0 22px" }}>You might also like</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(248px,1fr))", gap: 18 }}>
            {related.map(p => (
              <RelatedCard key={p._id} product={p} onClick={() => navigate(`/product/${p._id}`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
