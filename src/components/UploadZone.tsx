"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

const FORMATS = ["JPG", "PNG", "WEBP", "Transparent PNG"];

export default function UploadZone({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // reset so same file can be re-uploaded
      e.target.value = "";
    },
    [processFile]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone card */}
      <motion.div
        animate={{
          borderColor: isDragging ? "#6366f1" : "#e5e7eb",
          backgroundColor: isDragging ? "#eef2ff" : "#ffffff",
          scale: isDragging ? 1.01 : 1,
        }}
        transition={{ duration: 0.15 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-5
                   min-h-[340px] border-2 border-dashed border-gray-200
                   rounded-2xl cursor-pointer bg-white transition-colors
                   hover:border-indigo-400 hover:bg-indigo-50/30 group"
      >
        {/* Decorative grid dots */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Upload icon */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100
                       flex items-center justify-center group-hover:bg-indigo-100 transition-colors"
          >
            <Upload className="w-9 h-9 text-indigo-500" strokeWidth={1.5} />
          </motion.div>

          <div className="text-center">
            <p className="text-base font-semibold text-gray-800">
              Drag &amp; drop your image here
            </p>
            <p className="mt-1 text-sm text-gray-400">
              or click to browse files
            </p>
          </div>
        </div>

        {/* Upload button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="relative z-10 flex items-center gap-2 px-6 py-3
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     text-white text-sm font-semibold rounded-xl shadow-md
                     hover:shadow-indigo-200 hover:shadow-lg transition-shadow"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <ImagePlus className="w-4 h-4" />
          Upload Image
        </motion.button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </motion.div>

      {/* Format pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FORMATS.map((fmt) => (
          <span
            key={fmt}
            className="text-xs text-gray-400 font-medium bg-white border border-gray-200
                       px-3 py-1 rounded-full"
          >
            {fmt}
          </span>
        ))}
      </div>

      {/* Example thumbnails */}
      <div className="mt-2">
        <p className="text-xs text-gray-400 text-center mb-2">
          Try with any image →
        </p>
        <div className="flex justify-center gap-2">
          {[
            "🌅",
            "🖼️",
            "🌿",
            "🎨",
          ].map((emoji, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200
                         flex items-center justify-center text-2xl"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
