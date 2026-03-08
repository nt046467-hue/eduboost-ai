import { useEffect, useState } from "react";

/**
 * Custom hook to manage AdSense placements
 * Prevents duplicate ad units on the same page
 */
export const useAdSense = () => {
  const [activeAds, setActiveAds] = useState<Set<string>>(new Set());
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    setIsContentReady(true);
  }, []);

  const shouldShowAd = (adId: string): boolean => {
    return isContentReady && !activeAds.has(adId);
  };

  const registerAd = (adId: string) => {
    setActiveAds((prev) => new Set([...prev, adId]));
  };

  return { shouldShowAd, registerAd, isContentReady };
};

/**
 * Utility function to check if a page should have ads
 * Returns false for empty or policy pages
 */
export const shouldPageHaveAds = (pathname: string): boolean => {
  const noAdPages = [
    "/privacy",
    "/terms",
    "/cookies",
    "/trust",
    "/error",
    "/404",
  ];

  return !noAdPages.some((page) => pathname.startsWith(page));
};
