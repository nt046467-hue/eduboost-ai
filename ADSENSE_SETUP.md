# Google AdSense Integration Guide

## Setup Overview

Your EduBoost AI website is configured for Google AdSense with responsive display ads in 3 locations:

1. **Below Header** - After the hero section
2. **Content Middle** - Within main content area
3. **Before Footer** - Just before the footer section

---

## Installation Steps

### 1. Google AdSense Verification Script ✅

**Already added to `index.html`**

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3896962422851508"
  crossorigin="anonymous"
></script>
```

### 2. Configure Your Ad Slots

#### Step 1: Get Your Ad Unit IDs

1. Log in to [Google AdSense](https://adsense.google.com)
2. Navigate to **Ads** → **By Page**
3. Click **"Create new ad unit"** (or **"New ad unit"**)
4. Choose ad format:
   - **Display ads** (for header & footer)
   - **In-feed ads** (for content)
5. Name each ad unit:
   - "EduBoost - Header Ad"
   - "EduBoost - Content Ad"
   - "EduBoost - Footer Ad"
6. Copy the **slot ID** (10-digit number)

#### Step 2: Update `config/adsenseConfig.ts`

Open the file and replace the placeholder IDs:

```typescript
slots: {
  belowHeader: '1234567890',      // Replace with your slot ID
  contentMiddle: '1234567891',    // Replace with your slot ID
  beforeFooter: '1234567892',     // Replace with your slot ID
}
```

---

## File Structure

```
components/
├── AdSense.tsx           # Reusable ad component
└── AdPlacement.tsx       # Smart placement wrapper

hooks/
└── useAdSense.ts         # Ad management utilities

config/
└── adsenseConfig.ts      # Centralized configuration

index.html               # Updated with verification script
App.tsx                  # Updated with ad placements
```

---

## Component Usage

### Basic Ad Component

```tsx
import AdSense from "./components/AdSense";

<AdSense slot="1234567890" format="horizontal" responsive={true} />;
```

### Smart Placement (Recommended)

```tsx
import AdPlacement from "./components/AdPlacement";

// Automatically handles format, slot, and page restrictions
<AdPlacement position="header" className="mt-6 mb-10" />;
```

### Supported Formats

- **`auto`** - Google auto-detects best format (default)
- **`horizontal`** - Full-width responsive (728x90 or larger)
- **`vertical`** - Vertical format (300x600 or 160x600)
- **`rectangle`** - Medium rectangle (300x250)

---

## Mobile Responsiveness

All ads are configured with:

- ✅ **Responsive containers** - Adapt to screen size
- ✅ **Mobile-friendly sizing** - Proper dimensions on all devices
- ✅ **Padding & margins** - Prevent layout shift
- ✅ **Async loading** - Non-blocking script loading

### CSS Classes Used

```tsx
// Container ensures proper sizing
<div className="flex justify-center my-8">
  <ins className="adsbygoogle block w-full" />
</div>
```

---

## Policy Pages (No Ads)

Ads **automatically excluded** from:

- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/cookies` - Cookie Policy
- `/trust` - Trust & Safety

Implementation in `hooks/useAdSense.ts`:

```typescript
const noAdPages = [
  "/privacy",
  "/terms",
  "/cookies",
  "/trust",
  "/error",
  "/404",
];
return !noAdPages.some((page) => pathname.startsWith(page));
```

---

## Ad Placement Details

### 1. Below Header (Horizontal)

- **Location**: After hero section, before features
- **File**: `App.tsx` - `HomePage` component
- **Format**: Full-width responsive horizontal
- **Size**: Typically 728x90 (desktop) or responsive

### 2. Content Middle (Rectangle)

- **Location**: Between features/guides and impact sections
- **File**: `App.tsx` - `HomePage` component
- **Format**: Medium rectangle
- **Size**: Typically 300x250 or responsive

### 3. Before Footer (Horizontal)

- **Location**: Between main content and footer
- **File**: `App.tsx` - After `Routes` component
- **Format**: Full-width responsive horizontal
- **Size**: Typically 728x90 or responsive

---

## Async Loading

The AdSense script uses **async** attribute:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3896962422851508"
  crossorigin="anonymous"
></script>
```

Benefits:

- ✅ Non-blocking script load
- ✅ Faster page load times
- ✅ Improved Core Web Vitals
- ✅ Better user experience

---

## Prevention of Duplicates

The `AdPlacement` component ensures:

1. **Single instance per position** - Only one ad per location
2. **No duplicate IDs** - Each ad has unique identifier
3. **Smart rendering** - Checks page type before rendering

```typescript
// Returns null if not configured or wrong page type
if (slot.startsWith("YOUR_SLOT")) {
  return null;
}
if (!shouldPageHaveAds(pathname)) {
  return null;
}
```

---

## Troubleshooting

### Ads Not Showing

**Problem**: Ads display as blank boxes
**Solutions**:

1. ✅ Verify slot IDs are correct in `adsenseConfig.ts`
2. ✅ Check Google AdSense account is approved
3. ✅ Wait 24-48 hours for new ad units to activate
4. ✅ Clear browser cache (Ctrl+Shift+Delete)
5. ✅ Check browser console for errors

**Console Check**:

```javascript
// Open DevTools → Console
// Look for AdSense errors
console.log(window.adsbygoogle);
```

### Slot ID Not Recognized

**Problem**: Ad shows "NO CONTENT AVAILABLE"
**Solutions**:

1. ✅ Double-check slot ID from AdSense dashboard
2. ✅ Ensure slot ID is 10 digits (e.g., `1234567890`)
3. ✅ Verify slot is enabled in AdSense dashboard
4. ✅ Check ad unit format matches configuration

### Layout Shift

**Problem**: Page layout jumps when ad loads
**Solutions**:

1. ✅ Container has fixed height (min-height: 100px)
2. ✅ Proper margin/padding applied (my-8)
3. ✅ CSS prevents unexpected shifts

---

## Performance Tips

### 1. Lazy Loading (Optional)

For better performance, implement lazy loading:

```tsx
const [isVisible, setIsVisible] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  });

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

return isVisible ? <AdPlacement position="header" /> : null;
```

### 2. Ad Refresh Control

Prevent excessive ad refreshes (AdSense default: every 30 seconds)

```typescript
// In adsbygoogle.push()
{
  google_ad_client: 'ca-pub-3896962422851508',
  enable_page_level_ads: true,
  // Limit refreshes to improve user experience
  refresh_interval: 120 // 2 minutes
}
```

### 3. Testing Mode

During development, use test ads:

```typescript
// Add to config
testMode: {
  enabled: process.env.NODE_ENV === 'development',
  testAdUnitId: 'ca-pub-3906467331057470'
}
```

---

## Monitoring & Analytics

### AdSense Dashboard Metrics

1. **Earnings** - Revenue from ads
2. **Page RPM** - Revenue per 1000 impressions
3. **CTR** - Click-through rate
4. **Impressions** - Times ads were shown

### Integration with Google Analytics

The verification script automatically tracks:

- Ad impressions
- Ad clicks
- Revenue attribution

---

## Best Practices

✅ **Do:**

- Place ads in high-visibility areas
- Use responsive formats
- Test on mobile devices
- Monitor performance metrics
- Follow AdSense policies
- Keep content quality high

❌ **Don't:**

- Click your own ads
- Encourage users to click ads
- Place ads on low-quality pages
- Use misleading ad placement
- Place too many ads per page
- Violate AdSense policies

---

## AdSense Policy Compliance

### Prohibited Content

Your site **cannot** have ads on pages with:

- Adult content
- Illegal activities
- Violence or hate speech
- Misleading content
- Copyright infringement

### Placement Rules

- ✅ Ads should be clearly distinguishable
- ✅ Don't overlap with site navigation
- ✅ Don't place more than 3 ads per page
- ✅ Ensure fast page load times

**Current Configuration**: 3 ads per homepage (compliant)

---

## Google AdSense Terms

By implementing Google AdSense, you agree to:

- [Google AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [Google Ads Policies](https://support.google.com/adspolicy)
- [Google Privacy Policy](https://policies.google.com/privacy)

---

## Support & Resources

- 📚 [AdSense Help Center](https://support.google.com/adsense)
- 📖 [AdSense Policy Guide](https://support.google.com/adsense/answer/48182)
- 🔍 [AdSense Dashboard](https://adsense.google.com)
- 💬 [AdSense Community](https://support.google.com/adsense/community)

---

## Quick Reference

| Component       | File                         | Purpose              |
| --------------- | ---------------------------- | -------------------- |
| AdSense         | `components/AdSense.tsx`     | Core ad component    |
| AdPlacement     | `components/AdPlacement.tsx` | Smart wrapper        |
| useAdSense Hook | `hooks/useAdSense.ts`        | Management utilities |
| Config          | `config/adsenseConfig.ts`    | Slot IDs & settings  |

---

## Next Steps

1. ✅ Open `config/adsenseConfig.ts`
2. ✅ Replace placeholder slot IDs with your actual IDs
3. ✅ Test locally: `npm run dev`
4. ✅ Deploy to production
5. ✅ Monitor AdSense dashboard for impressions
6. ✅ Optimize based on performance metrics

---

**Happy monetizing! 🎉**
