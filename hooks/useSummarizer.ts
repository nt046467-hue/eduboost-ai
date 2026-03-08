import { useState } from "react";
import { getAIResponse } from "../services/geminiService";

export interface SummaryState {
  [key: string]: {
    text: string;
    loading: boolean;
    error?: string;
  };
}

export const usePDFSummarizer = () => {
  const [summaries, setSummaries] = useState<SummaryState>({});

  const generateSummary = async (
    id: string,
    title: string,
    category: string,
  ) => {
    setSummaries((prev) => ({
      ...prev,
      [id]: { text: "", loading: true },
    }));

    try {
      const prompt = `Create a brief 2-3 sentence summary for a study material titled "${title}" in the ${category} category. Make it educational and concise, perfect for a quick reference.`;

      const response = await getAIResponse(
        prompt,
        "You are an expert study material summarizer. Create clear, concise summaries that capture the essence of study materials.",
      );

      setSummaries((prev) => ({
        ...prev,
        [id]: { text: response, loading: false },
      }));
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaries((prev) => ({
        ...prev,
        [id]: {
          text: "Could not generate summary. Please try again.",
          loading: false,
          error: "Failed to generate summary",
        },
      }));
    }
  };

  return { summaries, generateSummary };
};

export const useVideoSummarizer = () => {
  const [summaries, setSummaries] = useState<SummaryState>({});

  const generateSummary = async (
    id: string,
    title: string,
    duration?: string,
  ) => {
    setSummaries((prev) => ({
      ...prev,
      [id]: { text: "", loading: true },
    }));

    try {
      const prompt = `Create a brief 2-3 sentence summary for a video titled "${title}"${duration ? ` (${duration})` : ""}. Focus on the key learning points and concepts covered.`;

      const response = await getAIResponse(
        prompt,
        "You are an expert video content summarizer. Create clear, educational summaries that highlight the main concepts and learning outcomes.",
      );

      setSummaries((prev) => ({
        ...prev,
        [id]: { text: response, loading: false },
      }));
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaries((prev) => ({
        ...prev,
        [id]: {
          text: "Could not generate summary. Please try again.",
          loading: false,
          error: "Failed to generate summary",
        },
      }));
    }
  };

  return { summaries, generateSummary };
};
