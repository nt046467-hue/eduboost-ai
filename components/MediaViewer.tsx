import React, { useState } from "react";
import { Theme } from "../types";

interface MediaViewerProps {
  theme: Theme;
  url: string;
  title: string;
  type: "PDF" | "VIDEO";
  onClose: () => void;
}

/**
 * Convert Google Drive sharing links to viewable format
 */
function getViewableURL(url: string, type: "PDF" | "VIDEO"): string {
  // Handle Google Drive share links
  if (url.includes("drive.google.com")) {
    let fileId = "";

    // Extract file ID from various Google Drive URL formats
    if (url.includes("/file/d/")) {
      fileId = url.split("/file/d/")[1].split("/")[0];
    } else if (url.includes("?id=")) {
      fileId = url.split("?id=")[1].split("&")[0];
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1].split("&")[0];
    }

    if (fileId) {
      if (type === "PDF") {
        // Use Google Drive preview for PDFs
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
  }

  return url;
}

/**
 * Convert Google Drive preview URL to download URL
 */
function getDownloadURL(url: string): string {
  if (url.includes("drive.google.com")) {
    let fileId = "";

    // Extract file ID from various Google Drive URL formats
    if (url.includes("/file/d/")) {
      fileId = url.split("/file/d/")[1].split("/")[0];
    } else if (url.includes("?id=")) {
      fileId = url.split("?id=")[1].split("&")[0];
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1].split("&")[0];
    } else if (url.includes("export=download")) {
      // Already a download link
      return url;
    }

    if (fileId) {
      // Use direct download URL for Google Drive
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  return url;
}

/**
 * Check if a URL is a Google Drive link
 */
function isGoogleDriveLink(url: string): boolean {
  return url.includes("drive.google.com");
}

/**
 * Download file from URL
 */
async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  theme,
  url,
  title,
  type,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const isLight = theme === "light";
  const cardBg = isLight
    ? "bg-white border-gray-200"
    : "bg-[#0a0a0a] border-[#1a1a1a]";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const buttonBg = isLight
    ? "bg-gray-100 text-gray-500"
    : "bg-white/5 text-gray-400";

  // Convert URL if needed for display
  const displayUrl = getViewableURL(url, type);
  const downloadUrl = getDownloadURL(url);
  const isGoogleDrive = isGoogleDriveLink(url);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadFile(downloadUrl, `${title}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-300">
      <div
        className={`${cardBg} border w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in duration-500`}
      >
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-2xl" aria-hidden="true">
              {type === "VIDEO" ? "🎥" : "📄"}
            </span>
            <div>
              <h2
                className={`text-xl font-black italic uppercase ${textColor} leading-none`}
              >
                {title}
              </h2>
              <p className="text-[10px] font-black text-[#00e5ff] uppercase tracking-widest mt-2">
                EduBoost Media Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${buttonBg} w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl hover:bg-red-500 hover:text-white transition-all focus:ring-2 ring-red-500 outline-none`}
            aria-label="Close Media Viewer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden w-full min-h-96">
          {type === "VIDEO" ? (
            <div className="w-full h-full">
              <iframe
                src={displayUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  minHeight: "400px",
                  maxHeight: "80vh",
                }}
              ></iframe>
            </div>
          ) : (
            // PDF handling
            <div className="w-full h-full flex flex-col">
              {isGoogleDrive ? (
                <iframe
                  src={displayUrl}
                  title={title}
                  className="w-full h-full border-0 flex-1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{
                    minHeight: "500px",
                    maxHeight: "80vh",
                    height: "100%",
                  }}
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 p-8 text-center w-full h-full">
                  <span className="text-6xl">📄</span>
                  <h3 className={`${textColor} font-black text-xl`}>{title}</h3>
                  <p className="text-gray-400 max-w-md">
                    This PDF is optimized for download. Click the button below
                    to open it in a new window or save it to your device.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#00e5ff] text-[#0a0a0a] px-8 py-3 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
                    >
                      📖 Open in New Tab
                    </a>
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-2xl font-black uppercase text-sm hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? "⬇️ Downloading..." : "⬇️ Download File"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-black/20 text-center">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Educational Content • EduBoost 2026 • NEB Board Authorized
          </p>
        </div>
      </div>
    </div>
  );
};
