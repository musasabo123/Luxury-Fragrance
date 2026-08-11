import { Route, Routes, useLocation } from "react-router";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";

import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { BrandsPage } from "./pages/BrandsPage";
import { FragrancePage } from "./pages/FragrancePage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignupPage";
import {
  AboutPage,
  CollectionsPage,
  CareersPage,
  PrivacyPage,
  TermsPage,
  ContactPage,
  NotFoundPage,
} from "./pages/StaticPages";

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
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {!isAdminRoute && <Footer />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
