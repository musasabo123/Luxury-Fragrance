import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { logSearch } from "../services/activityLogger";
import { Stars } from "./Stars";

export function Hero() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const search = () => {
    const value = query.trim();
    if (value && isAuthenticated && user) {
      logSearch(user.email, user.name, value);
    }
    navigate(value ? `/explore?q=${encodeURIComponent(value)}` : "/explore");
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className="relative min-h-screen bg-[#080808] flex items-center overflow-hidden pt-[68px]"
    >
      {/* Ambient glows */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute right-[15%] top-1/3 w-[400px] h-[400px] bg-[#C9A84C]/4 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-1/4 w-[300px] h-[300px] bg-[#C9A84C]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 w-full grid lg:grid-cols-[1fr_520px] gap-8 sm:gap-12 xl:gap-20 items-center py-12 sm:py-16">
        {/* ── Left ── */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-10">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
            <span className="text-xs text-[#C9A84C] tracking-[0.22em] uppercase font-medium">
              Discover · Rate · Collect
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(52px,5.5vw,84px)] leading-[1.03] text-[#F0EBE0] mb-7">
            Find Your
            <br />
            <em className="text-[#C9A84C] not-italic">Signature</em>
            <br />
            Fragrance
          </h1>

          <p className="text-[#F0EBE0]/50 text-lg leading-relaxed mb-10 max-w-[480px]">
            Explore over 50,000 fragrances. Discover notes, read community
            reviews, and build your personal scent wardrobe.
          </p>

          {/* Search bar */}
          <div className="relative mb-8 max-w-[520px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search by perfume, brand, or note…"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#C9A84C]/40 rounded-full pl-12 pr-[120px] py-4 text-[15px] text-[#F0EBE0] placeholder-[#444] outline-none transition-colors"
            />
            <motion.button
              onClick={search}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] text-xs font-semibold tracking-wide px-5 py-2.5 rounded-full transition-all active:scale-95 glow-strong cursor-pointer"
            >
              Search
            </motion.button>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <motion.button
              onClick={() => navigate("/explore")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold text-sm px-8 py-4 rounded-full transition-all active:scale-[0.98] shadow-[0_8px_32px_rgba(201,168,76,0.25)] glow-strong cursor-pointer w-full sm:w-auto justify-center"
            >
              Explore Now <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() =>
                document
                  .getElementById("top-rated")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-3 text-[#F0EBE0]/60 hover:text-[#F0EBE0] text-sm transition-colors group cursor-pointer"
            >
              <span className="w-11 h-11 rounded-full border border-white/15 group-hover:border-[#C9A84C]/40 flex items-center justify-center transition-all group-hover:bg-[#C9A84C]/8">
                <ChevronRight className="w-4 h-4" />
              </span>
              View Top Rated
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/7">
            {[
              ["50K+", "Fragrances"],
              ["180K+", "Reviews"],
              ["12K+", "Brands"],
              ["4.9 ★", "App Rating"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-display text-2xl text-[#F0EBE0] mb-0.5">
                  {val}
                </div>
                <div className="text-xs text-[#666] tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Bottle ── */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Outer ring glow */}
          <div className="absolute inset-0 bg-[#C9A84C]/6 rounded-3xl blur-3xl" />

          <div className="relative w-full aspect-[9/10] rounded-3xl overflow-hidden border border-[#C9A84C]/12 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            <img
              src="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=560&h=620&fit=crop&auto=format"
              alt="Luxury perfume bottle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-[#080808]/10 to-transparent" />
          </div>

          {/* Floating: Rating */}
          <div className="absolute -left-10 top-[28%] bg-[#111111]/95 backdrop-blur-sm border border-[#C9A84C]/20 rounded-2xl px-5 py-4 shadow-2xl">
            <div className="text-[10px] text-[#666] tracking-[0.15em] uppercase mb-2">
              Community Rating
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-[#F0EBE0]">4.9</span>
              <div className="flex flex-col gap-1">
                <Stars rating={5} />
                <span className="text-[10px] text-[#666] font-mono-label">
                  34.2k votes
                </span>
              </div>
            </div>
          </div>

          {/* Floating: Trending */}
          <div className="absolute -right-6 bottom-[28%] bg-[#111111]/95 backdrop-blur-sm border border-[#C9A84C]/20 rounded-2xl px-5 py-4 shadow-2xl max-w-[200px]">
            <div className="text-[10px] text-[#C9A84C] tracking-[0.15em] uppercase mb-1.5">
              🔥 Trending Now
            </div>
            <div className="text-sm font-medium text-[#F0EBE0] leading-snug">
              Baccarat Rouge 540
            </div>
            <div className="text-xs text-[#666] mt-0.5">
              Maison Francis Kurkdjian
            </div>
          </div>

          {/* Floating: Note pill */}
          <div className="absolute left-[10%] bottom-10 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-4 py-2">
            <span className="text-xs text-[#C9A84C] tracking-wide">
              Floral · Woody · Amber
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}