import { Search, Star, Flame, Droplets } from "lucide-react";

export function FeatureStrip() {
  const features = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Discover 50K+ Scents",
      desc: "The most comprehensive fragrance database, curated with notes, accords, and seasonality.",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Community Reviews",
      desc: "Read honest ratings from 180,000+ fragrance lovers. Vote on longevity, sillage, and more.",
    },
    {
      icon: <Flame className="w-5 h-5" />,
      title: "Trending in Real Time",
      desc: "See what the community is reaching for this season across 200+ countries.",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      title: "Build Your Wardrobe",
      desc: "Organize your collection into Have It, Want It, and Had It shelves.",
    },
  ];

  return (
    <section className="bg-[#080808] py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/20 rounded-2xl p-7 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] mb-5 group-hover:bg-[#C9A84C]/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display text-lg text-[#F0EBE0] mb-2 leading-snug">
                {f.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}