import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "rgba(15,23,42,.95)", borderTop: "1px solid rgba(255,255,255,.08)", padding: "60px 26px 30px", marginTop: 40 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 50 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <span style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -6px rgba(108,43,217,.8)", flexShrink: 0 }}>
                <span style={{ width: 13, height: 13, borderRadius: 4, background: "#fff", transform: "rotate(45deg)", display: "block" }} />
              </span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-.02em", color: "#fff" }}>
                NOVYX<span style={{ color: "#22D3EE" }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#94A3B8", margin: 0 }}>
              Your #1 source for original smartphones in Algeria. Best prices, fast delivery, cash on delivery.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", color: "#fff", margin: "0 0 16px" }}>PAGES</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Home","/"],["Phones","/products"],["Accessories","/products?category=Accessories"],["Contact","/sell-us-something"]].map(([lbl,to]) => (
                <Link key={to} to={to} style={{ fontSize: 14, color: "#94A3B8", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
                >{lbl}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", color: "#fff", margin: "0 0 16px" }}>CONTACT</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#94A3B8" }}>
              <a href="tel:+213XXXXXXXXX" style={{ color: "#94A3B8", textDecoration: "none" }}>📞 +213 XXX XXX XXX</a>
              <a href="mailto:contact@novyx.dz" style={{ color: "#94A3B8", textDecoration: "none" }}>✉️ contact@novyx.dz</a>
              <span>📍 Algeria</span>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", color: "#fff", margin: "0 0 16px" }}>SELL YOUR DEVICE</h3>
            <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 16px", lineHeight: 1.5 }}>
              Get instant cash for your old phone. No hassle, fair price.
            </p>
            <Link to="/sell-us-something" style={{ display: "inline-block", padding: "11px 20px", borderRadius: 12, background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 8px 20px -6px rgba(108,43,217,.7)" }}>
              Sell Us Your Phone
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#64748B", margin: 0 }}>
            © {new Date().getFullYear()} NOVYX Mobile. All rights reserved.
          </p>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#64748B", margin: 0 }}>
            Made with 💜 in Algeria
          </p>
        </div>
      </div>
    </footer>
  );
}
