import { useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { TOP_RATED, fragranceImageUrl } from "../data/fragrances";
import { Stars } from "./Stars";

export function TopRatedSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const CARD_W = 280;
  const GAP = 20;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? CARD_W + GAP : -(CARD_W + GAP),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="top-rated"
      className="bg-[#0C0C0C] py-16 sm:py-28 border-t border-white/5"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
              Highest Rated
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">
              Top Rated Fragrances
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-white/12 flex items-center justify-center text-[#666] hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-white/12 flex items-center justify-center text-[#666] hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {TOP_RATED.map((p, i) => (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/fragrance/top-${p.id}`)}
              whileHover={{
                y: -6,
                scale: 1.01,
                transition: { duration: 0.16, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.99 }}
              className="flex-shrink-0 w-[280px] group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(201,168,76,0.08)] cursor-pointer glow-strong"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative h-[220px] bg-[#1A1A1A] overflow-hidden">
                <img
                  src={fragranceImageUrl(p.img, 300, 230)}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg pointer-events-none">
                  <span className="text-[11px] font-bold text-[#080808]">
                    #{i + 1}
                  </span>
                </div>
              </div>

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
                    <span className="text-xs font-mono-label text-[#C9A84C]">
                      {p.rating}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono-label text-[#555]">
                      {p.votes} votes
                    </div>
                    <div className="text-[10px] font-mono-label text-[#555]">
                      {p.year}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}