"use client";

import { motion } from "framer-motion";
import { BarChart2, Upload, AlertCircle } from "lucide-react";

interface Props {
  state: "idle" | "uploaded" | "analyzing" | "done" | "error";
}

export default function EmptyResults({ state }: Props) {
  const config = {
    idle: {
      icon: <Upload className="w-10 h-10 text-gray-300" />,
      title: "No image uploaded yet",
      subtitle: "Upload an image on the left to get started.",
    },
    uploaded: {
      icon: <BarChart2 className="w-10 h-10 text-indigo-300" />,
      title: "Ready to analyze",
      subtitle: 'Click "Analyze Colors →" to generate your color breakdown.',
    },
    analyzing: {
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <BarChart2 className="w-10 h-10 text-indigo-400" />
        </motion.div>
      ),
      title: "Analyzing colors…",
      subtitle: "Processing pixel data. This takes just a moment.",
    },
    error: {
      icon: <AlertCircle className="w-10 h-10 text-red-300" />,
      title: "Something went wrong",
      subtitle: "Please retry or upload a different image.",
    },
    done: {
      icon: <BarChart2 className="w-10 h-10 text-gray-300" />,
      title: "No results",
      subtitle: "Run the analysis to see results here.",
    },
  }[state];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-gray-200 rounded-2xl flex flex-col
                 items-center justify-center text-center py-24 px-8 shadow-sm"
    >
      {/* Decorative rings */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-100
                        flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200
                          flex items-center justify-center">
            {config.icon}
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-700">{config.title}</h3>
      <p className="mt-1.5 text-sm text-gray-400 max-w-xs">{config.subtitle}</p>

      {/* Skeleton preview */}
      {state === "idle" && (
        <div className="mt-8 w-full max-w-xs space-y-2.5">
          {[100, 70, 55, 40, 30].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-100 flex-shrink-0" />
              <div
                className="h-2 rounded-full bg-gray-100"
                style={{ width: `${w}%` }}
              />
              <div className="w-7 h-2 rounded bg-gray-100 flex-shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
