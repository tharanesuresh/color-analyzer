"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { HistoryItem } from "./ColorAnalyzer";

interface Props {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (item: HistoryItem) => void;
  onNew: () => void;
}

export default function HistoryTray({ history, activeId, onSelect, onNew }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium mb-2">Recent Images</p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* New upload button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNew}
          className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-300
                     bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors
                     flex items-center justify-center text-gray-400 hover:text-indigo-500"
          title="Upload new image"
        >
          <Plus className="w-5 h-5" />
        </motion.button>

        {/* History thumbnails */}
        {history.map((item) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item)}
            className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
              activeId === item.id
                ? "border-indigo-500 shadow-md shadow-indigo-100"
                : "border-gray-200 hover:border-indigo-300"
            }`}
            title={item.file.name}
          >
            <img
              src={item.url}
              alt={item.file.name}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
