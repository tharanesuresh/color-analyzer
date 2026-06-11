"use client";

import { motion } from "framer-motion";
import { AnalysisResult, COLOR_DISPLAY_HEX } from "@/lib/colorAnalysis";
import { Droplets, Percent, Hash, Thermometer } from "lucide-react";

interface Props {
  result: AnalysisResult;
}

const TONE_COLOR: Record<string, string> = {
  Warm: "text-orange-600 bg-orange-50",
  Cool: "text-blue-600 bg-blue-50",
  Neutral: "text-gray-600 bg-gray-100",
  Mixed: "text-violet-600 bg-violet-50",
};

export default function StatsCards({ result }: Props) {
  const cards = [
    {
      label: "Top Color",
      value: result.topColor,
      icon: (
        <span
          className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
          style={{ backgroundColor: COLOR_DISPLAY_HEX[result.topColor] }}
        />
      ),
      accent: "indigo",
    },
    {
      label: "Dominant",
      value: `${result.dominantPercentage.toFixed(1)}%`,
      icon: <Percent className="w-4 h-4 text-violet-500" />,
      accent: "violet",
    },
    {
      label: "Colors Found",
      value: result.colorsFound.toString(),
      icon: <Hash className="w-4 h-4 text-sky-500" />,
      accent: "sky",
    },
    {
      label: "Tone",
      value: result.tone,
      icon: <Thermometer className="w-4 h-4 text-rose-500" />,
      accent: "rose",
      toneStyle: TONE_COLOR[result.tone],
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-2">
            {card.icon}
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              {card.label}
            </p>
          </div>
          <p
            className={`text-xl font-bold truncate ${
              card.toneStyle ? card.toneStyle.split(" ")[0] : "text-gray-900"
            }`}
          >
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
