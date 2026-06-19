import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userType, setUserType] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setCartOpen(false); }, [location.pathname]);

  const checkAuth = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try { setUserType(jwtDecode(token).usertype); }
      catch { setUserType(null); }
    } else { setUserType(null); }
  };

  const loadCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(raw);
  };

  useEffect(() => {
    checkAuth(); loadCart();
    const h = () => { checkAuth(); loadCart(); };
    window.addEventListener("storage", h);
    window.addEventListener("authChanged", h);
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("storage", h);
      window.removeEventListener("authChanged", h);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserType(null);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
  const cartTotal = cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const isAdmin = userType === "admin" || userType === "superadmin";

  const updateQty = (idx, delta) => {
    const updated = cartItems.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
    });
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (idx) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const navItems = isAdmin
    ? [
        { label: "Dashboard", to: "/admin/dashboard" },
        { label: "Commandes", to: "/admin/orders" },
        { label: "Produits", to: "/admin/products" },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "Phones", to: "/phones" },
        { label: "Accessories", to: "/accessories" },
        { label: "Cases", to: "/cases" },
        { label: "Contact", to: "/contact" },
      ];

  return (
    <>
      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 90,
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        background: scrolled
          ? "linear-gradient(180deg,rgba(5,8,22,.95),rgba(5,8,22,.8))"
          : "linear-gradient(180deg,rgba(5,8,22,.82),rgba(5,8,22,.45))",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        transition: "background .3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <span style={{ position: "relative", width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -6px rgba(108,43,217,.8)", flexShrink: 0 }}>
              <span style={{ width: 13, height: 13, borderRadius: 4, background: "#fff", transform: "rotate(45deg)", boxShadow: "0 0 12px rgba(255,255,255,.7)", display: "block" }} />
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-.02em", color: "#fff" }}>
              NOVYX<span style={{ color: "#22D3EE" }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }} className="hidden md:flex">
            {navItems.map((n) => {
              const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} style={{
                  fontFamily: "'Manrope'", fontWeight: 600, fontSize: 14.5,
                  color: active ? "#fff" : "rgba(255,255,255,.65)",
                  background: active ? "rgba(139,92,246,.2)" : "none",
                  border: `1px solid ${active ? "rgba(139,92,246,.5)" : "transparent"}`,
                  padding: "9px 16px", borderRadius: 11, cursor: "pointer",
                  transition: "all .25s", textDecoration: "none",
                }}>
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isAdmin && (
              <button
                onClick={() => setCartOpen(true)}
                style={{
                  position: "relative", display: "flex", alignItems: "center", gap: 9,
                  fontFamily: "'Manrope'", fontWeight: 600, fontSize: 14, color: "#fff",
                  background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)",
                  padding: "9px 15px 9px 13px", borderRadius: 12, cursor: "pointer",
                  transition: "all .25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,.18)"; e.currentTarget.style.borderColor = "rgba(139,92,246,.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span style={{
                    minWidth: 20, height: 20, padding: "0 5px", borderRadius: 10,
                    background: "linear-gradient(135deg,#22D3EE,#0891b2)",
                    color: "#031018", fontSize: 11.5, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 12px rgba(34,211,238,.6)",
                  }}>{cartCount}</span>
                )}
              </button>
            )}

            {isAdmin && (
              <button onClick={handleLogout} style={{
                fontFamily: "'Manrope'", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,.7)",
                background: "none", border: "1px solid rgba(255,255,255,.12)",
                padding: "9px 16px", borderRadius: 11, cursor: "pointer",
              }}>
                Déconnexion
              </button>
            )}

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                display: "flex", width: 42, height: 42, borderRadius: 12,
                background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)",
                cursor: "pointer", color: "#fff", flexDirection: "column",
                gap: 4, alignItems: "center", justifyContent: "center",
              }}
              className="md:hidden"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 18, height: 2, background: "currentColor", borderRadius: 2, display: "block" }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(5,8,22,.7)", backdropFilter: "blur(10px)",
            animation: "fadeIn .25s",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: "min(320px,80vw)", background: "rgba(15,23,42,.96)",
              borderLeft: "1px solid rgba(255,255,255,.08)",
              padding: "80px 24px 24px",
              display: "flex", flexDirection: "column", gap: 8,
              animation: "fadeUp .3s",
            }}
          >
            {navItems.map(n => (
              <Link
                key={n.to} to={n.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  textAlign: "left", fontFamily: "'Space Grotesk'", fontWeight: 600,
                  fontSize: 22, color: "#fff", textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,.08)",
                  padding: "16px 4px",
                }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 110,
            background: "rgba(5,8,22,.66)", backdropFilter: "blur(10px)",
            animation: "fadeIn .25s",
          }}
        >
          <aside
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: "min(420px,92vw)",
              background: "linear-gradient(180deg,rgba(15,23,42,.99),rgba(5,8,22,.99))",
              borderLeft: "1px solid rgba(255,255,255,.08)",
              display: "flex", flexDirection: "column",
              animation: "drawerIn .35s cubic-bezier(.2,.9,.3,1)",
              boxShadow: "-30px 0 80px -20px rgba(0,0,0,.7)",
            }}
          >
            {/* Header */}
            <div style={{ padding: "22px 22px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20 }}>
                Your Cart <span style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>· {cartCount}</span>
              </span>
              <button onClick={() => setCartOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 10px", color: "#94A3B8" }}>
                  <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 18, background: "rgba(139,92,246,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🛒</div>
                  <p style={{ fontFamily: "'Space Grotesk'", color: "#fff", fontSize: 17, margin: "0 0 6px" }}>Your cart is empty</p>
                  <p style={{ margin: 0, fontSize: 14 }}>Add a device to get started.</p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 13, alignItems: "center", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 11 }}>
                    <div style={{ width: 54, height: 74, borderRadius: 11, flexShrink: 0, overflow: "hidden", background: "rgba(139,92,246,.2)" }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      <p style={{ margin: "7px 0 0", fontFamily: "'Space Grotesk'", fontWeight: 700, color: "#22D3EE", fontSize: 14 }}>{(item.price || 0).toLocaleString()} DA</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.05)", borderRadius: 9, padding: 3 }}>
                        <button onClick={() => updateQty(idx, -1)} style={{ width: 24, height: 24, borderRadius: 7, border: "none", background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontSize: 15 }}>−</button>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, minWidth: 14, textAlign: "center" }}>{item.quantity || 1}</span>
                        <button onClick={() => updateQty(idx, 1)} style={{ width: 24, height: 24, borderRadius: 7, border: "none", background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontSize: 15 }}>+</button>
                      </div>
                      <button onClick={() => removeItem(idx)} style={{ fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout */}
            {cartItems.length > 0 && (
              <div style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                  <span style={{ color: "#94A3B8", fontSize: 14 }}>Total</span>
                  <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24 }}>{cartTotal.toLocaleString()} DA</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  style={{
                    display: "block", width: "100%", padding: 15, border: "none", borderRadius: 14,
                    background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff",
                    fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16,
                    cursor: "pointer", textDecoration: "none", textAlign: "center",
                    boxShadow: "0 16px 40px -12px rgba(108,43,217,.9)",
                  }}
                >
                  Checkout · Cash on Delivery
                </Link>
                <p style={{ textAlign: "center", margin: "12px 0 0", fontSize: 12.5, color: "#94A3B8" }}>
                  🔒 Secure checkout · Free delivery across Algeria
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
