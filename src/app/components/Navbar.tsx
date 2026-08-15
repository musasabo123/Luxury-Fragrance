import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Brands", to: "/brands" },
    { label: "Collections", to: "/collections" },
    { label: "About", to: "/about" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
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
            <Link
              key={link.label}
              to={link.to}
              className={`navbar-interactive navbar-static-hover px-4 py-2 text-sm rounded-full transition-colors transition-shadow ${
                location.pathname === link.to
                  ? "text-[#C9A84C] bg-[#C9A84C]/8 shadow-[0_8px_24px_rgba(201,168,76,0.16)] cursor-pointer"
                  : "text-[var(--color-muted-foreground)] hover:text-[#C9A84C] hover:bg-[var(--color-secondary)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.12)] cursor-pointer"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search hint */}
        <Link
          to="/explore"
          className="navbar-interactive hidden lg:flex items-center gap-2 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-colors transition-shadow hover:shadow-[0_10px_30px_rgba(201,168,76,0.08)] w-[250px] h-10 flex-shrink-0 [&>span]:whitespace-nowrap cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[var(--color-muted-foreground)] flex-shrink-0" />
          <span>Discover fragrances...</span>
          <span className="ml-auto text-[10px] font-mono-label bg-white/8 rounded px-1.5 py-0.5 text-[#555]">
           ctrl k
          </span>
        </Link>

        {/* Auth + Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {/* Add theme toggle for mobile - right before hamburger menu */}
          <button
            aria-label="Toggle theme"
            onClick={() => toggleTheme()}
            className="lg:hidden navbar-interactive p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[#C9A84C] text-[var(--color-foreground)] transition-colors transition-shadow hover:shadow-[0_6px_18px_rgba(201,168,76,0.08)] cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            className="navbar-interactive lg:hidden ml-0 text-[var(--color-foreground)] hover:text-[#C9A84C] transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() => toggleTheme()}
            className="flex navbar-interactive p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[#C9A84C] text-[var(--color-foreground)] transition-colors transition-shadow hover:shadow-[0_6px_18px_rgba(201,168,76,0.08)] cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

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
              <Link
                to="/login"
                className="navbar-interactive text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] transition-colors transition-shadow hover:shadow-[0_6px_18px_rgba(201,168,76,0.08)] px-3 py-2 cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-[#080808] bg-[#C9A84C] hover:bg-[#D4B05A] transition-all transition-shadow hover:shadow-[0_12px_36px_rgba(201,168,76,0.14)] px-6 py-2.5 rounded-full glow-strong cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="navbar-interactive lg:hidden ml-auto text-[var(--color-foreground)] hover:text-[#C9A84C] transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden px-4 sm:px-8 py-5"
          style={{
            backgroundColor: "var(--background)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="navbar-interactive block py-3 text-sm text-[var(--color-muted-foreground)] hover:text-[#C9A84C] border-b border-[var(--color-border)] last:border-0 transition-colors cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setOpen(false)}
                    className="navbar-interactive flex-1 text-center text-sm text-[#C9A84C] border border-[#C9A84C]/30 py-2.5 rounded-full hover:text-[#D4B05A] transition-colors cursor-pointer"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex-1 text-center text-sm text-[var(--color-foreground)] border border-[var(--color-border)] py-2.5 rounded-full hover:text-[#C9A84C] transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="navbar-interactive flex-1 text-center text-sm text-[var(--color-foreground)] border border-[var(--color-border)] py-2.5 rounded-full hover:text-[#C9A84C] transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-medium text-[#080808] bg-[#C9A84C] py-2.5 rounded-full hover:bg-[#D4B05A] transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}