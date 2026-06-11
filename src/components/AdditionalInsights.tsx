"use client";

import { motion } from "framer-motion";
import { AnalysisResult, COLOR_DISPLAY_HEX } from "@/lib/colorAnalysis";
import { ImageIcon, Ruler, Trophy, TrendingUp } from "lucide-react";
import { formatFileSize, getFileExtension } from "@/lib/colorAnalysis";

interface Props {
  result: AnalysisResult;
}

export default function AdditionalInsights({ result }: Props) {
  const top3 = result.colors.slice(0, 3);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
        Additional Insights
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Image info */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Image Info
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">Format</span>
              <span className="ml-auto font-semibold">
                {getFileExtension(result.fileName)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Ruler className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">Dimensions</span>
              <span className="ml-auto font-semibold">
                {result.imageWidth} × {result.imageHeight}px
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">
                💾
              </span>
              <span className="text-gray-400">File Size</span>
              <span className="ml-auto font-semibold">
                {formatFileSize(result.fileSize)}
              </span>
            </div>
          </div>
        </div>

        {/* Top 3 dominant */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Top Colors
          </p>
          <div className="space-y-2">
            {top3.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Trophy
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      i === 0
                        ? "text-yellow-400"
                        : i === 1
                        ? "text-gray-400"
                        : "text-amber-600"
                    }`}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: COLOR_DISPLAY_HEX[c.name] }}
                  />
                  <span className="text-xs text-gray-700 font-medium truncate">
                    {c.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-700 flex-shrink-0">
                  {c.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diversity score */}
        <div className="sm:col-span-2 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Color Diversity Score
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-600">
              {result.diversityScore}/100
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${result.diversityScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {result.diversityScore >= 75
              ? "Very diverse palette — many distinct colors present."
              : result.diversityScore >= 50
              ? "Moderately diverse palette."
              : result.diversityScore >= 25
              ? "Limited palette — a few colors dominate."
              : "Monochromatic or near-monochromatic image."}
          </p>
        </div>
      </div>
    </div>
  );
}
