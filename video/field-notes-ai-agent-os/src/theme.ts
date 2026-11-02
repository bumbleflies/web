export const C = {
  paper: "#fbf4e6",
  paperDeep: "#f7ecd7",
  card: "#fefbf4",
  ink: "#1f1b16",
  soft: "#6b6154",
  rule: "rgba(31,27,22,0.18)",
  amber: "#f7b93e",
  amberDeep: "#c08a2e",
  amberText: "#8a5f1f",
  amberSoft: "rgba(247,185,62,0.18)",
  blob: "#f9e4be",
  signal: "#4a3f8f",
} as const;

export const F = {
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', 'Courier New', monospace",
} as const;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Shared layout grid. */
export const G = {
  left: 92,
  right: 92,
  header: 168,
  headlineTop: 300,
  stageTop: 620,
  stageBottom: 1280,
  captionTop: 1470,
} as const;
