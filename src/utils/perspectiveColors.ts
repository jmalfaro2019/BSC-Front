export type PerspectiveId =
  | "financiero"
  | "asociados-social-comercial"
  | "procesos-internos"
  | "aprendizaje";

export interface PerspectiveColorSet {
  accent: string;
  accentLight: string;
  accentBg: string;
  accentBgDark: string;
  accentText: string;
  accentTextDark: string;
  accentBorder: string;
  accentBorderDark: string;
  badge: string;
  ring: string;
  ringDark: string;
  bar: string;
}

const perspectiveColors: Record<PerspectiveId, PerspectiveColorSet> = {
  financiero: {
    accent: "#465fff",
    accentLight: "#465fff14",
    accentBg: "bg-brand-50",
    accentBgDark: "dark:bg-brand-500/10",
    accentText: "text-brand-600",
    accentTextDark: "dark:text-brand-400",
    accentBorder: "border-brand-500",
    accentBorderDark: "dark:border-brand-400",
    badge: "bg-brand-500/10 text-brand-700 dark:text-brand-300",
    ring: "stroke-brand-500",
    ringDark: "dark:stroke-brand-400",
    bar: "bg-brand-500",
  },
  "asociados-social-comercial": {
    accent: "#0ba5ec",
    accentLight: "#0ba5ec14",
    accentBg: "bg-blue-light-50",
    accentBgDark: "dark:bg-blue-light-500/10",
    accentText: "text-blue-light-600",
    accentTextDark: "dark:text-blue-light-400",
    accentBorder: "border-blue-light-500",
    accentBorderDark: "dark:border-blue-light-400",
    badge: "bg-blue-light-500/10 text-blue-light-700 dark:text-blue-light-300",
    ring: "stroke-blue-light-500",
    ringDark: "dark:stroke-blue-light-400",
    bar: "bg-blue-light-500",
  },
  "procesos-internos": {
    accent: "#7a5af8",
    accentLight: "#7a5af814",
    accentBg: "bg-violet-50",
    accentBgDark: "dark:bg-violet-500/10",
    accentText: "text-violet-600",
    accentTextDark: "dark:text-violet-400",
    accentBorder: "border-violet-500",
    accentBorderDark: "dark:border-violet-400",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    ring: "stroke-violet-500",
    ringDark: "dark:stroke-violet-400",
    bar: "bg-violet-500",
  },
  aprendizaje: {
    accent: "#f79009",
    accentLight: "#f7900914",
    accentBg: "bg-warning-50",
    accentBgDark: "dark:bg-warning-500/10",
    accentText: "text-warning-600",
    accentTextDark: "dark:text-warning-400",
    accentBorder: "border-warning-500",
    accentBorderDark: "dark:border-warning-400",
    badge: "bg-warning-500/10 text-warning-700 dark:text-warning-300",
    ring: "stroke-warning-500",
    ringDark: "dark:stroke-warning-400",
    bar: "bg-warning-500",
  },
};

export function getPerspectiveColors(id: string): PerspectiveColorSet {
  return (
    perspectiveColors[id as PerspectiveId] ?? perspectiveColors.financiero
  );
}

export function getProgressColor(progress: number): {
  text: string;
  bg: string;
  bar: string;
  badge: string;
} {
  if (progress >= 80) {
    return {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    };
  }
  if (progress >= 50) {
    return {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      bar: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    };
  }
  return {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    bar: "bg-red-500",
    badge: "bg-red-500/10 text-red-700 dark:text-red-300",
  };
}