import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

const BRAND_GRADIENTS = [
  ["#6C2BD9", "#4C1D95"],
  ["#0EA5E9", "#0369A1"],
  ["#10B981", "#065F46"],
  ["#F59E0B", "#92400E"],
  ["#EC4899", "#9D174D"],
  ["#22D3EE", "#0E7490"],
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/phone-brands`)
      .then((res) => {
        console.log("Phone Brands:", res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Failed to load phone brands:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[320px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            Shop By Brand
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Explore Every Phone Brand
          </h2>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          View All →
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, idx) => {
          const [g1, g2] =
            BRAND_GRADIENTS[idx % BRAND_GRADIENTS.length];

          return (
            <div
              key={cat._id}
              onClick={() =>
                navigate(
                  `/products?brand=${encodeURIComponent(cat.name)}`
                )
              }
              className="group relative min-h-[320px] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              {/* Gradient Background */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at 50% 120%, ${g1}, transparent 70%)`,
                }}
              />

              {/* Glow Blob */}
              <div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-50 blur-3xl"
                style={{
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                }}
              />

              {/* Brand Logo Background */}
              {cat.logo?.url && (
                <div className="absolute inset-0">
                  <img
                    src={cat.logo.url}
                    alt={cat.name}
                    className="h-full w-full object-cover opacity-20 transition duration-700 group-hover:scale-110 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between p-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                    Phone Brand
                  </span>
                </div>

                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && categories.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          No phone brands found.
        </div>
      )}
    </section>
  );
}