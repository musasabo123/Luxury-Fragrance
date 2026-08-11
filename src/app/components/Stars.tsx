import { Star } from "lucide-react";

export function Stars({ rating, sm }: { rating: number; sm?: boolean }) {
  const sz = sm ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${
            i <= Math.floor(rating)
              ? "fill-[#C9A84C] text-[#C9A84C]"
              : i - 0.5 <= rating
                ? "fill-[#C9A84C]/50 text-[#C9A84C]"
                : "text-white/15"
          }`}
        />
      ))}
    </span>
  );
}