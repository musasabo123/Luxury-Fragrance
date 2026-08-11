import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { logSearch } from "../services/activityLogger";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Stars } from "../components/Stars";
import {
  ALL_FRAGRANCES,
  fragranceImageUrl,
  fragranceRoute,
} from "../data/fragrances";

export function ExplorePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const term = (params.get("q") ?? "").toLowerCase();
  const selectedNote = params.get("note");
  const results = ALL_FRAGRANCES.filter(
    (p) =>
      (!term || `${p.name} ${p.brand}`.toLowerCase().includes(term)) &&
      (!selectedNote || p.notes.includes(selectedNote)),
  );
  const runSearch = () => {
    const value = query.trim();
    if (value && isAuthenticated && user) {
      logSearch(user.email, user.name, value);
    }
    setParams(value ? { q: value } : {});
  };

  return (
    <main className="min-h-screen bg-[#080808] pt-28 sm:pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
          Discovery catalogue
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0] mb-6 sm:mb-8">
          Explore Fragrances
        </h1>
        <div className="flex flex-col sm:flex-row max-w-2xl gap-3 mb-8 sm:mb-12">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search perfumes or brands"
            className="flex-1 bg-[#141414] border border-white/10 focus:border-[#C9A84C]/40 rounded-full px-6 py-4 text-[#F0EBE0] outline-none"
          />
          <button
            onClick={runSearch}
            className="explore-search-button bg-[#C9A84C] text-[#080808] font-semibold px-7 py-3 rounded-full transition-all cursor-pointer"
          >
            Search
          </button>
        </div>
        <p className="text-sm text-[#777] mb-6">
          {results.length} fragrance{results.length === 1 ? "" : "s"} found
          {term && ` for "${params.get("q")}"`}
          {selectedNote && ` with ${selectedNote} notes`}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((p) => (
            <motion.button
              key={`${p.name}-${p.brand}`}
              onClick={() => navigate(fragranceRoute(p))}
              whileHover={{
                y: -6,
                scale: 1.01,
                transition: { duration: 0.16, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.99 }}
              className="text-left group bg-[#111] border border-white/10 hover:border-[#C9A84C]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(201,168,76,0.08)] cursor-pointer glow-strong"
            >
              <ImageWithFallback
                src={fragranceImageUrl(p.img, 500, 360)}
                alt={p.name}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5">
                <p className="text-xs text-[#C9A84C] mb-1 transition-colors group-hover:text-[#F0EBE0]">
                  {p.brand}
                </p>
                <h2 className="font-display text-xl text-[#F0EBE0] transition-colors group-hover:text-[#C9A84C]">
                  {p.name}
                </h2>
                <div className="mt-3 flex items-center gap-2">
                  <Stars rating={p.rating} sm />
                  <span className="text-xs text-[#777] transition-colors group-hover:text-[#F0EBE0]">
                    {p.rating}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        {!results.length && (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-[#777]">
            No exact match yet. Try a perfume or brand name from the collection.
          </div>
        )}
      </div>
    </main>
  );
}