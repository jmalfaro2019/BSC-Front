import React from "react";

interface ActionCardProps {
  name: string;
  progress: number;
}
function getProgressColors(progress: number) {
  if (progress >= 80) {
    return {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      pct: "text-emerald-600 dark:text-emerald-400",
      ring: "stroke-emerald-500 dark:stroke-emerald-400",
      text: "fill-emerald-600 dark:fill-emerald-400",
    };
  } else if (progress >= 50) {
    return {
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",
      pct: "text-amber-600 dark:text-amber-400",
      ring: "stroke-amber-500 dark:stroke-amber-400",
      text: "fill-amber-600 dark:fill-amber-400",
    };
  }
  return {
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    pct: "text-red-600 dark:text-red-400",
    ring: "stroke-red-500 dark:stroke-red-400",
    text: "fill-red-600 dark:fill-red-400",
  };
}


export default function ActionCard({ name, progress }: ActionCardProps) {
  const radius = 38;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / 100) * circumference;

  const colors = getProgressColors(progress);
  const ringColor = colors.ring;
  const textColor = colors.text;

  return (
    <div
      className="
        flex flex-col items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900 p-4 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
        w-[170px] shrink-0
      "
    >
      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="rotate-[-90deg]"
        >
          {/* Track */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${ringColor} transition-all duration-700 ease-out`}
          />
        </svg>
        {/* Center label */}
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="absolute inset-0"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="700"
            className={textColor}
          >
            {progress}%
          </text>
        </svg>
      </div>

      {/* Action name */}
      <p className="text-center text-xs font-medium text-gray-700 dark:text-gray-300 leading-snug line-clamp-4">
        {name}
      </p>
    </div>
  );
}
