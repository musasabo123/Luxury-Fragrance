import { useEffect, useState, useRef } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  Search, Star, ChevronRight, ChevronLeft, ArrowRight,
  Instagram, Twitter, Youtube, Mail, Menu, X, Flame,
  Droplets, Wind, Sparkles, Eye, EyeOff, Check,
} from "lucide-react";
import { Sun, Moon } from "lucide-react";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { motion } from "motion/react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { logSearch, logViewFragrance } from "./services/activityLogger";

const MotionLink = motion(Link);
const MotionAnchor = motion.a;

// ─── Data ─────────────────────────────────────────────────────

const TRENDING = [
  {
    id: 1, name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian",
    rating: 4.8, reviews: 12400, price: "$$$$",
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.33519.jpg", tag: "Floral · Woody", notes: ["Floral", "Woody", "Amber"],
  },
  {
    id: 2, name: "Santal 33", brand: "Le Labo",
    rating: 4.7, reviews: 9870, price: "$$$",
    img: "https://cms.brnstc.de/product_images/680x930_retina/cpro/media/images/product/24/5/842185115861_0_1715333945614.jpg", tag: "Woody · Aromatic", notes: ["Woody", "Leather"],
  },
  {
    id: 3, name: "Oud Wood", brand: "Tom Ford",
    rating: 4.6, reviews: 8340, price: "$$$$",
    img: "https://www.tomfordbeauty.com/cdn/shop/files/tf_sku_T1XF01_2000x2000_0.png?v=1784519770&width=2000", tag: "Oriental · Woody", notes: ["Oud", "Woody", "Amber"],
  },
  {
    id: 4, name: "Blanche", brand: "Byredo",
    rating: 4.5, reviews: 6120, price: "$$$",
    img: "https://www.byredo.com/media/catalog/product/cache/ce8f7c988c2643ead2f5aa8c72454f56/1/0/10000052_1_full_no.jpg", tag: "Floral · Powdery", notes: ["Floral", "Vanilla"],
  },
];

const NOTES = [
  { name: "Oud",     emoji: "🪵", count: "1,240", color: "#8B6F47" },
  { name: "Vanilla", emoji: "🤍", count: "2,380", color: "#D4C4A0" },
  { name: "Citrus",  emoji: "🍋", count: "3,150", color: "#D4B84A" },
  { name: "Amber",   emoji: "🟡", count: "1,890", color: "#C9853E" },
  { name: "Leather", emoji: "🖤", count: "980",   color: "#6B5040" },
  { name: "Rose",    emoji: "🌹", count: "2,640", color: "#B87087" },
  { name: "Aquatic", emoji: "💧", count: "1,320", color: "#4A8FA6" },
  { name: "Woody",   emoji: "🌲", count: "2,100", color: "#5A7A5A" },
];

const BRANDS = [
  { name: "Tom Ford",          founded: "2006" },
  { name: "Chanel",            founded: "1910" },
  { name: "Dior",              founded: "1947" },
  { name: "Creed",             founded: "1760" },
  { name: "Byredo",            founded: "2006" },
  { name: "Le Labo",           founded: "2006" },
  { name: "Maison Margiela",   founded: "1984" },
  { name: "Guerlain",          founded: "1828" },
  { name: "Hermès",            founded: "1837" },
  { name: "Kilian Paris",      founded: "2007" },
];

const TOP_RATED = [
  { id: 1, name: "Aventus",            brand: "Creed",           rating: 4.9, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.9828.jpg", year: 2010, votes: "34.2k", notes: ["Citrus", "Woody"] },
  { id: 2, name: "Noir de Noir",       brand: "Tom Ford",        rating: 4.8, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1822.jpg", year: 2007, votes: "21.7k", notes: ["Rose", "Oud", "Woody"] },
  { id: 3, name: "Portrait of a Lady", brand: "Frédéric Malle",  rating: 4.8, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.10464.jpg", year: 2010, votes: "18.9k", notes: ["Rose", "Woody"] },
  { id: 4, name: "Tobacco Vanille",    brand: "Tom Ford",        rating: 4.8, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1825.jpg", year: 2007, votes: "29.1k", notes: ["Vanilla", "Woody"] },
  { id: 5, name: "Neroli Portofino",   brand: "Tom Ford",        rating: 4.7, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.12192.jpg", year: 2011, votes: "15.3k", notes: ["Citrus", "Aquatic"] },
  { id: 6, name: "Encre Noire",        brand: "Lalique",         rating: 4.7, img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1834.jpg", year: 2006, votes: "11.8k", notes: ["Woody"] },
];

const fragranceImageUrl = (image: string, width: number, height: number) =>
  image.startsWith("http")
    ? image
    : `https://images.unsplash.com/photo-${image}?w=${width}&h=${height}&fit=crop&auto=format`;

// ─── Helpers ──────────────────────────────────────────────────

function Stars({ rating, sm }: { rating: number; sm?: boolean }) {
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

function GoldDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/25" />
      <Sparkles className="w-3 h-3 text-[#C9A84C]/50" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/25" />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { label: "Home", to: "/" }, { label: "Explore", to: "/explore" },
    { label: "Brands", to: "/brands" }, { label: "Collections", to: "/collections" },
    { label: "About", to: "/about" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
  <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-[68px] flex items-center gap-4 sm:gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-interactive font-display text-lg sm:text-xl tracking-[0.12em] text-[var(--color-foreground)] hover:text-[#C9A84C] flex items-center gap-2.5 flex-shrink-0 transition-colors cursor-pointer"
        >
          <span className="text-[#C9A84C] text-base">✦</span>
          ScentBase
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {links.map((link) => (
            <MotionLink
              key={link.label}
              to={link.to}
              whileHover={{ y: -1, scale: 1.01 }}
              transition={{ duration: 0.18 }}
              className={`navbar-interactive px-4 py-2 text-sm rounded-full transition-colors transition-shadow ${
                location.pathname === link.to
                  ? "text-[#C9A84C] bg-[#C9A84C]/8 shadow-[0_8px_24px_rgba(201,168,76,0.16)] cursor-pointer"
                  : "text-[var(--color-muted-foreground)] hover:text-[#C9A84C] hover:bg-[var(--color-secondary)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.12)] cursor-pointer"
              }`}
            >
              {link.label}
            </MotionLink>
          ))}
        </div>

        {/* Search hint */}
        <MotionLink
          to="/explore"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.18 }}
          className="navbar-interactive hidden lg:flex items-center gap-2 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-colors transition-shadow hover:shadow-[0_10px_30px_rgba(201,168,76,0.08)] w-[250px] h-10 flex-shrink-0 [&>span]:whitespace-nowrap cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[var(--color-muted-foreground)] flex-shrink-0" />
          <span>Search fragrances…</span>
          <span className="ml-auto text-[10px] font-mono-label bg-white/8 rounded px-1.5 py-0.5 text-[#555]">⌘K</span>
        </MotionLink>

        {/* Auth + Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <motion.button
            aria-label="Toggle theme"
            onClick={() => toggleTheme()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="navbar-interactive p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[#C9A84C] text-[var(--color-foreground)] transition-colors transition-shadow hover:shadow-[0_6px_18px_rgba(201,168,76,0.08)] cursor-pointer"
          >
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="navbar-interactive text-sm text-[#C9A84C] hover:text-[#D4B05A] transition-colors px-3 py-2 cursor-pointer"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-[var(--color-muted-foreground)] px-3 py-2">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] transition-colors px-3 py-2 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MotionLink
                to="/login"
                whileHover={{ y: -1, scale: 1.02 }}
                transition={{ duration: 0.16 }}
                className="navbar-interactive text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] transition-colors transition-shadow hover:shadow-[0_6px_18px_rgba(201,168,76,0.08)] px-3 py-2 cursor-pointer"
              >
                Login
              </MotionLink>
              <MotionLink
                to="/signup"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="text-sm font-medium text-[#080808] bg-[#C9A84C] hover:bg-[#D4B05A] transition-all transition-shadow hover:shadow-[0_12px_36px_rgba(201,168,76,0.14)] px-6 py-2.5 rounded-full glow-strong cursor-pointer"
              >
                Sign Up
              </MotionLink>
            </>
          )}
        </div>

        <button className="navbar-interactive lg:hidden ml-auto text-[var(--color-foreground)] hover:text-[#C9A84C] transition-colors cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden px-4 sm:px-8 py-5" style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="navbar-interactive block py-3 text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] border-b border-[var(--color-border)] last:border-0 transition-colors cursor-pointer">
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="navbar-interactive flex-1 text-center text-sm text-[#C9A84C] border border-[#C9A84C]/30 py-2.5 rounded-full hover:text-[#D4B05A] transition-colors cursor-pointer">
                    Admin
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setOpen(false); }} className="flex-1 text-center text-sm text-[var(--color-foreground)] border border-[var(--color-border)] py-2.5 rounded-full hover:text-[#C9A84C] transition-colors cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="navbar-interactive flex-1 text-center text-sm text-[var(--color-foreground)] border border-[var(--color-border)] py-2.5 rounded-full hover:text-[#C9A84C] transition-colors cursor-pointer">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium text-[#080808] bg-[#C9A84C] py-2.5 rounded-full hover:bg-[#D4B05A] transition-colors cursor-pointer">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const search = () => {
    const value = query.trim();
    if (value && isAuthenticated && user) {
      logSearch(user.email, user.name, value);
    }
    navigate(value ? `/explore?q=${encodeURIComponent(value)}` : "/explore");
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className="relative min-h-screen bg-[#080808] flex items-center overflow-hidden pt-[68px]"
    >
      {/* Ambient glows */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute right-[15%] top-1/3 w-[400px] h-[400px] bg-[#C9A84C]/4 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-1/4 w-[300px] h-[300px] bg-[#C9A84C]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 w-full grid lg:grid-cols-[1fr_520px] gap-8 sm:gap-12 xl:gap-20 items-center py-12 sm:py-16">
        {/* ── Left ── */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-10">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
            <span className="text-xs text-[#C9A84C] tracking-[0.22em] uppercase font-medium">
              Discover · Rate · Collect
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(52px,5.5vw,84px)] leading-[1.03] text-[#F0EBE0] mb-7">
            Find Your<br />
            <em className="text-[#C9A84C] not-italic">Signature</em><br />
            Fragrance
          </h1>

          <p className="text-[#F0EBE0]/50 text-lg leading-relaxed mb-10 max-w-[480px]">
            Explore over 50,000 fragrances. Discover notes, read community
            reviews, and build your personal scent wardrobe.
          </p>

          {/* Search bar */}
          <div className="relative mb-8 max-w-[520px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search by perfume, brand, or note…"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#C9A84C]/40 rounded-full pl-12 pr-[120px] py-4 text-[15px] text-[#F0EBE0] placeholder-[#444] outline-none transition-colors"
            />
            <motion.button
              onClick={search}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] text-xs font-semibold tracking-wide px-5 py-2.5 rounded-full transition-all active:scale-95 glow-strong cursor-pointer"
            >
              Search
            </motion.button>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <motion.button
              onClick={() => navigate("/explore")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold text-sm px-8 py-4 rounded-full transition-all active:scale-[0.98] shadow-[0_8px_32px_rgba(201,168,76,0.25)] glow-strong cursor-pointer w-full sm:w-auto justify-center"
            >
              Explore Now <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button onClick={() => document.getElementById("top-rated")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-3 text-[#F0EBE0]/60 hover:text-[#F0EBE0] text-sm transition-colors group cursor-pointer">
              <span className="w-11 h-11 rounded-full border border-white/15 group-hover:border-[#C9A84C]/40 flex items-center justify-center transition-all group-hover:bg-[#C9A84C]/8">
                <ChevronRight className="w-4 h-4" />
              </span>
              View Top Rated
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/7">
            {[
              ["50K+", "Fragrances"],
              ["180K+", "Reviews"],
              ["12K+", "Brands"],
              ["4.9 ★", "App Rating"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-display text-2xl text-[#F0EBE0] mb-0.5">{val}</div>
                <div className="text-xs text-[#666] tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Bottle ── */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Outer ring glow */}
          <div className="absolute inset-0 bg-[#C9A84C]/6 rounded-3xl blur-3xl" />

          <div className="relative w-full aspect-[9/10] rounded-3xl overflow-hidden border border-[#C9A84C]/12 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            <img
              src="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=560&h=620&fit=crop&auto=format"
              alt="Luxury perfume bottle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-[#080808]/10 to-transparent" />
          </div>

          {/* Floating: Rating */}
          <div className="absolute -left-10 top-[28%] bg-[#111111]/95 backdrop-blur-sm border border-[#C9A84C]/20 rounded-2xl px-5 py-4 shadow-2xl">
            <div className="text-[10px] text-[#666] tracking-[0.15em] uppercase mb-2">Community Rating</div>
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-[#F0EBE0]">4.9</span>
              <div className="flex flex-col gap-1">
                <Stars rating={5} />
                <span className="text-[10px] text-[#666] font-mono-label">34.2k votes</span>
              </div>
            </div>
          </div>

          {/* Floating: Trending */}
          <div className="absolute -right-6 bottom-[28%] bg-[#111111]/95 backdrop-blur-sm border border-[#C9A84C]/20 rounded-2xl px-5 py-4 shadow-2xl max-w-[200px]">
            <div className="text-[10px] text-[#C9A84C] tracking-[0.15em] uppercase mb-1.5">🔥 Trending Now</div>
            <div className="text-sm font-medium text-[#F0EBE0] leading-snug">Baccarat Rouge 540</div>
            <div className="text-xs text-[#666] mt-0.5">Maison Francis Kurkdjian</div>
          </div>

          {/* Floating: Note pill */}
          <div className="absolute left-[10%] bottom-10 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-4 py-2">
            <span className="text-xs text-[#C9A84C] tracking-wide">Floral · Woody · Amber</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#444]">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#444] to-transparent" />
      </div>
    </motion.section>
  );
}

// ─── Trending ─────────────────────────────────────────────────

function TrendingSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#080808] py-16 sm:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Community Picks</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">Trending Perfumes</h2>
          </div>
          <Link
            to="/explore?sort=trending"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#C9A84C] transition-colors group cursor-pointer"
          >
            View all trending
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRENDING.map((p, i) => (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/fragrance/${p.id}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.16, ease: "easeOut" } }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className="group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(201,168,76,0.08)] cursor-pointer glow-strong"
            >
              {/* Image */}
              <div className="relative h-[230px] bg-[#1A1A1A] overflow-hidden">
                <ImageWithFallback
                  src={fragranceImageUrl(p.img, 340, 240)}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 bg-[#080808]/70 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-[#C9A84C] tracking-wider pointer-events-none">
                  {p.tag}
                </div>
                <div className="absolute top-4 right-4 font-mono-label text-xs text-[#555] pointer-events-none">
                  #{String(i + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-[11px] text-[#C9A84C] tracking-[0.18em] uppercase mb-1">{p.brand}</p>
                <h3 className="font-display text-lg text-[#F0EBE0] leading-snug mb-4">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars rating={p.rating} sm />
                    <span className="text-xs text-[#666] font-mono-label">
                      {(p.reviews / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <span className="text-sm text-[#C9A84C] font-mono-label tracking-wider">{p.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Notes ────────────────────────────────────────────────────

function NotesSection() {
  const [active, setActive] = useState("Oud");
  const navigate = useNavigate();

  return (
    <section className="bg-[#0C0C0C] py-16 sm:py-28 border-y border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Filter by Ingredient</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0] mb-4">
            Browse by Fragrance Notes
          </h2>
          <p className="text-[#666] text-sm sm:text-base max-w-md mx-auto">
            Every great fragrance is a story told in notes. Start with what moves you.
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
                <span className={`text-sm font-medium ${isActive ? "text-[#C9A84C]" : "text-[#F0EBE0]/75"}`}>
                  {note.name}
                </span>
                <span className="text-[10px] font-mono-label text-[#555]">{note.count}</span>
                {isActive && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active note hint */}
        <button onClick={() => navigate(`/explore?note=${encodeURIComponent(active)}`)} className="flex items-center justify-center gap-3 text-sm text-[#666] hover:text-[#C9A84C] transition-colors mx-auto cursor-pointer">
          <span>Showing</span>
          <span className="text-[#C9A84C] font-medium">{NOTES.find((n) => n.name === active)?.count}</span>
          <span>fragrances with</span>
          <span className="text-[#F0EBE0]">{active}</span>
          <span>notes</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
        </button>
      </div>
    </section>
  );
}

// ─── Brands ───────────────────────────────────────────────────

function BrandsSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#080808] py-16 sm:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Curated Houses</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">Popular Brands</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <motion.button
              key={brand.name}
              onClick={() => navigate(`/brands?selected=${encodeURIComponent(brand.name)}`)}
              whileHover={{ translateY: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 230, damping: 20 }}
              className="group flex flex-col items-center justify-center gap-1.5 bg-[#111111] border border-white/6 hover:border-[#C9A84C]/30 rounded-2xl px-6 py-6 transition-all duration-200 hover:bg-[#141414] hover:shadow-[0_8px_32px_rgba(201,168,76,0.06)] cursor-pointer"
            >
              <div className="font-display text-basetext-[#555] group-hover:text-[#C9A84C]/60 transition-colors tracking-wide leading-tight text-center">
                {brand.name}
              </div>
              <div className="text-[10px] font-mono-label text-[#555] group-hover:text-[#C9A84C]/60 transition-colors">
                Est. {brand.founded}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => navigate("/brands")} className="inline-flex items-center gap-2.5 text-sm text-[#666] hover:text-[#C9A84C] border border-white/10 hover:border-[#C9A84C]/25 rounded-full px-7 py-3 transition-all cursor-pointer">
            Browse all 12,000+ brands <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Top Rated Carousel ───────────────────────────────────────

function TopRatedSection() {
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
    <section id="top-rated" className="bg-[#0C0C0C] py-16 sm:py-28 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Highest Rated</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0]">Top Rated Fragrances</h2>
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
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.16, ease: "easeOut" } }}
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
                  <span className="text-[11px] font-bold text-[#080808]">#{i + 1}</span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-[11px] text-[#C9A84C] tracking-[0.18em] uppercase mb-1">{p.brand}</p>
                <h3 className="font-display text-lg text-[#F0EBE0] leading-snug mb-4">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars rating={p.rating} sm />
                    <span className="text-xs font-mono-label text-[#C9A84C]">{p.rating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono-label text-[#555]">{p.votes} votes</div>
                    <div className="text-[10px] font-mono-label text-[#555]">{p.year}</div>
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

// ─── Feature Strip ────────────────────────────────────────────

function FeatureStrip() {
  const features = [
    { icon: <Search className="w-5 h-5" />, title: "Discover 50K+ Scents", desc: "The most comprehensive fragrance database, curated with notes, accords, and seasonality." },
    { icon: <Star className="w-5 h-5" />, title: "Community Reviews", desc: "Read honest ratings from 180,000+ fragrance lovers. Vote on longevity, sillage, and more." },
    { icon: <Flame className="w-5 h-5" />, title: "Trending in Real Time", desc: "See what the community is reaching for this season across 200+ countries." },
    { icon: <Droplets className="w-5 h-5" />, title: "Build Your Wardrobe", desc: "Organize your collection into Have It, Want It, and Had It shelves." },
  ];

  return (
    <section className="bg-[#080808] py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => (
            <div key={f.title} className="group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/20 rounded-2xl p-7 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] mb-5 group-hover:bg-[#C9A84C]/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display text-lg text-[#F0EBE0] mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-[#666] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────

function Newsletter() {
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

            <h2 className="font-display text-5xl text-[#F0EBE0] mb-5">Stay in the Know</h2>
            <p className="text-[#777] text-base mb-10 leading-relaxed">
              Weekly fragrance recommendations, new launches, and exclusive
              community picks — delivered to your inbox every Thursday.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-8 py-4">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[#C9A84C] font-medium">You&apos;re on the list — thank you!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
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

// ─── Footer ───────────────────────────────────────────────────

function Footer() {
  const footerRoutes: Record<string, string> = {
    "Trending Now": "/explore?sort=trending", "Top Rated": "/#top-rated", "By Note": "/explore",
    "By Brand": "/brands", "About ScentBase": "/about", "Careers": "/careers",
    "Privacy Policy": "/privacy", "Terms": "/terms", "Contact": "/contact",
  };
  const cols = [
    {
      title: "Discover",
      links: ["Trending Now", "New Releases", "Top Rated", "By Note", "By Brand", "Seasonal Picks"],
    },
    {
      title: "Community",
      links: ["Reviews", "Fragrance Lists", "Forum", "Events", "Blog", "Podcast"],
    },
    {
      title: "Company",
      links: ["About ScentBase", "Careers", "Privacy Policy", "Terms", "Contact"],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#080808] border-t border-white/6 pt-16 sm:pt-20 pb-10"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div>
            <div className="font-display text-xl tracking-[0.12em] text-[#F0EBE0] flex items-center gap-2.5 mb-5">
              <span className="text-[#C9A84C]">✦</span> ScentBase
            </div>
            <p className="text-sm text-[#555] leading-relaxed max-w-xs mb-8">
              The world&apos;s most comprehensive fragrance discovery platform.
              Explore, rate, and collect the scents that define you.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <MotionAnchor
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="footer-interactive footer-social w-10 h-10 rounded-full border border-white/10 hover:border-[#C9A84C]/35 flex items-center justify-center text-[#555] hover:text-[#C9A84C] transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </MotionAnchor>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs text-[#C9A84C] tracking-[0.2em] uppercase mb-6">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <MotionLink
                      to={footerRoutes[link] ?? "/explore"}
                      whileHover={{ x: 2, scale: 1.01, color: "#C9A84C" }}
                      transition={{ duration: 0.16 }}
                      className="footer-interactive text-sm text-[#555] hover:text-[#C9A84C] transition-colors cursor-pointer"
                    >
                      {link}
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <GoldDivider />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="text-xs text-[#444] font-mono-label">
            © 2024 ScentBase, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
              <MotionAnchor
                key={link}
                href="#"
                whileHover={{ y: -1, scale: 1.02 }}
                transition={{ duration: 0.16 }}
                className="footer-interactive text-xs text-[#444] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                {link}
              </MotionAnchor>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

// ─── App ──────────────────────────────────────────────────────

const ALL_FRAGRANCES = [...TRENDING, ...TOP_RATED];

const fragranceRoute = (fragrance: { id: number; name: string; brand: string }) =>
  TOP_RATED.some((p) => p.name === fragrance.name && p.brand === fragrance.brand)
    ? `/fragrance/top-${fragrance.id}`
    : `/fragrance/${fragrance.id}`;

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
}

function ExplorePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const term = (params.get("q") ?? "").toLowerCase();
  const selectedNote = params.get("note");
  const results = ALL_FRAGRANCES.filter((p) =>
    (!term || `${p.name} ${p.brand}`.toLowerCase().includes(term)) &&
    (!selectedNote || p.notes.includes(selectedNote))
  );
  const runSearch = () => {
    const value = query.trim();
    if (value && isAuthenticated && user) {
      logSearch(user.email, user.name, value);
    }
    setParams(value ? { q: value } : {});
  };

  return <main className="min-h-screen bg-[#080808] pt-28 sm:pt-32 pb-24">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
      <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Discovery catalogue</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F0EBE0] mb-6 sm:mb-8">Explore Fragrances</h1>
      <div className="flex flex-col sm:flex-row max-w-2xl gap-3 mb-8 sm:mb-12">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Search perfumes or brands" className="flex-1 bg-[#141414] border border-white/10 focus:border-[#C9A84C]/40 rounded-full px-6 py-4 text-[#F0EBE0] outline-none" />
        <button onClick={runSearch} className="explore-search-button bg-[#C9A84C] text-[#080808] font-semibold px-7 rounded-full transition-all cursor-pointer">Search</button>
      </div>
      <p className="text-sm text-[#777] mb-6">{results.length} fragrance{results.length === 1 ? "" : "s"} found{term && ` for “${params.get("q")}”`}{selectedNote && ` with ${selectedNote} notes`}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {results.map((p) => <motion.button key={`${p.name}-${p.brand}`} onClick={() => navigate(fragranceRoute(p))} whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.16, ease: "easeOut" } }} whileTap={{ scale: 0.99 }} className="text-left group bg-[#111] border border-white/10 hover:border-[#C9A84C]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(201,168,76,0.08)] cursor-pointer glow-strong">
          <ImageWithFallback src={fragranceImageUrl(p.img, 500, 360)} alt={p.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="p-5"><p className="text-xs text-[#C9A84C] mb-1 transition-colors group-hover:text-[#F0EBE0]">{p.brand}</p><h2 className="font-display text-xl text-[#F0EBE0] transition-colors group-hover:text-[#C9A84C]">{p.name}</h2><div className="mt-3 flex items-center gap-2"><Stars rating={p.rating} sm /><span className="text-xs text-[#777] transition-colors group-hover:text-[#F0EBE0]">{p.rating}</span></div></div>
        </motion.button>)}
      </div>
      {!results.length && <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-[#777]">No exact match yet. Try a perfume or brand name from the collection.</div>}
    </div>
  </main>;
}

function BrandsPage() {
  const [params] = useSearchParams();
  const selected = params.get("selected");
  const navigate = useNavigate();
  return <main className="min-h-screen bg-[#080808] pt-32 pb-24"><div className="max-w-[1200px] mx-auto px-8">
    <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Curated Houses</p><h1 className="font-display text-5xl text-[var(--color-foreground)] mb-4">Fragrance Brands</h1>
    <p className="text-[var(--color-muted-foreground)] mb-10">{selected ? `Browsing ${selected}. Choose another house below.` : "Discover the houses behind the world's most memorable scents."}</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{BRANDS.map((brand) => <button onClick={() => navigate(`/explore?q=${encodeURIComponent(brand.name)}`)} key={brand.name} className="brand-card text-left bg-[#111] border border-white/10 rounded-2xl p-6 transition-colors cursor-pointer"><h2 className="brand-card-title font-display text-xl text-[var(--color-foreground)] font-medium transition-colors">{brand.name}</h2><p className="brand-card-detail text-sm text-[var(--color-muted-foreground)] mt-2 transition-colors">Established {brand.founded}</p></button>)}</div>
  </div></main>;
}

function SimplePage({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#080808] pt-32 pb-24"><div className="max-w-3xl mx-auto px-8"><p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">{eyebrow}</p><h1 className="font-display text-5xl text-[#F0EBE0] mb-6">{title}</h1><div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-[#AAA] leading-relaxed">{children}</div></div></main>;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) return setError("Please enter your email and password.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");

    setError("");
    setSubmitting(true);

    const result = await login(form.email, form.password);

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    // Redirect based on role
    if (result.user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24">
      <div className="max-w-lg mx-auto px-8">
        <div className="text-center mb-9">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Account access</p>
          <h1 className="font-display text-5xl text-[#F0EBE0] mb-3">Welcome back</h1>
          <p className="text-[#777]">Sign in to continue discovering your next signature scent.</p>
        </div>

        <form onSubmit={submit} className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-7 sm:p-9 space-y-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <label className="block text-sm text-[var(--color-foreground)]">
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none transition-all"
            />
          </label>

          <label className="block text-sm text-[var(--color-foreground)]">
            Password
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 rounded-xl px-4 py-3.5 pr-12 text-[#F0EBE0] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => update("rememberMe", e.target.checked)}
                className="sr-only"
              />
              <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${form.rememberMe ? "border-[#C9A84C] bg-[#C9A84C] text-[#080808] shadow-[0_0_0_3px_rgba(201,168,76,0.12)]" : "border-white/20 bg-[#181818] text-transparent"}`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              Remember me
            </label>
            <Link to="/signup" className="text-[#C9A84C] hover:text-[#D9BA5D] transition-colors cursor-pointer">Create account</Link>
          </div>

          {error && <p role="alert" className="text-sm text-[#F59E0B]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#666]">
            <div className="h-px flex-1 bg-white/10" />
            <span>Secure login</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

        </form>
      </div>
    </main>
  );
}

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) return setError("Please complete every field.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    if (form.password !== form.confirmPassword) return setError("Your passwords do not match.");

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error === 'user_already_exists' ? 'An account with this email already exists.' : result.error || 'Unable to create account.');
        setSubmitting(false);
        return;
      }
      setComplete(true);
    } catch (err) {
      setError('Unable to reach the authentication server.');
      setSubmitting(false);
    }
  };

  if (complete) return <Navigate to="/login" replace />;

  return <main className="min-h-screen bg-[#080808] pt-32 pb-24"><div className="max-w-lg mx-auto px-8"><div className="text-center mb-9"><p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">Join ScentBase</p><h1 className="font-display text-5xl text-[#F0EBE0] mb-3">Begin your scent story</h1><p className="text-[#777]">Create a profile to save the fragrances that move you.</p></div><form onSubmit={submit} className="bg-[#111] border border-white/10 rounded-3xl p-7 sm:p-9 space-y-5"><label className="block text-sm text-[#D8D1C4]">Full name<input value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" placeholder="Your name" className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none" /></label><label className="block text-sm text-[#D8D1C4]">Email address<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none" /></label><div className="grid sm:grid-cols-2 gap-5"><label className="block text-sm text-[#D8D1C4]">Password<input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" placeholder="8+ characters" className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none" /></label><label className="block text-sm text-[#D8D1C4]">Confirm password<input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} autoComplete="new-password" placeholder="Repeat password" className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none" /></label></div>{error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>}<button type="submit" className="w-full bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold py-4 rounded-xl transition-colors">Create account</button><p className="text-center text-sm text-[#777]">Already a member? <Link to="/login" className="text-[#C9A84C] hover:text-[#C9A84C]">Log in</Link></p></form></div></main>;
}

function FragrancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const routeId = id ?? "";
  const isTopRated = routeId.startsWith("top-");
  const fragranceId = isTopRated ? routeId.replace("top-", "") : routeId;
  const fragrance = (isTopRated ? TOP_RATED : TRENDING).find((p) => String(p.id) === fragranceId);

  // Log fragrance view on mount
  useEffect(() => {
    if (fragrance && isAuthenticated && user) {
      logViewFragrance(user.email, user.name, fragrance.name);
    }
  }, [fragrance, isAuthenticated, user]);

  if (!fragrance) return <SimplePage title="Fragrance not found" eyebrow="Catalogue"><button onClick={() => navigate("/explore")} className="text-[#C9A84C]">Return to explore</button></SimplePage>;
  return <main className="min-h-screen bg-[#080808] pt-32 pb-24"><div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-start">
    <ImageWithFallback src={fragranceImageUrl(fragrance.img, 800, 900)} alt={fragrance.name} className="w-full aspect-[4/5] object-cover rounded-3xl border border-white/10" />
    <div><button onClick={() => navigate(-1)} className="text-sm text-[#C9A84C] mb-10">← Back</button><p className="text-xs text-[#C9A84C] tracking-[0.25em] uppercase mb-3">{fragrance.brand}</p><h1 className="font-display text-5xl text-[#F0EBE0] mb-6">{fragrance.name}</h1><div className="flex items-center gap-3 mb-8"><Stars rating={fragrance.rating} /><span className="text-[#F0EBE0]">{fragrance.rating} community rating</span></div><p className="text-[#999] leading-relaxed mb-8">A distinctive scent profile curated for your discovery. Explore its accords, community reactions, and save it to your personal wardrobe.</p><button onClick={() => navigate("/collections")} className="bg-[#C9A84C] text-[#080808] font-semibold px-7 py-3.5 rounded-full">Add to my collection</button></div>
  </div></main>;
}

function HomePage() { return <><Hero /><TrendingSection /><NotesSection /><BrandsSection /><TopRatedSection /><FeatureStrip /><Newsletter /></>; }

// ─── Protected Admin Route ────────────────────────────────────

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ─── Admin Dashboard (imported from pages/admin) ─────────────

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-w-[360px]">
          <ScrollToTop />
          {!isAdminRoute && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/fragrance/:id" element={<FragrancePage />} />
          <Route path="/collections" element={<SimplePage title="Your Scent Wardrobe" eyebrow="Collections">Create an account to save the fragrances you own, want to try, and loved in the past.</SimplePage>} />
          <Route path="/about" element={<SimplePage title="About ScentBase" eyebrow="Our story"><div className="space-y-5"><p>ScentBase is a home for fragrance lovers who want to discover, compare, and collect scents with confidence. We believe that finding a fragrance should feel personal, enjoyable, and never overwhelming.</p><p>Whether you are looking for a new everyday signature, learning the difference between amber and oud, or researching a long-awaited bottle, ScentBase brings notes, ratings, brands, and community perspectives together in one thoughtful place.</p><p>Our goal is simple: make the world of fragrance easier to explore. Build your scent wardrobe, save the bottles that inspire you, and use honest community insight to find the fragrances that feel most like you.</p><p className="text-[#C9A84C]">Every scent tells a story. We are here to help you find yours.</p></div></SimplePage>} />
          <Route path="/careers" element={<SimplePage title="Careers at ScentBase" eyebrow="Join our team">We are building a more thoughtful way to discover fragrance. We are not currently hiring, but future opportunities will be shared here.</SimplePage>} />
          <Route path="/privacy" element={<SimplePage title="Privacy Policy" eyebrow="Your data">We respect your privacy and only use information needed to provide and improve your ScentBase experience. A complete policy will be published here before account data is collected.</SimplePage>} />
          <Route path="/terms" element={<SimplePage title="Terms of Use" eyebrow="Using ScentBase">ScentBase content is provided to help visitors discover fragrance. Please use the platform responsibly and respect the community as features continue to grow.</SimplePage>} />
          <Route path="/contact" element={<SimplePage title="Contact us" eyebrow="We would love to hear from you">Questions, feedback, and fragrance suggestions are always welcome. Our contact form is coming soon.</SimplePage>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="*" element={<SimplePage title="Page not found" eyebrow="404"><Link to="/" className="text-[#C9A84C]">Go home</Link></SimplePage>} />
        </Routes>
        {!isAdminRoute && <Footer />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
