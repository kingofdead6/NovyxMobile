import { useState, useRef, Suspense, Component } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, OrbitControls } from "@react-three/drei";
import phoneModel from "../../assets/s_amsung_galaxy_s25_ultra_galaxy.glb";

const STATS = [
  { num: "500+", label: "DEVICES IN STOCK" },
  { num: "12K+", label: "HAPPY CUSTOMERS" },
  { num: "48H", label: "DELIVERY" },
];

// ── Error boundary: catches any throw from useGLTF (bad path, corrupt file,
// missing draco decoder, etc.) and renders a fallback instead of crashing
// the whole page. Suspense alone does NOT do this — it only covers the
// loading state, not load errors.
class PhoneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("3D phone model failed to load:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function PhoneFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        color: "#94A3B8",
        fontFamily: "'JetBrains Mono'",
        fontSize: 12,
        textAlign: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.04)",
        }}
      />
      <span>3D preview unavailable</span>
    </div>
  );
}

function PhoneModel({ isInteracting }) {
  const { scene } = useGLTF(phoneModel);
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || isInteracting.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.35;
    ref.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  return <primitive ref={ref} object={scene} scale={6.2} rotation={[-0.08, 0, 0]} />;
}

// Preload so failures surface early and loading is faster on first paint
useGLTF.preload(phoneModel);

function PhoneCanvas() {
  const isInteracting = useRef(false);

  return (
    <PhoneErrorBoundary fallback={<PhoneFallback />}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              // eslint-disable-next-line no-console
              console.error("WebGL context lost for phone canvas");
            },
            false
          );
        }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#8B5CF6" />
        <directionalLight position={[0, -3, 3]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#22D3EE" />
        <Suspense fallback={null}>
          <PhoneModel isInteracting={isInteracting} />
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.45}
            scale={4}
            blur={2.5}
            color="#6C2BD9"
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={7}
          onStart={() => { isInteracting.current = true; }}
          onEnd={() => { isInteracting.current = false; }}
        />
      </Canvas>
    </PhoneErrorBoundary>
  );
}

export default function Hero() {
  const [heroVariant, setHeroVariant] = useState("A");
  const navigate = useNavigate();

  return (
    <section style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 26px" }}>
      {/* Variant toggle */}
      <div style={{ position: "absolute", top: 18, right: 26, zIndex: 6, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 999, padding: 5, backdropFilter: "blur(10px)" }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10.5, color: "#94A3B8", padding: "0 8px", letterSpacing: ".06em" }}>HERO</span>
        {[["A","Split"],["B","Center"]].map(([v, lbl]) => (
          <button key={v} onClick={() => setHeroVariant(v)} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 600, padding: "6px 13px", borderRadius: 999, border: "none", cursor: "pointer", transition: "all .25s", color: heroVariant === v ? "#fff" : "#94A3B8", background: heroVariant === v ? "rgba(139,92,246,.35)" : "transparent" }}>
            {v} · {lbl}
          </button>
        ))}
      </div>

      {/* ── HERO A : Split ── */}
      {heroVariant === "A" && (
        <div className="nv-hero-row" style={{ display: "flex", alignItems: "center", gap: 40, minHeight: "88vh", padding: "90px 0 60px", animation: "fadeIn .5s" }}>
          {/* Left */}
          <div style={{ flex: 1.05, animation: "fadeUp .8s both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px", borderRadius: 999, background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.35)", marginBottom: 26 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 10px #22D3EE", animation: "glowPulse 2s infinite", display: "block" }} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, letterSpacing: ".06em", color: "#d7c9ff" }}>NEW · 2026 FLAGSHIP LINEUP</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(40px,5.6vw,76px)", lineHeight: 1.02, letterSpacing: "-.03em", margin: "0 0 24px" }}>
              Discover the latest<br />smartphones at the<br />
              <span style={{ background: "linear-gradient(120deg,#8B5CF6,#22D3EE)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>best prices.</span>
            </h1>
            <p style={{ maxWidth: 480, fontSize: 18.5, lineHeight: 1.6, color: "#94A3B8", margin: "0 0 36px" }}>
              Original devices. Warranty included. Fast delivery across Algeria — pay on delivery, no surprises.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/products")}
                className="nv-mag-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", border: "none", borderRadius: 15, background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, cursor: "pointer", boxShadow: "0 20px 46px -14px rgba(108,43,217,.95)" }}
              >
                Shop Phones <span style={{ fontSize: 18 }}>→</span>
              </button>
              <button
                onClick={() => navigate("/products?category=Accessories")}
                style={{ padding: "16px 28px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 15, background: "rgba(255,255,255,.04)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.16)"; }}
              >
                Browse Accessories
              </button>
            </div>
            <div style={{ display: "flex", gap: 34, marginTop: 50 }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, margin: 0, background: "linear-gradient(120deg,#fff,#22D3EE)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.num}</p>
                  <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#94A3B8", margin: "5px 0 0", letterSpacing: ".04em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – real 3D phone */}
          <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 520, animation: "scaleIn .9s both" }}>
            {/* Glow + orbit rings */}
            <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,43,217,.55),transparent 65%)", filter: "blur(22px)", animation: "glowPulse 5s infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 560, height: 560, border: "1px solid rgba(139,92,246,.22)", borderRadius: "50%", animation: "spinSlow 40s linear infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 440, height: 440, border: "1px solid rgba(34,211,238,.16)", borderRadius: "50%", animation: "spinSlow 28s linear infinite reverse", pointerEvents: "none" }} />

            {/* 3D canvas */}
            <div style={{ position: "relative", zIndex: 3, width: 460, height: 680, maxWidth: "90vw" }}>
              <PhoneCanvas />
            </div>

            {/* Floating badges */}
            <div style={{ position: "absolute", top: "8%", left: "2%", zIndex: 4, animation: "floatySlow 5s ease-in-out infinite", background: "rgba(15,23,42,.7)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "13px 16px", boxShadow: "0 20px 40px -16px rgba(0,0,0,.6)" }}>
              <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#22D3EE", margin: 0 }}>★ 4.9 RATING</p>
              <p style={{ fontSize: 13, margin: "4px 0 0", color: "#fff", fontWeight: 600 }}>12,400+ reviews</p>
            </div>
            <div style={{ position: "absolute", bottom: "10%", right: "0%", zIndex: 4, animation: "floatySlow 6s ease-in-out infinite .6s", background: "rgba(15,23,42,.7)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "13px 16px", boxShadow: "0 20px 40px -16px rgba(0,0,0,.6)" }}>
              <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#86efac", margin: 0 }}>✓ IN STOCK</p>
              <p style={{ fontSize: 13, margin: "4px 0 0", color: "#fff", fontWeight: 600 }}>Delivered in 48h</p>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO B : Centered ── */}
      {heroVariant === "B" && (
        <div style={{ position: "relative", textAlign: "center", padding: "110px 0 70px", minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn .5s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px", borderRadius: 999, background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.35)", marginBottom: 30, animation: "fadeUp .6s both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 10px #22D3EE", animation: "glowPulse 2s infinite", display: "block" }} />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, letterSpacing: ".06em", color: "#d7c9ff" }}>POWER YOUR EVERYDAY</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "clamp(44px,8vw,108px)", lineHeight: .98, letterSpacing: "-.035em", margin: 0, animation: "fadeUp .7s both .05s" }}>
            Discover the latest<br />
            <span style={{ background: "linear-gradient(120deg,#8B5CF6 20%,#22D3EE)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>smartphones.</span>
          </h1>
          <p style={{ maxWidth: 560, fontSize: 19, lineHeight: 1.6, color: "#94A3B8", margin: "28px 0 38px", animation: "fadeUp .7s both .12s" }}>
            Original devices at the best prices. Warranty included. Fast delivery across Algeria — pay on delivery.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp .7s both .18s" }}>
            <button onClick={() => navigate("/products")} className="nv-mag-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 30px", border: "none", borderRadius: 15, background: "linear-gradient(135deg,#8B5CF6,#6C2BD9)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, cursor: "pointer", boxShadow: "0 20px 46px -14px rgba(108,43,217,.95)" }}>
              Shop Phones <span style={{ fontSize: 18 }}>→</span>
            </button>
            <button onClick={() => navigate("/products?category=Accessories")} style={{ padding: "16px 30px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 15, background: "rgba(255,255,255,.04)", color: "#fff", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, cursor: "pointer" }}>Browse Accessories</button>
          </div>

          {/* Centered 3D phone */}
          <div style={{ position: "relative", marginTop: 40, width: 440, height: 660, maxWidth: "90vw", animation: "scaleIn 1s both .2s" }}>
            <div style={{ position: "absolute", width: 360, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(108,43,217,.5),transparent 65%)", filter: "blur(30px)", bottom: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
            <PhoneCanvas />
          </div>
        </div>
      )}
    </section>
  );
}