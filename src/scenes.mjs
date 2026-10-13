// A scene is the daily "mood" of the hero. Rotates by UTC day so no two
// consecutive days look the same, while staying deterministic for a date.
export const SCENES = [
  { id: "deep-work", mode: "focus",    label: "Deep work",  accent: { dark: "#a78bfa", light: "#7c3aed" }, line: "Spec first. Then slices. Then code." },
  { id: "live-set",  mode: "fun",      label: "Live set",   accent: { dark: "#f472b6", light: "#db2777" }, line: "Loud room, clear head." },
  { id: "dialogue",  mode: "focus",    label: "Dialogue",   accent: { dark: "#60a5fa", light: "#2563eb" }, line: "Learn by asking, then by doing." },
  { id: "recovery",  mode: "recovery", label: "Recovery",   accent: { dark: "#2dd4bf", light: "#0d9488" }, line: "Rest is part of the plan." },
  { id: "markets",   mode: "focus",    label: "Markets",    accent: { dark: "#4ade80", light: "#16a34a" }, line: "Read the signal, ignore the noise." },
  { id: "premiere",  mode: "fun",      label: "Premiere",   accent: { dark: "#fbbf24", light: "#d97706" }, line: "Widescreen ideas, frame by frame." },
];

export function pickScene(date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  return SCENES[((day % SCENES.length) + SCENES.length) % SCENES.length];
}
