import { Link } from "react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { GoldDivider } from "./GoldDivider";

const MotionLink = motion(Link);
const MotionAnchor = motion.a;

const footerRoutes: Record<string, string> = {
  "Trending Now": "/explore?sort=trending",
  "Top Rated": "/#top-rated",
  "By Note": "/explore",
  "By Brand": "/brands",
  "About ScentBase": "/about",
  Careers: "/careers",
  "Privacy Policy": "/privacy",
  Terms: "/terms",
  Contact: "/contact",
};

const cols = [
  {
    title: "Discover",
    links: [
      "Trending Now",
      "New Releases",
      "Top Rated",
      "By Note",
      "By Brand",
      "Seasonal Picks",
    ],
  },
  {
    title: "Community",
    links: [
      "Reviews",
      "Fragrance Lists",
      "Forum",
      "Events",
      "Blog",
      "Podcast",
    ],
  },
  {
    title: "Company",
    links: [
      "About ScentBase",
      "Careers",
      "Privacy Policy",
      "Terms",
      "Contact",
    ],
  },
];

export function Footer() {
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
              <p className="text-xs text-[#C9A84C] tracking-[0.2em] uppercase mb-6">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <MotionLink
                      to={footerRoutes[link] ?? "/explore"}
                      whileHover={{ x: 2, scale: 1.01 }}
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
            &copy; {new Date().getFullYear()} ScentBase, Inc. All rights
            reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
              (link) => (
                <MotionAnchor
                  key={link}
                  href="#"
                  whileHover={{ y: -1, scale: 1.02 }}
                  transition={{ duration: 0.16 }}
                  className="footer-interactive text-xs text-[#444] hover:text-[#C9A84C] transition-colors cursor-pointer"
                >
                  {link}
                </MotionAnchor>
              ),
            )}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}