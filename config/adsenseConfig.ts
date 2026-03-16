/**
 * Google AdSense Configuration
 *
 * ✅ GENTLE ADS POLICY
 * All settings configured to ensure non-intrusive, user-friendly ad placement.
 * No spam, no aggressive placements, respects user experience.
 *
 * TWO WAYS TO MONETIZE YOUR SITE:
 * 1. AUTO ADS (Enabled by default in index.html) ✅ RECOMMENDED
 *    - Google automatically places ads throughout your site
 *    - No slot IDs needed
 *    - Requires enabling in Google AdSense dashboard
 * 2. MANUAL AD PLACEMENTS (Below)
 *    - Use the slot IDs below for specific ad locations
 *    - More control over placement
 *    - Optional if using Auto Ads
 */

export const ADSENSE_CONFIG = {
  // Publisher ID (already set globally in index.html)
  publisherId: "ca-pub-3896962422851508",

  // Ad Unit Slots - Replace these with your actual slot IDs (Optional if using Auto Ads)
  slots: {
    belowHeader: "YOUR_SLOT_BELOW_HEADER",     // Horizontal ad below hero/header
    contentMiddle: "YOUR_SLOT_CONTENT_MIDDLE", // Rectangle in content
    beforeFooter: "YOUR_SLOT_BEFORE_FOOTER",   // Horizontal before footer
  },

  // Ad Formats
  formats: {
    belowHeader: "horizontal" as const,   // Full-width responsive
    contentMiddle: "rectangle" as const,  // Medium rectangle (300x250 or responsive)
    beforeFooter: "horizontal" as const,  // Full-width responsive
  },

  // Responsive Settings
  responsive: true,
  fullWidthResponsive: true,

  // Auto Ads Configuration (Recommended - enabled in index.html)
  autoAds: {
    enabled: true,       // ✅ Auto Ads are enabled in index.html
    autoOptimize: true,  // Google manages ad placement automatically
  },

  // 🎯 GENTLE ADS POLICY - NO SPAM
  // Google recommends max 3 ads per page for best user experience
  adDensity: {
    maxAdsPerPage: 3,                    // ✅ Maximum ads allowed (respects UX)
    minDistanceBetweenAds: 300,          // ✅ Minimum 300px between ads (no cramping)
    preventAdStackingVertically: true,   // ✅ No vertical stacking (gentle placement)
    respectUserExperience: true,         // ✅ Always prioritize user experience
  },

  // Ad refresh behavior (gentle - no aggressive refreshing)
  adBehavior: {
    autoRefresh: false,            // ✅ No auto-refreshing (respects user)
    preventClickFraud: true,       // ✅ Prevent accidental clicks
    gentlePlacement: true,         // ✅ Gentle, non-intrusive placement
    respectPrivacy: true,          // ✅ Respect user privacy
  },
};

/**
 * ✅ AUTO ADS - RECOMMENDED (Easiest Setup)
 *
 * HOW TO ENABLE AUTO ADS IN GOOGLE ADSENSE:
 *
 * 1. Go to Google AdSense dashboard: https://adsense.google.com
 * 2. Navigate to Ads → Ad units
 * 3. Click on "Auto ads" section
 * 4. Toggle "Enable Auto ads" ON ✅
 * 5. Toggle "Auto-optimize ad sizes" ON ✅
 * 6. Click "Save"
 * 7. Wait 24-48 hours for ads to appear on your site
 *
 * The code is ALREADY SET UP - just enable it in your AdSense dashboard!
 * Google will automatically place ads throughout your site.
 *
 * BENEFITS:
 * ✓ No manual configuration needed
 * ✓ Google optimizes ad placement automatically
 * ✓ Better revenue (Google tests placements)
 * ✓ Respects user experience
 * ✓ Gentle, non-intrusive placements
 *
 * ---------------------------------------------------
 *
 * 📌 MANUAL AD PLACEMENTS (Optional Alternative)
 *
 * If you prefer manual control, follow these steps:
 *
 * 1. Go to Google AdSense dashboard: https://adsense.google.com
 * 2. Navigate to Ads → By Page
 * 3. Click "Create new ad unit"
 * 4. Choose ad format:
 *    - Display ads (for belowHeader & beforeFooter)
 *    - In-feed ads (for contentMiddle)
 * 5. Give it a name (e.g., "Header Ad", "Content Ad", "Footer Ad")
 * 6. Copy the 10-digit slot ID (found in the ad unit details)
 * 7. Replace the placeholder values in slots object above
 *
 * EXAMPLE:
 * Replace this:
 *   belowHeader: 'YOUR_SLOT_BELOW_HEADER',
 * With your actual slot ID:
 *   belowHeader: '1234567890',
 *
 * Important: The publisher ID is already set in index.html
 * Only the individual slot IDs need to be updated here for manual placements.
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
 * ✅ Respects the 3-ad maximum per page
 * ✅ Ensures professional, non-spammy ad placement
 */
export const shouldShowAd = (
  position: "header" | "content" | "footer",
): boolean => {
  return ADSENSE_CONFIG.adDensity.respectUserExperience;
};
