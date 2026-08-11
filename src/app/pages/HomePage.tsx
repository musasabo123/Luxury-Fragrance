import { Hero } from "../components/Hero";
import { TrendingSection } from "../components/Trendingsection";
import { NotesSection } from "../components/NotesSection";
import { BrandsSection } from "../components/BrandsSection";
import { TopRatedSection } from "../components/TopRatedSec";
import { FeatureStrip } from "../components/FeatureStrip";
import { Newsletter } from "../components/Newsletter";

export function HomePage() {
  return (
    <>
      <Hero />
      <TrendingSection />
      <NotesSection />
      <BrandsSection />
      <TopRatedSection />
      <FeatureStrip />
      <Newsletter />
    </>
  );
}