import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color Analyzer — Pixel-Level Color Breakdown",
  description:
    "Upload any image and get an instant pixel-level color breakdown in seconds. Analyze 11 color categories with beautiful charts.",
  keywords: "color analyzer, image colors, pixel analysis, color breakdown, dominant color",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f5f6f8]">{children}</body>
    </html>
  );
}
