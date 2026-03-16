import { Handler } from "@netlify/functions";
import fs from "fs";
import path from "path";

/**
 * Netlify Function to serve ads.txt with proper error handling
 * Handles 404 and unauthorized access cases
 */

const handler: Handler = async (event) => {
  try {
    // Only handle GET requests
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
        headers: { "Content-Type": "text/plain" },
      };
    }

    // Get ads.txt from public directory
    const adsFilePath = path.join(process.cwd(), "public", "ads.txt");

    // Check if file exists
    if (!fs.existsSync(adsFilePath)) {
      console.warn("⚠️ ads.txt file not found at:", adsFilePath);
      return {
        statusCode: 404,
        body: "# ads.txt file not found\n# Please ensure ads.txt is configured in /public directory",
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600",
        },
      };
    }

    // Read the file
    const adsContent = fs.readFileSync(adsFilePath, "utf-8");

    // Validate ads.txt content (should contain at least publisher ID)
    if (!adsContent.includes("google.com") && !adsContent.includes("DIRECT")) {
      console.warn(
        "⚠️ ads.txt content validation failed - missing required entries",
      );
      return {
        statusCode: 400,
        body: "# ads.txt validation failed - invalid content format",
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600",
        },
      };
    }

    // Return the ads.txt file with proper headers
    return {
      statusCode: 200,
      body: adsContent,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("❌ Error serving ads.txt:", error);

    // Return error response
    return {
      statusCode: 500,
      body: "# Internal Server Error - Unable to serve ads.txt",
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    };
  }
};

export { handler };
