"use client";

import { motion } from "framer-motion";
import { X, Maximize2, RotateCcw, Loader2 } from "lucide-react";
import { formatFileSize, getFileExtension } from "@/lib/colorAnalysis";
import { useState } from "react";

interface Props {
  url: string;
  file: File;
  state: "uploaded" | "analyzing" | "done" | "error";
  progress: number;
  errorMsg: string;
  onAnalyze: () => void;
  onClose: () => void;
  onRetry: () => void;
}

export default function ImagePreviewCard({
  url,
  file,
  state,
  progress,
  errorMsg,
  onAnalyze,
  onClose,
  onRetry,
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isAnalyzing = state === "analyzing";
  const isError = state === "error";
  const isDone = state === "done";

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Image container */}
        <div className="relative bg-[#1a1a2e] rounded-t-2xl overflow-hidden"
             style={{ minHeight: 280 }}>
          {/* Image */}
          <motion.img
            key={url}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={url}
            alt="Uploaded image"
            className="w-full h-auto max-h-[340px] object-contain"
            style={{ display: "block" }}
          />

          {/* Top-right controls */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg
                         flex items-center justify-center transition-colors backdrop-blur-sm"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg
                         flex items-center justify-center transition-colors backdrop-blur-sm"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top-left label */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/50 text-white text-xs font-medium px-2.5 py-1
                             rounded-lg backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Image
            </span>
          </div>

          {/* Analyzing overlay */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center
                         justify-center gap-4 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-indigo-400" />
              </motion.div>
              <p className="text-white text-sm font-semibold tracking-wide">
                Analyzing image colors…
              </p>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/60 text-xs">{progress}%</p>
            </motion.div>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-indigo-600">
                {getFileExtension(file.name)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate max-w-[180px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-3 px-3 py-2.5 bg-red-50 border border-red-100
                       rounded-lg flex items-center justify-between gap-2"
          >
            <p className="text-xs text-red-600">{errorMsg}</p>
            <button
              onClick={onRetry}
              className="flex-shrink-0 flex items-center gap-1 text-xs font-medium
                         text-red-600 hover:text-red-700"
            >
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
          </motion.div>
        )}

        {/* Analyze button */}
        {!isAnalyzing && !isError && (
          <div className="px-4 pb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600
                         text-white text-sm font-bold rounded-xl shadow-md
                         hover:shadow-indigo-200 hover:shadow-lg transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDone ? "Re-analyze Colors →" : "Analyze Colors →"}
            </motion.button>
            <p className="text-center text-xs text-gray-400 mt-2">
              JPG · PNG · WEBP · Transparent PNG
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20
                       rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={url}
            alt="Full size preview"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
}
