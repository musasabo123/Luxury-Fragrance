import { useState } from "react";
import { Link, Navigate } from "react-router";

export function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    )
      return setError("Please complete every field.");
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError("Enter a valid email address.");
    if (form.password.length < 8)
      return setError("Use at least 8 characters for your password.");
    if (form.password !== form.confirmPassword)
      return setError("Your passwords do not match.");

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          result.error === "user_already_exists"
            ? "An account with this email already exists."
            : result.error || "Unable to create account.",
        );
        setSubmitting(false);
        return;
      }
      setComplete(true);
    } catch (err) {
      setError("Unable to reach the authentication server.");
      setSubmitting(false);
    }
  };

  if (complete) return <Navigate to="/login" replace />;

  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24">
      <div className="max-w-lg mx-auto px-8">
        <div className="text-center mb-9">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-3">
            Join ScentBase
          </p>
          <h1 className="font-display text-5xl text-[#F0EBE0] mb-3">
            Begin your scent story
          </h1>
          <p className="text-[#777]">
            Create a profile to save the fragrances that move you.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="bg-[#111] border border-white/10 rounded-3xl p-7 sm:p-9 space-y-5"
        >
          <label className="block text-sm text-[#D8D1C4]">
            Full name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none"
            />
          </label>
          <label className="block text-sm text-[#D8D1C4]">
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none"
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block text-sm text-[#D8D1C4]">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
                placeholder="8+ characters"
                className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none"
              />
            </label>
            <label className="block text-sm text-[#D8D1C4]">
              Confirm password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                autoComplete="new-password"
                placeholder="Repeat password"
                className="mt-2 w-full bg-[#181818] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3.5 text-[#F0EBE0] outline-none"
              />
            </label>
          </div>
          {error && (
            <p
              role="alert"
              className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#C9A84C] hover:bg-[#D4B05A] text-[#080808] font-semibold py-4 rounded-xl transition-colors"
          >
            Create account
          </button>
          <p className="text-center text-sm text-[#777]">
            Already a member?{" "}
            <Link to="/login" className="text-[#C9A84C] hover:text-[#C9A84C]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}