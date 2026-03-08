#!/usr/bin/env node

/**
 * Script to create ads.txt file for Google AdSense
 * Run: node create-ads-txt.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your AdSense Publisher ID
const PUBLISHER_ID = "ca-pub-3896962422851508";

// AdSense ads.txt content
// Format: domain, publisher-id, account-type, certification-authority
const adsContent = `# Ads.txt file for EduBoost AI
# Updated: ${new Date().toISOString()}
# Last modified: ${new Date().toLocaleDateString()}

# Google AdSense
google.com, ${PUBLISHER_ID}, DIRECT, f08c47fec0942fa0

# Add more ad networks below this line:
# Format: domain, publisher-id, account-type, certification-authority
# Example:
# Example.com, pub-1234567890123456, RESELLER, 1234567890abcdef

`;

const rootDir = path.join(__dirname);
const filePath = path.join(rootDir, "ads.txt");

try {
  // Write the ads.txt file
  fs.writeFileSync(filePath, adsContent, "utf8");

  console.log("✅ ads.txt file created successfully!");
  console.log(`📁 Location: ${filePath}`);
  console.log(`📝 Content preview:`);
  console.log("---");
  console.log(adsContent);
  console.log("---");
  console.log(
    "\n💡 To add more ad networks, edit the ads.txt file and add new lines with the format:",
  );
  console.log("   domain, publisher-id, account-type, certification-authority");
} catch (error) {
  console.error("❌ Error creating ads.txt file:", error.message);
  process.exit(1);
}
