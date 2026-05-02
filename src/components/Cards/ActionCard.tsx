import { getPerspectiveColors, getProgressColor } from "../../utils/perspectiveColors";

interface ActionCardProps {
  name: string;
  progress: number;
  perspectiveId?: string;
}

export default function ActionCard({ name, progress, perspectiveId }: ActionCardProps) {
  const radius = 34;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / 100) * circumference;

  const pc = getProgressColor(progress);
  const pColors = perspectiveId ? getPerspectiveColors(perspectiveId) : null;

  const ringStroke = pColors
    ? `${pColors.ring} ${pColors.ringDark}`
    : "stroke-emerald-500 dark:stroke-emerald-400";

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 transition-shadow duration-300 hover:shadow-lg w-full max-w-[200px] shrink-0">
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="rotate-[-90deg]"
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-gray-100 dark:stroke-gray-800"
          />
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${ringStroke} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold tabular-nums ${pc.text}`}>
            {progress}%
          </span>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug line-clamp-3">
        {name}
      </p>
    </div>
  );
}