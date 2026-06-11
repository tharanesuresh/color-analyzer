"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  analyzeImageColors,
  AnalysisResult,
} from "@/lib/colorAnalysis";
import UploadZone from "./UploadZone";
import ImagePreviewCard from "./ImagePreviewCard";
import ResultsDashboard from "./ResultsDashboard";
import HistoryTray from "./HistoryTray";
import EmptyResults from "./EmptyResults";

export interface HistoryItem {
  id: string;
  file: File;
  url: string;
  result: AnalysisResult;
}

type AppState = "idle" | "uploaded" | "analyzing" | "done" | "error";

export default function ColorAnalyzer() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFileSelect = useCallback((file: File) => {
    // Validate
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Unsupported format. Please upload JPG, PNG, or WEBP.");
      setAppState("error");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorMsg("File too large. Max size is 30MB.");
      setAppState("error");
      return;
    }

    const url = URL.createObjectURL(file);
    setCurrentFile(file);
    setCurrentUrl(url);
    setCurrentResult(null);
    setErrorMsg("");
    setAppState("uploaded");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!currentFile || !currentUrl) return;

    setAppState("analyzing");
    setProgress(0);

    try {
      const result = await analyzeImageColors(currentFile, (pct) => {
        setProgress(pct);
      });

      setCurrentResult(result);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        file: currentFile,
        url: currentUrl,
        result,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
      setActiveId(newItem.id);
      setAppState("done");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Analysis failed. Please retry."
      );
      setAppState("error");
    }
  }, [currentFile, currentUrl]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setCurrentFile(item.file);
    setCurrentUrl(item.url);
    setCurrentResult(item.result);
    setActiveId(item.id);
    setAppState("done");
  }, []);

  const handleReset = useCallback(() => {
    setCurrentFile(null);
    setCurrentUrl(null);
    setCurrentResult(null);
    setActiveId(null);
    setErrorMsg("");
    setAppState("idle");
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMsg("");
    setAppState(currentFile ? "uploaded" : "idle");
  }, [currentFile]);

  const showImagePanel =
    appState === "uploaded" ||
    appState === "analyzing" ||
    appState === "done" ||
    appState === "error";

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                color
              </span>
              <span className="text-2xl font-bold text-indigo-600 tracking-tight">
                analyzer
              </span>
            </div>
            <span className="hidden sm:block text-sm text-gray-400 ml-2 pl-3 border-l border-gray-200">
              pixel-level color breakdown in seconds
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Free Tool
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero (shown only on idle) ── */}
      <AnimatePresence>
        {appState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-5 py-10 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Analyze Image Colors{" "}
                <span className="text-indigo-600">Instantly</span>
              </h1>
              <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
                Upload any image and get a pixel-level color breakdown in
                seconds. Perfect for designers, marketers &amp; creators.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                {[
                  "⚡ Pixel-Level Analysis",
                  "🎨 11 Color Categories",
                  "📊 Instant Visual Reports",
                  "🏆 Dominant Color Detection",
                ].map((f) => (
                  <span
                    key={f}
                    className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Upload Image
            </p>

            <AnimatePresence mode="wait">
              {!showImagePanel ? (
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <UploadZone onFileSelect={handleFileSelect} />
                </motion.div>
              ) : (
                <motion.div
                  key="image-preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImagePreviewCard
                    url={currentUrl!}
                    file={currentFile!}
                    state={appState}
                    progress={progress}
                    errorMsg={errorMsg}
                    onAnalyze={handleAnalyze}
                    onClose={handleReset}
                    onRetry={handleRetry}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* History tray */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <HistoryTray
                    history={history}
                    activeId={activeId}
                    onSelect={handleHistorySelect}
                    onNew={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Results
            </p>

            <AnimatePresence mode="wait">
              {appState === "done" && currentResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultsDashboard result={currentResult} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyResults state={appState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 pb-8 text-center text-xs text-gray-400">
        Built by Tharane Suresh · UI/UX Designer & Product Management
      </footer>
    </div>
  );
}
