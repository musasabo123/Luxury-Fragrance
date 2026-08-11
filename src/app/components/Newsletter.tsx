import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[#0C0C0C] py-16 sm:py-28 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="relative bg-[#111111] border border-[#C9A84C]/15 rounded-2xl sm:rounded-3xl px-6 sm:px-12 lg:px-16 py-12 sm:py-16 overflow-hidden">
          {/* Background glows */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[200px] bg-[#C9A84C]/4 blur-[100px] pointer-events-none" />
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#C9A84C]/3 blur-[60px] pointer-events-none" />

          {/* Decorative note icons */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 opacity-20">
            <div className="text-6xl">🌿</div>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20">
            <div className="text-6xl">🌹</div>
          </div>

          <div className="relative text-center max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-7">
              <Mail className="w-6 h-6 text-[#C9A84C]" />
            </div>

            <h2 className="font-display text-5xl text-[#F0EBE0] mb-5">
              Stay in the Know
            </h2>
            <p className="text-[#777] text-base mb-10 leading-relaxed">
              Weekly fragrance recommendations, new launches, and exclusive
              community picks — delivered to your inbox every Thursday.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-8 py-4">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[#C9A84C] font-medium">
                  You&apos;re on the list — thank you!
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-[#1A1A1A] border border-white/10 focus:border-[#C9A84C]/40 rounded-full px-6 py-4 text-sm text-[#F0EBE0] placeholder-[#444] outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold text-sm px-8 py-4 rounded-full transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shadow-[0_4px_20px_rgba(201,168,76,0.3)] cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-[#444] mt-5">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}