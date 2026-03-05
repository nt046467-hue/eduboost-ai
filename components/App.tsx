import React, { useState, useEffect, Suspense } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "../hooks/ThemeContext";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Impact from "./Impact";
import StudyGuides from "./StudyGuides";
import StudyMaterials from "./StudyMaterials";
import Blog from "./Blog";
import BlogDetail from "./BlogDetail";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Footer from "./Footer";
import PrivacyPolicy from "./PrivacyPolicy";
import TrustSafety from "./TrustSafety";
import TermsOfService from "./TermsOfService";
import CookiePolicy from "./CookiePolicy";
import AITutor from "./AITutor";
import GuideDetail from "./GuideDetail";
import AdPlacement from "./AdPlacement";
import FloatingChatBot from "./FloatingChatBot";
import ChatbotPage from "./ChatbotPage";
import GamesHub from "./GamesHub";

// Lazy load heavy components
const LazyBlogDetail = React.lazy(() => import("./BlogDetail"));
const LazyGuideDetail = React.lazy(() => import("./GuideDetail"));
const LazyAITutor = React.lazy(() => import("./AITutor"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top on every route change
    window.scrollTo(0, 0);

    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly for elements to be in DOM
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [pathname, hash]);

  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <AdPlacement position="header" className="mt-6 mb-10" />
    <Features />
    <StudyGuides />
    <AdPlacement position="content" className="my-10" />
    <Impact />
    <Blog />
    <FAQ />
    <Contact />
  </>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-[#0a0a0a]";
  const textColor = theme === "light" ? "text-gray-900" : "text-white";

  return (
    <HashRouter>
      <ScrollToTop />
      <div
        className={`min-h-screen ${bgColor} ${textColor} selection:bg-[#00e5ff] selection:text-[#0a0a0a]`}
      >
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guides" element={<StudyGuides />} />
            <Route path="/materials" element={<StudyMaterials />} />
            <Route
              path="/guides/:id"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyGuideDetail />
                </Suspense>
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/blog/:id"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyBlogDetail />
                </Suspense>
              }
            />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/trust" element={<TrustSafety />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/games" element={<GamesHub />} />
          </Routes>
        </main>
        <AdPlacement position="footer" className="my-10" />
        <Footer />
        <FloatingChatBot />
      </div>
    </HashRouter>
  );
};

export default App;
