// src/utils/cleanup.ts
import he from "he";

export const cleanDescription = (desc?: string): string => {
  if (!desc) return "";

  return he
    .decode(desc) // Convert HTML entities to normal characters
    .replace(/&#10;/g, " ")                      // Line breaks
    .replace(/[\u200B-\u200D\uFEFF]/g, "")       // Zero-width characters
    .replace(/\s{2,}/g, " ")                     // Extra spaces
    .trim();                                     // Trim ends
};

export const shortenDescription = (desc?: string, max = 250): string => {
  if (!desc) return "";
  const clean = cleanDescription(desc);
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
};
