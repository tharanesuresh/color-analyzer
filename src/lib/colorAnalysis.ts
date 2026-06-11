export type ColorName =
  | "White"
  | "Black"
  | "Gray"
  | "Red"
  | "Green"
  | "Yellow"
  | "Blue"
  | "Brown"
  | "Purple"
  | "Pink"
  | "Orange";

export interface ColorResult {
  name: ColorName;
  percentage: number;
  hex: string;
  count: number;
}

export interface AnalysisResult {
  colors: ColorResult[];
  topColor: ColorName;
  dominantPercentage: number;
  colorsFound: number;
  tone: "Warm" | "Cool" | "Neutral" | "Mixed";
  diversityScore: number;
  imageWidth: number;
  imageHeight: number;
  fileName: string;
  fileSize: number;
}

export const COLOR_HEX: Record<ColorName, string> = {
  White: "#f8f8f8",
  Black: "#1a1a2e",
  Gray: "#9ca3af",
  Red: "#ef4444",
  Green: "#22c55e",
  Yellow: "#eab308",
  Blue: "#3b82f6",
  Brown: "#92400e",
  Purple: "#8b5cf6",
  Pink: "#ec4899",
  Orange: "#f97316",
};

export const COLOR_DISPLAY_HEX: Record<ColorName, string> = {
  White: "#e5e7eb",
  Black: "#1f2937",
  Gray: "#9ca3af",
  Red: "#ef4444",
  Green: "#22c55e",
  Yellow: "#eab308",
  Blue: "#3b82f6",
  Brown: "#92400e",
  Purple: "#8b5cf6",
  Pink: "#ec4899",
  Orange: "#f97316",
};

/** Convert RGB (0-255) to HSV (H: 0-360, S: 0-100, V: 0-100) */
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    if (max === rn) {
      h = ((gn - bn) / diff) % 6;
    } else if (max === gn) {
      h = (bn - rn) / diff + 2;
    } else {
      h = (rn - gn) / diff + 4;
    }
    h = h * 60;
    if (h < 0) h += 360;
  }

  return [h, s * 100, v * 100];
}

/**
 * Classify a single RGBA pixel into one of 11 color categories.
 * Returns null for transparent pixels (alpha < 128).
 *
 * Algorithm uses HSV color space:
 *   V (value/brightness): 0-100
 *   S (saturation):       0-100
 *   H (hue):              0-360
 *
 * Classification order (highest priority first):
 *   1. Transparent  → skip
 *   2. Black        → V < 15
 *   3. White        → V > 80, S < 20
 *   4. Gray         → S < 20 (achromatic, mid-range V)
 *   5. Brown        → hue 15-50, V < 45 (dark warm tones)
 *   6. Red          → hue 0-15 or 345-360
 *   7. Orange       → hue 15-45
 *   8. Yellow       → hue 45-75
 *   9. Green        → hue 75-165
 *  10. Blue         → hue 165-255
 *  11. Purple       → hue 255-315
 *  12. Pink         → hue 315-345
 */
function classifyPixel(
  r: number,
  g: number,
  b: number,
  a: number
): ColorName | null {
  if (a < 128) return null;

  const [h, s, v] = rgbToHsv(r, g, b);

  // Achromatic checks first
  if (v < 15) return "Black";
  if (v > 80 && s < 20) return "White";
  if (s < 20) return "Gray";

  // Brown: dark orange-red tones (comes before Red/Orange to catch dark warm pixels)
  if (h >= 15 && h < 50 && v < 45 && s >= 25) return "Brown";

  // Chromatic hue bands
  if ((h < 15 || h >= 345) && s >= 25) return "Red";
  if (h >= 15 && h < 45 && s >= 25) return "Orange";
  if (h >= 45 && h < 75 && s >= 25) return "Yellow";
  if (h >= 75 && h < 165 && s >= 25) return "Green";
  if (h >= 165 && h < 255 && s >= 25) return "Blue";
  if (h >= 255 && h < 315 && s >= 25) return "Purple";
  if (h >= 315 && h < 345 && s >= 25) return "Pink";

  // Fallback for low-saturation chromatic pixels
  return "Gray";
}

export async function analyzeImageColors(
  imageFile: File,
  onProgress?: (pct: number) => void
): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Canvas 2D context not available");

        const origWidth = img.naturalWidth;
        const origHeight = img.naturalHeight;

        // Down-sample large images to max 600px on longest side for speed
        const MAX = 600;
        const ratio = Math.min(MAX / origWidth, MAX / origHeight, 1);
        const w = Math.max(1, Math.floor(origWidth * ratio));
        const h = Math.max(1, Math.floor(origHeight * ratio));

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const { data } = ctx.getImageData(0, 0, w, h);
        const len = data.length;

        const counts: Record<ColorName, number> = {
          White: 0,
          Black: 0,
          Gray: 0,
          Red: 0,
          Green: 0,
          Yellow: 0,
          Blue: 0,
          Brown: 0,
          Purple: 0,
          Pink: 0,
          Orange: 0,
        };

        let total = 0;

        for (let i = 0; i < len; i += 4) {
          const color = classifyPixel(
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3]
          );
          if (color) {
            counts[color]++;
            total++;
          }
          // Report progress every ~10% of pixels
          if (onProgress && i % Math.floor(len / 10) === 0) {
            onProgress(Math.min(99, Math.round((i / len) * 100)));
          }
        }

        if (total === 0) throw new Error("No opaque pixels found in image");

        // Build sorted results
        const colors: ColorResult[] = (
          Object.keys(counts) as ColorName[]
        )
          .map((name) => ({
            name,
            count: counts[name],
            percentage: (counts[name] / total) * 100,
            hex: COLOR_HEX[name],
          }))
          .filter((c) => c.count > 0)
          .sort((a, b) => b.percentage - a.percentage);

        // Normalize so percentages sum to exactly 100
        const sum = colors.reduce((acc, c) => acc + c.percentage, 0);
        if (sum > 0) {
          colors.forEach((c) => {
            c.percentage = (c.percentage / sum) * 100;
          });
        }

        const topColor = colors[0].name;
        const dominantPercentage = colors[0].percentage;

        // Determine tone
        const warmColors: ColorName[] = [
          "Red",
          "Orange",
          "Yellow",
          "Brown",
          "Pink",
        ];
        const coolColors: ColorName[] = ["Blue", "Green", "Purple"];

        const warmPct = colors
          .filter((c) => warmColors.includes(c.name))
          .reduce((s, c) => s + c.percentage, 0);
        const coolPct = colors
          .filter((c) => coolColors.includes(c.name))
          .reduce((s, c) => s + c.percentage, 0);
        const chromatic = warmPct + coolPct;

        let tone: "Warm" | "Cool" | "Neutral" | "Mixed";
        if (chromatic < 15) {
          tone = "Neutral";
        } else if (warmPct > coolPct * 1.8) {
          tone = "Warm";
        } else if (coolPct > warmPct * 1.8) {
          tone = "Cool";
        } else {
          tone = "Mixed";
        }

        // Diversity score via Shannon entropy (0-100)
        const maxEntropy = Math.log(11);
        const entropy = colors.reduce((s, c) => {
          const p = c.percentage / 100;
          return s + (p > 0 ? -p * Math.log(p) : 0);
        }, 0);
        const diversityScore = Math.round((entropy / maxEntropy) * 100);

        URL.revokeObjectURL(objectUrl);
        onProgress?.(100);

        resolve({
          colors,
          topColor,
          dominantPercentage,
          colorsFound: colors.length,
          tone,
          diversityScore,
          imageWidth: origWidth,
          imageHeight: origHeight,
          fileName: imageFile.name,
          fileSize: imageFile.size,
        });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image. Please try another file."));
    };

    img.src = objectUrl;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toUpperCase() ?? "IMG";
}
