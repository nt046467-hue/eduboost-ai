import React, { useState, useEffect, Suspense } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./hooks/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Impact from "./components/Impact";
import StudyGuides from "./components/StudyGuides";
import StudyMaterials from "./components/StudyMaterials";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TrustSafety from "./components/TrustSafety";
import TermsOfService from "./components/TermsOfService";
import CookiePolicy from "./components/CookiePolicy";
import AITutor from "./components/AITutor";
import GuideDetail from "./components/GuideDetail";
import AdPlacement from "./components/AdPlacement";
import Summarizer from "./components/Summarizer";
import About from "./components/About";
import GamesHub from "./components/GamesHub";
import FloatingChatBot from "./components/FloatingChatBot";

// Lazy load heavy components
const LazyBlogDetail = React.lazy(() => import("./components/BlogDetail"));
const LazyGuideDetail = React.lazy(() => import("./components/GuideDetail"));
const LazyAITutor = React.lazy(() => import("./components/AITutor"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00e5ff]/20 border-t-[#00e5ff] rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Add delay to allow component to mount and render
    const scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);

      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    }, 200);

    return () => clearTimeout(scrollTimer);
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
        className={`w-full min-h-screen ${bgColor} ${textColor} selection:bg-[#00e5ff] selection:text-[#0a0a0a]`}
      >
        <Navbar />
        <main className="w-full flex flex-col">
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
            <Route path="/about" element={<About />} />
            <Route path="/summarizer" element={<Summarizer />} />
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
