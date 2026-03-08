import React from "react";
import { useLocation } from "react-router-dom";
import AdSense from "./AdSense";
import { shouldPageHaveAds } from "../hooks/useAdSense";
import { getAdSlot, getAdFormat } from "../config/adsenseConfig";

interface AdPlacementProps {
  position: "header" | "content" | "footer";
  className?: string;
}

/**
 * Smart Ad Placement Component
 * Conditionally renders ads based on page type and position
 * Prevents ad placement on policy pages and empty content
 */
const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = "",
}) => {
  const { pathname } = useLocation();

  // Don't show ads on policy pages
  if (!shouldPageHaveAds(pathname)) {
    return null;
  }

  const slot = getAdSlot(position);

  // Don't render if slot is not configured
  if (slot.startsWith("YOUR_SLOT")) {
    return null;
  }

  const format = getAdFormat(position);

  return (
    <div className={`w-full ${className}`}>
      <AdSense slot={slot} format={format} responsive={true} />
    </div>
  );
};

export default AdPlacement;

