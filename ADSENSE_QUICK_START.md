# 🚀 AdSense Quick Setup (5 Minutes)

## What's Already Done ✅

- ✅ AdSense verification script in `index.html`
- ✅ Reusable `AdSense` component
- ✅ Smart `AdPlacement` wrapper
- ✅ Ad slots in strategic locations:
  1. Below header (after hero)
  2. Content middle (between sections)
  3. Before footer
- ✅ Mobile responsive design
- ✅ Automatic policy page exclusion
- ✅ Async loading
- ✅ Duplicate prevention

## What You Need to Do

### Step 1: Get Your Slot IDs (3 minutes)

1. Open [Google AdSense Dashboard](https://adsense.google.com)
2. Go to **Ads** → **By Page**
3. Click **"Create new ad unit"**
4. Create 3 ad units:

| Name             | Format  | Keep This ID |
| ---------------- | ------- | ------------ |
| EduBoost Header  | Display | `SLOT_ID_1`  |
| EduBoost Content | Display | `SLOT_ID_2`  |
| EduBoost Footer  | Display | `SLOT_ID_3`  |

### Step 2: Update Configuration (2 minutes)

**File**: `config/adsenseConfig.ts`

Find this:

```typescript
slots: {
  belowHeader: 'YOUR_SLOT_BELOW_HEADER',
  contentMiddle: 'YOUR_SLOT_CONTENT_MIDDLE',
  beforeFooter: 'YOUR_SLOT_BEFORE_FOOTER',
}
```

Replace with your actual IDs:

```typescript
slots: {
  belowHeader: '1234567890',      // Your header ad slot
  contentMiddle: '0987654321',    // Your content ad slot
  beforeFooter: '1122334455',     // Your footer ad slot
}
```

## Done! 🎉

Your ads are now configured and will appear on:

- ✅ Homepage (all 3 ad slots)
- ✅ Study guides pages
- ✅ Blog pages
- ❌ Privacy/Terms/Cookie/Trust pages (automatically excluded)

## Testing

### Local Testing

```bash
npm run dev
# Visit http://localhost:3000
# Check browser console for any AdSense errors
```

### Live Testing

1. Deploy to production
2. Wait 24-48 hours for ad units to activate
3. Check Google AdSense dashboard for impressions

## Troubleshooting

**Ads showing blank?**

- ✅ Verify slot IDs are correct
- ✅ Wait 24-48 hours for activation
- ✅ Check browser console for errors

**Want to see example ads immediately?**

- Use test ad unit: `ca-pub-3906467331057470`
- (This shows dummy ads in development)

## Files Modified

```
index.html                      # Added AdSense script
config/adsenseConfig.ts         # NEW - Your configuration
components/AdSense.tsx          # NEW - Core component
components/AdPlacement.tsx      # NEW - Smart wrapper
hooks/useAdSense.ts            # NEW - Utilities
App.tsx                         # Updated with ad placements
ADSENSE_SETUP.md               # NEW - Full guide
ADSENSE_QUICK_START.md         # NEW - This file
```

## Support

- 📖 Full guide: `ADSENSE_SETUP.md`
- 🔗 AdSense Help: https://support.google.com/adsense
- 💬 Community: https://support.google.com/adsense/community

---

**That's it! Your website is ready to earn from AdSense! 💰**
