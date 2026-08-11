import { Link } from "react-router";
import { SimplePage } from "./SimplePage";

export function AboutPage() {
  return (
    <SimplePage title="About ScentBase" eyebrow="Our story">
      <div className="space-y-5">
        <p>
          ScentBase is a home for fragrance lovers who want to discover,
          compare, and collect scents with confidence. We believe that
          finding a fragrance should feel personal, enjoyable, and never
          overwhelming.
        </p>
        <p>
          Whether you are looking for a new everyday signature, learning the
          difference between amber and oud, or researching a long-awaited
          bottle, ScentBase brings notes, ratings, brands, and community
          perspectives together in one thoughtful place.
        </p>
        <p>
          Our goal is simple: make the world of fragrance easier to explore.
          Build your scent wardrobe, save the bottles that inspire you, and
          use honest community insight to find the fragrances that feel most
          like you.
        </p>
        <p className="text-[#C9A84C]">
          Every scent tells a story. We are here to help you find yours.
        </p>
      </div>
    </SimplePage>
  );
}

export function CollectionsPage() {
  return (
    <SimplePage title="Your Scent Wardrobe" eyebrow="Collections">
      Create an account to save the fragrances you own, want to try, and
      loved in the past.
    </SimplePage>
  );
}

export function CareersPage() {
  return (
    <SimplePage title="Careers at ScentBase" eyebrow="Join our team">
      We are building a more thoughtful way to discover fragrance. We are
      not currently hiring, but future opportunities will be shared here.
    </SimplePage>
  );
}

export function PrivacyPage() {
  return (
    <SimplePage title="Privacy Policy" eyebrow="Your data">
      We respect your privacy and only use information needed to provide and
      improve your ScentBase experience. A complete policy will be published
      here before account data is collected.
    </SimplePage>
  );
}

export function TermsPage() {
  return (
    <SimplePage title="Terms of Use" eyebrow="Using ScentBase">
      ScentBase content is provided to help visitors discover fragrance.
      Please use the platform responsibly and respect the community as
      features continue to grow.
    </SimplePage>
  );
}

export function ContactPage() {
  return (
    <SimplePage title="Contact us" eyebrow="We would love to hear from you">
      Questions, feedback, and fragrance suggestions are always welcome. Our
      contact form is coming soon.
    </SimplePage>
  );
}

export function NotFoundPage() {
  return (
    <SimplePage title="Page not found" eyebrow="404">
      <Link to="/" className="text-[#C9A84C]">
        Go home
      </Link>
    </SimplePage>
  );
}