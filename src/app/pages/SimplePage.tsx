export function SimplePage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-8">
        <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl text-[#F0EBE0] mb-6">{title}</h1>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-[#AAA] leading-relaxed">
          {children}
        </div>
      </div>
    </main>
  );
}