import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../AuthContext";
import { logViewFragrance } from "../services/activityLogger";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Stars } from "../components/Stars";
import { SimplePage } from "./SimplePage";
import { TRENDING, TOP_RATED, fragranceImageUrl } from "../data/fragrances";

export function FragrancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const routeId = id ?? "";
  const isTopRated = routeId.startsWith("top-");
  const fragranceId = isTopRated ? routeId.replace("top-", "") : routeId;
  const fragrance = (isTopRated ? TOP_RATED : TRENDING).find(
    (p) => String(p.id) === fragranceId,
  );

  // Log fragrance view on mount
  useEffect(() => {
    if (fragrance && isAuthenticated && user) {
      logViewFragrance(user.email, user.name, fragrance.name);
    }
  }, [fragrance, isAuthenticated, user]);

  if (!fragrance)
    return (
      <SimplePage title="Fragrance not found" eyebrow="Catalogue">
        <button onClick={() => navigate("/explore")} className="text-[#C9A84C]">
          Return to explore
        </button>
      </SimplePage>
    );
  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-start">
        <ImageWithFallback
          src={fragranceImageUrl(fragrance.img, 800, 900)}
          alt={fragrance.name}
          className="w-full aspect-[4/5] object-cover rounded-3xl border border-white/10"
        />
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#C9A84C] mb-10"
          >
            ← Back
          </button>
          <p className="text-xs text-[#C9A84C] tracking-[0.25em] uppercase mb-3">
            {fragrance.brand}
          </p>
          <h1 className="font-display text-5xl text-[#F0EBE0] mb-6">
            {fragrance.name}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <Stars rating={fragrance.rating} />
            <span className="text-[#F0EBE0]">
              {fragrance.rating} community rating
            </span>
          </div>
          <p className="text-[#999] leading-relaxed mb-8">
            A distinctive scent profile curated for your discovery. Explore its
            accords, community reactions, and save it to your personal wardrobe.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="bg-[#C9A84C] text-[#080808] font-semibold px-7 py-3.5 rounded-full"
          >
            Add to my collection
          </button>
        </div>
      </div>
    </main>
  );
}