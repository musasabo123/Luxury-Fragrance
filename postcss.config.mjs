/**
 * PostCSS Configuration
 *
 * Tailwind CSS v4 (via @tailwindcss/vite) automatically sets up all required
 * PostCSS plugins — you do NOT need to include `tailwindcss` or `autoprefixer` here.
 *
 * We add `postcss-nesting` so Tailwind's generated nested selectors like
 * `&:hover` are transformed into valid browser CSS.
 */
import postcssNesting from 'postcss-nesting'

export default {
  plugins: [postcssNesting()],
}
