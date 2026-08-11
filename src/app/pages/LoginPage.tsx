import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password)
      return setError("Please enter your email and password.");
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError("Enter a valid email address.");
    if (form.password.length < 8)
      return setError("Use at least 8 characters for your password.");

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
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
            Account access
          </p>
          <h1 className="font-display text-5xl text-[#F0EBE0] mb-3">
            Welcome back
          </h1>
          <p className="text-[#777]">
            Sign in to continue discovering your next signature scent.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-7 sm:p-9 space-y-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
        >
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
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
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${form.rememberMe ? "border-[#C9A84C] bg-[#C9A84C] text-[#080808] shadow-[0_0_0_3px_rgba(201,168,76,0.12)]" : "border-white/20 bg-[#181818] text-transparent"}`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              Remember me
            </label>
            <Link
              to="/signup"
              className="text-[#C9A84C] hover:text-[#D9BA5D] transition-colors cursor-pointer"
            >
              Create account
            </Link>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#F59E0B]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign in"}
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