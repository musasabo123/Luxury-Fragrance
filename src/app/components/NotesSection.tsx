import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { NOTES } from "../data/fragrances";

export function NotesSection() {
  const [active, setActive] = useState("Oud");
  const navigate = useNavigate();

  return (
    <section className="bg-[#0C0C0C] py-16 sm:py-28 border-y border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
            Filter by Ingredient
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0] mb-4">
            Browse by Fragrance Notes
          </h2>
          <p className="text-[#666] text-sm sm:text-base max-w-md mx-auto">
            Every great fragrance is a story told in notes. Start with what
            moves you.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {NOTES.map((note) => {
            const isActive = active === note.name;
            return (
              <motion.button
                key={note.name}
                onClick={() => setActive(note.name)}
                whileHover={{ translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col items-center gap-2.5 p-5 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A84C]/10 border-[#C9A84C]/35 shadow-[0_0_30px_rgba(201,168,76,0.1)]"
                    : "bg-[#111111] border-white/6 hover:border-white/15 hover:bg-[#161616]"
                }`}
              >
                <span className="text-[28px] leading-none">{note.emoji}</span>
                <span
                  className={`text-sm font-medium ${isActive ? "text-[#C9A84C]" : "text-[#F0EBE0]/75"}`}
                >
                  {note.name}
                </span>
                <span className="text-[10px] font-mono-label text-[#555]">
                  {note.count}
                </span>
                {isActive && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active note hint */}
        <button
          onClick={() =>
            navigate(`/explore?note=${encodeURIComponent(active)}`)
          }
          className="flex items-center justify-center gap-3 text-sm text-[#666] hover:text-[#C9A84C] transition-colors mx-auto cursor-pointer"
        >
          <span>Showing</span>
          <span className="text-[#C9A84C] font-medium">
            {NOTES.find((n) => n.name === active)?.count}
          </span>
          <span>fragrances with</span>
          <span className="text-[#F0EBE0]">{active}</span>
          <span>notes</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
        </button>
      </div>
    </section>
  );
}