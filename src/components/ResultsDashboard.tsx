"use client";

import { motion } from "framer-motion";
import { AnalysisResult, COLOR_DISPLAY_HEX } from "@/lib/colorAnalysis";
import StatsCards from "./StatsCards";
import ColorPieChart from "./ColorPieChart";
import ColorBreakdown from "./ColorBreakdown";
import AdditionalInsights from "./AdditionalInsights";

interface Props {
  result: AnalysisResult;
}

export default function ResultsDashboard({ result }: Props) {
  return (
    <div className="space-y-4">
      {/* Top stat cards */}
      <StatsCards result={result} />

      {/* Charts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Distribution
          </p>
          <ColorPieChart colors={result.colors} />

          {/* Legend below chart */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {result.colors.slice(0, 8).map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: COLOR_DISPLAY_HEX[c.name] }}
                />
                <span className="text-xs text-gray-600 truncate">{c.name}</span>
                <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                  {c.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Breakdown bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Color Breakdown
          </p>
          <ColorBreakdown colors={result.colors} />
        </motion.div>
      </div>

      {/* Additional insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AdditionalInsights result={result} />
      </motion.div>
    </div>
  );
}
