"use client";

import { motion } from "framer-motion";
import { ColorResult, COLOR_DISPLAY_HEX } from "@/lib/colorAnalysis";

interface Props {
  colors: ColorResult[];
}

export default function ColorBreakdown({ colors }: Props) {
  return (
    <div className="space-y-3">
      {colors.map((color, i) => (
        <motion.div
          key={color.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="flex items-center gap-3"
        >
          {/* Color dot */}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10"
            style={{ backgroundColor: COLOR_DISPLAY_HEX[color.name] }}
          />

          {/* Label */}
          <span className="text-xs font-medium text-gray-600 w-14 flex-shrink-0">
            {color.name}
          </span>

          {/* Bar track */}
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: COLOR_DISPLAY_HEX[color.name] }}
              initial={{ width: 0 }}
              animate={{ width: `${color.percentage}%` }}
              transition={{ delay: i * 0.04 + 0.1, duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Percentage */}
          <span className="text-xs font-semibold text-gray-500 w-10 text-right flex-shrink-0">
            {color.percentage.toFixed(1)}%
          </span>
        </motion.div>
      ))}
    </div>
  );
}
