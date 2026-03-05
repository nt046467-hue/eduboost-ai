/**
 * Google AdSense Configuration
 *
 * Replace the slot IDs with your actual AdSense ad unit IDs from your Google AdSense dashboard.
 * Format: 'XXXXXXXXXX' (10 digit slot ID from your AdSense account)
 *
 * Example: '1234567890'
 */

export const ADSENSE_CONFIG = {
  // Publisher ID (already set globally in index.html)
  publisherId: "ca-pub-3896962422851508",

  // Ad Unit Slots - Replace these with your actual slot IDs
  slots: {
    belowHeader: "YOUR_SLOT_BELOW_HEADER", // Horizontal ad below hero/header
    contentMiddle: "YOUR_SLOT_CONTENT_MIDDLE", // Rectangle in content
    beforeFooter: "YOUR_SLOT_BEFORE_FOOTER", // Horizontal before footer
  },

  // Ad Formats
  formats: {
    belowHeader: "horizontal" as const, // Full-width responsive
    contentMiddle: "rectangle" as const, // Medium rectangle (300x250 or responsive)
    beforeFooter: "horizontal" as const, // Full-width responsive
  },

  // Responsive Settings
  responsive: true,
  fullWidthResponsive: true,

  // Auto Ads Configuration
  autoAds: {
    enabled: true, // Enable Google AdSense Auto Ads
    autoOptimize: true, // Enable Auto Optimization (Google manages ad placement)
  },

  // Ad Density Control (Prevents Ad Spam)
  // Google recommends max 3 ads per page for best user experience
  adDensity: {
    maxAdsPerPage: 3, // Maximum ads allowed (our limit)
    minDistanceBetweenAds: 300, // pixels between ads
    preventAdStackingVertically: true,
    respectUserExperience: true,
  },
};

/**
 * HOW TO SET UP YOUR ADSENSE SLOTS:
 *
 * 1. Go to Google AdSense dashboard: https://adsense.google.com
 * 2. Navigate to Ads → By Page
 * 3. Click "Create new ad unit"
 * 4. Choose ad format:
 *    - Display ads (for belowHeader & beforeFooter)
 *    - In-feed ads (for contentMiddle)
 * 5. Give it a name (e.g., "Header Ad", "Content Ad", "Footer Ad")
 * 6. Copy the slot ID (the number in data-ad-slot)
 * 7. Replace the placeholder values in slots object above
 *
 * AUTO ADS SETUP:
 * 1. Once approved and slots are added
 * 2. Go to AdSense → Ads → Auto ads
 * 3. Toggle "Enable Auto ads" ON
 * 4. Toggle "Auto-optimize ad sizes" ON
 * 5. This allows Google to intelligently place ads without spam
 *
 * EXAMPLE:
 * Replace:
 *   belowHeader: 'YOUR_SLOT_BELOW_HEADER',
 * With:
 *   belowHeader: '1234567890',
 *
 * Important: The publisher ID is already set in index.html
 * Only the individual slot IDs need to be updated here.
 */

/**
 * Get ad slot by position
 */
export const getAdSlot = (
  position: "header" | "content" | "footer",
): string => {
  switch (position) {
    case "header":
      return ADSENSE_CONFIG.slots.belowHeader;
    case "content":
      return ADSENSE_CONFIG.slots.contentMiddle;
    case "footer":
      return ADSENSE_CONFIG.slots.beforeFooter;
    default:
      return "";
  }
};

/**
 * Get ad format by position
 */
export const getAdFormat = (position: "header" | "content" | "footer") => {
  switch (position) {
    case "header":
      return ADSENSE_CONFIG.formats.belowHeader;
    case "content":
      return ADSENSE_CONFIG.formats.contentMiddle;
    case "footer":
      return ADSENSE_CONFIG.formats.beforeFooter;
    default:
      return "auto" as const;
  }
};

/**
 * Check if we should show ads to respect density limits
 */
export const shouldShowAd = (
  position: "header" | "content" | "footer",
): boolean => {
  // Always show ads (respecting the 3-ad limit set in layout)
  // This ensures professional, non-spammy ad placement
  return ADSENSE_CONFIG.adDensity.respectUserExperience;
};
