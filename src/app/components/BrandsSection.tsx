import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { BRANDS } from "../data/fragrances";

export function BrandsSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#080808] py-16 sm:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
            Curated Houses
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">
            Popular Brands
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <motion.button
              key={brand.name}
              onClick={() =>
                navigate(`/brands?selected=${encodeURIComponent(brand.name)}`)
              }
              whileHover={{
                translateY: -2,
                scale: 1.008,
                backgroundColor: "#141414",
                borderColor: "rgba(201, 168, 76, 0.3)",
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group flex flex-col items-center justify-center gap-1.5 bg-[#111111] border border-white/6 rounded-2xl px-6 py-6 transition-shadow duration-300 ease-out hover:shadow-[0_8px_32px_rgba(201,168,76,0.06)] cursor-pointer"
            >
                <div className="font-display text-base text-[var(--color-muted-foreground)] group-hover:text-[#C9A84C]/60 transition-colors duration-300 ease-out tracking-wide leading-tight text-center">
                {brand.name}
                </div>
                <div className="text-[10px] font-mono-label text-[var(--color-muted-foreground)] group-hover:text-[#C9A84C]/60 transition-colors duration-300 ease-out">
                Est. {brand.founded}
                </div>
            </motion.button>
             ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/brands")}
            className="inline-flex items-center gap-2.5 text-sm text-[#666] hover:text-[#C9A84C] border border-white/10 hover:border-[#C9A84C]/25 rounded-full px-7 py-3 transition-all cursor-pointer"
          >
            Browse all 12,000+ brands <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
