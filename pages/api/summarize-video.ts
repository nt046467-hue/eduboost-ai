import type { NextApiRequest, NextApiResponse } from "next";

// This endpoint is a simple fallback for local video summarization.  In the
// absence of a real transcription service we simply return a generic response.
// The client-side code no longer depends on this route, but keeping it prevents
// 404 errors if older versions still hit the path.

type VideoSummaryResponse = {
  overview: string;
  mainConcepts: string[];
  keyTakeaways: string[];
  definitions: Record<string, string>;
  quickFacts: string[];
  relatedTopics: string[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoSummaryResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      overview: "",
      mainConcepts: [],
      keyTakeaways: [],
      definitions: {},
      quickFacts: [],
      relatedTopics: [],
      error: "Method not allowed",
    });
  }

  // We could parse the uploaded file here if desired, but for now just return a
  // placeholder message directing users to use a URL or ensure their API key is
  // configured.
  res.status(200).json({
    overview:
      "Unable to generate local video summary. Please provide a URL or ensure the AI key is set.",
    mainConcepts: [],
    keyTakeaways: [],
    definitions: {},
    quickFacts: [],
    relatedTopics: [],
  });
}
