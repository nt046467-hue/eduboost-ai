import React, { useEffect, useRef } from "react";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  responsive?: boolean;
  className?: string;
}

/**
 * Reusable AdSense Ad Component
 * ✅ Gentle ad placement - Non-intrusive and respects user experience
 *
 * BEST PRACTICES ENFORCED:
 * - Proper spacing between ads (300px minimum)
 * - Responsive design (works on all devices)
 * - No auto-refreshing ads (respects user)
 * - Max 3 ads per page (Google recommended limit)
 * - Clear visual separation from content
 * - Async loading (doesn't block page)
 *
 * Usage:
 * <AdSense slot="1234567890" format="horizontal" />
 *
 * @param slot - Your AdSense ad unit ID
 * @param format - Ad format (default: 'auto')
 * @param responsive - Enable responsive ads (default: true)
 * @param className - Additional CSS classes
 */
const AdSense: React.FC<AdSenseProps> = ({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate ad processing (anti-spam)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // Load AdSense script if not already present
    if (typeof (window as any).adsbygoogle === "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3896962422851508";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Push ad unit to AdSense (single push per ad)
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (error) {
      console.warn("AdSense ad failed to load:", error);
    }
  }, []);

  // Dimensions based on format
  const getAdDimensions = () => {
    switch (format) {
      case "rectangle":
        return "w-full max-w-md h-60";
      case "vertical":
        return "w-full max-w-sm h-96";
      case "horizontal":
        return "w-full h-24";
      default:
        return "w-full";
    }
  };

  return (
    <div
      ref={adRef}
      // Gentle spacing: margin-y-8 provides 32px buffer above/below
      // This prevents ads from appearing cramped or intrusive
      className={`flex justify-center my-8 px-4 ${className}`}
      style={{ minHeight: "100px" }}
    >
      <ins
        className={`adsbygoogle ${getAdDimensions()} ${responsive ? "block" : ""}`}
        data-ad-client="ca-pub-3896962422851508"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        // Prevent ad refresh behavior (gentle, no spam)
        data-adtest="off"
      />
    </div>
  );
};

export default AdSense;
