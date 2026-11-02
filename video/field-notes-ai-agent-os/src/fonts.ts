import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fonts = [
  { family: "Geist", file: "geist-400.woff2", weight: "400" },
  { family: "Geist", file: "geist-500.woff2", weight: "500" },
  { family: "Geist", file: "geist-600.woff2", weight: "600" },
  { family: "Geist Mono", file: "geist-mono-400.woff2", weight: "400" },
  { family: "Geist Mono", file: "geist-mono-600.woff2", weight: "600" },
  { family: "Instrument Serif", file: "instrument-serif-400.woff2", weight: "400" },
];

fonts.forEach((f) => {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight }).catch((err) => {
    console.error("font failed", f.file, err);
  });
});
