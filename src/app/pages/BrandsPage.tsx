import { useNavigate, useSearchParams } from "react-router";
import { BRANDS } from "../data/fragrances";

export function BrandsPage() {
  const [params] = useSearchParams();
  const selected = params.get("selected");
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-8">
        <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
          Curated Houses
        </p>
        <h1 className="font-display text-5xl text-[var(--color-foreground)] mb-4">
          Fragrance Brands
        </h1>
        <p className="text-[var(--color-muted-foreground)] mb-10">
          {selected
            ? `Browsing ${selected}. Choose another house below.`
            : "Discover the houses behind the world's most memorable scents."}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANDS.map((brand) => (
            <button
              onClick={() =>
                navigate(`/explore?q=${encodeURIComponent(brand.name)}`)
              }
              key={brand.name}
              className="brand-card text-left bg-[#111] border border-white/10 rounded-2xl p-6 transition-colors cursor-pointer"
            >
              <h2 className="brand-card-title font-display text-xl text-[var(--color-foreground)] font-medium transition-colors">
                {brand.name}
              </h2>
              <p className="brand-card-detail text-sm text-[var(--color-muted-foreground)] mt-2 transition-colors">
                Established {brand.founded}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}