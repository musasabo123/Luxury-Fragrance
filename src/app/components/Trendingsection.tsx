import { useNavigate, Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { TRENDING, fragranceImageUrl } from "../data/fragrances";
import { Stars } from "./Stars";

export function TrendingSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#080808] py-16 sm:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
              Community Picks
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">
              Trending Perfumes
            </h2>
          </div>
          <Link
            to="/explore?sort=trending"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#C9A84C] transition-colors group cursor-pointer"
          >
            View all trending
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRENDING.map((p, i) => (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/fragrance/${p.id}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -6,
                scale: 1.01,
                transition: { duration: 0.16, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className="group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(201,168,76,0.08)] cursor-pointer glow-strong"
            >
              {/* Image */}
              <div className="relative h-[230px] bg-[#1A1A1A] overflow-hidden">
                <ImageWithFallback
                  src={fragranceImageUrl(p.img, 340, 240)}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 bg-[#080808]/70 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-[#C9A84C] tracking-wider pointer-events-none">
                  {p.tag}
                </div>
                <div className="absolute top-4 right-4 font-mono-label text-xs text-[#555] pointer-events-none">
                  #{String(i + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-[11px] text-[#C9A84C] tracking-[0.18em] uppercase mb-1">
                  {p.brand}
                </p>
                <h3 className="font-display text-lg text-[#F0EBE0] leading-snug mb-4">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars rating={p.rating} sm />
                    <span className="text-xs text-[#666] font-mono-label">
                      {(p.reviews / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <span className="text-sm text-[#C9A84C] font-mono-label tracking-wider">
                    {p.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}