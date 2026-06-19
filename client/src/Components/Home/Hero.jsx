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
    <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 text-slate-400 font-['JetBrains_Mono'] text-xs text-center p-5">
      <div className="w-16 h-16 rounded-[14px] border border-white/[0.12] bg-white/[0.04]" />
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

useGLTF.preload(phoneModel);

function PhoneCanvas() {
  const isInteracting = useRef(false);

  return (
    <PhoneErrorBoundary fallback={<PhoneFallback />}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        className="w-full h-full touch-none"
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
    <section className="relative max-w-[1280px] mx-auto px-[26px]">

      {/* ── HERO A : Split ── */}
      {heroVariant === "A" && (
        <div className="nv-hero-row flex items-center gap-10 min-h-[88vh] py-[90px_0_60px] [animation:fadeIn_.5s]">
          {/* Left */}
          <div className="flex-[1.05] [animation:fadeUp_.8s_both]">
            <div className="inline-flex items-center gap-[9px] px-[15px] py-[7px] rounded-full bg-[rgba(139,92,246,.12)] border border-[rgba(139,92,246,.35)] mb-[26px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE] [animation:glowPulse_2s_infinite] block" />
              <span className="font-['JetBrains_Mono'] text-xs tracking-[.06em] text-[#d7c9ff]">NEW · 2026 FLAGSHIP LINEUP</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-[clamp(40px,5.6vw,76px)] leading-[1.02] tracking-[-0.03em] m-0 mb-6">
              Discover the latest<br />smartphones at the<br />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">best prices.</span>
            </h1>
            <p className="max-w-[480px] text-[18.5px] leading-[1.6] text-slate-400 mt-0 mb-9">
              Original devices. Warranty included. Fast delivery across Algeria — pay on delivery, no surprises.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <button
                onClick={() => navigate("/products")}
                className="nv-mag-btn inline-flex items-center gap-2.5 px-7 py-4 border-none rounded-[15px] bg-gradient-to-br from-[#8B5CF6] to-[#6C2BD9] text-white font-['Space_Grotesk'] font-bold text-[16.5px] cursor-pointer shadow-[0_20px_46px_-14px_rgba(108,43,217,.95)]"
              >
                Shop Phones <span className="text-lg">→</span>
              </button>
              <button
                onClick={() => navigate("/products?category=Accessories")}
                className="px-7 py-4 border border-white/[0.16] rounded-[15px] bg-white/[0.04] text-white font-['Space_Grotesk'] font-bold text-[16.5px] cursor-pointer backdrop-blur-sm transition-all duration-[250ms] hover:bg-white/[0.1] hover:border-white/[0.3]"
              >
                Browse Accessories
              </button>
            </div>
            <div className="flex gap-[34px] mt-[50px]">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="font-['Space_Grotesk'] font-bold text-[30px] m-0 bg-gradient-to-r from-white to-[#22D3EE] bg-clip-text text-transparent">{s.num}</p>
                  <p className="font-['JetBrains_Mono'] text-xs text-slate-400 mt-[5px] mb-0 tracking-[.04em]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – real 3D phone */}
          <div className="flex-1 relative flex justify-center items-center min-h-[520px] [animation:scaleIn_.9s_both]">
            {/* Glow + orbit rings */}
            <div className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(108,43,217,.55),transparent_65%)] blur-[22px] [animation:glowPulse_5s_infinite] pointer-events-none" />
            <div className="absolute w-[560px] h-[560px] border border-[rgba(139,92,246,.22)] rounded-full [animation:spinSlow_40s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] border border-[rgba(34,211,238,.16)] rounded-full [animation:spinSlow_28s_linear_infinite_reverse] pointer-events-none" />

            {/* 3D canvas */}
            <div className="relative z-[3] w-[500px] h-[780px] max-w-[90vw]">
              <PhoneCanvas />
            </div>

            {/* Floating badges */}
            <div className="absolute top-[8%] left-[2%] z-[4] [animation:floatySlow_5s_ease-in-out_infinite] bg-[rgba(15,23,42,.7)] backdrop-blur-[14px] border border-white/[0.08] rounded-2xl p-[13px_16px] shadow-[0_20px_40px_-16px_rgba(0,0,0,.6)]">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#22D3EE] m-0">★ 4.9 RATING</p>
              <p className="text-[13px] mt-1 mb-0 text-white font-semibold">12,400+ reviews</p>
            </div>
            <div className="absolute bottom-[10%] right-0 z-[4] [animation:floatySlow_6s_ease-in-out_infinite_.6s] bg-[rgba(15,23,42,.7)] backdrop-blur-[14px] border border-white/[0.08] rounded-2xl p-[13px_16px] shadow-[0_20px_40px_-16px_rgba(0,0,0,.6)]">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#86efac] m-0">✓ IN STOCK</p>
              <p className="text-[13px] mt-1 mb-0 text-white font-semibold">Delivered in 48h</p>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO B : Centered ── */}
      {heroVariant === "B" && (
        <div className="relative text-center pt-[110px] pb-[70px] min-h-[88vh] flex flex-col items-center justify-center [animation:fadeIn_.5s]">
          <div className="inline-flex items-center gap-[9px] px-[15px] py-[7px] rounded-full bg-[rgba(139,92,246,.12)] border border-[rgba(139,92,246,.35)] mb-[30px] [animation:fadeUp_.6s_both]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE] [animation:glowPulse_2s_infinite] block" />
            <span className="font-['JetBrains_Mono'] text-xs tracking-[.06em] text-[#d7c9ff]">POWER YOUR EVERYDAY</span>
          </div>
          <h1 className="font-['Space_Grotesk'] font-bold text-[clamp(44px,8vw,108px)] leading-[.98] tracking-[-0.035em] m-0 [animation:fadeUp_.7s_both_.05s]">
            Discover the latest<br />
            <span className="bg-gradient-to-r from-[#8B5CF6] from-[20%] to-[#22D3EE] bg-clip-text text-transparent">smartphones.</span>
          </h1>
          <p className="max-w-[560px] text-[19px] leading-[1.6] text-slate-400 mt-7 mb-[38px] [animation:fadeUp_.7s_both_.12s]">
            Original devices at the best prices. Warranty included. Fast delivery across Algeria — pay on delivery.
          </p>
          <div className="flex gap-3.5 flex-wrap justify-center [animation:fadeUp_.7s_both_.18s]">
            <button
              onClick={() => navigate("/products")}
              className="nv-mag-btn inline-flex items-center gap-2.5 px-[30px] py-4 border-none rounded-[15px] bg-gradient-to-br from-[#8B5CF6] to-[#6C2BD9] text-white font-['Space_Grotesk'] font-bold text-[16.5px] cursor-pointer shadow-[0_20px_46px_-14px_rgba(108,43,217,.95)]"
            >
              Shop Phones <span className="text-lg">→</span>
            </button>
            <button
              onClick={() => navigate("/products?category=Accessories")}
              className="px-[30px] py-4 border border-white/[0.16] rounded-[15px] bg-white/[0.04] text-white font-['Space_Grotesk'] font-bold text-[16.5px] cursor-pointer"
            >
              Browse Accessories
            </button>
          </div>

          {/* Centered 3D phone */}
          <div className="relative mt-10 w-[440px] h-[660px] max-w-[90vw] [animation:scaleIn_1s_both_.2s]">
            <div className="absolute w-[360px] h-[260px] rounded-full bg-[radial-gradient(ellipse,rgba(108,43,217,.5),transparent_65%)] blur-[30px] bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" />
            <PhoneCanvas />
          </div>
        </div>
      )}
    </section>
  );
}
