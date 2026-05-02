import { Link } from "react-router";
import { getPerspectiveColors, getProgressColor } from "../../utils/perspectiveColors";

interface ComponentItem {
  name: string;
  progress: number;
}

interface StrategicCardProps {
  name: string;
  progress: number;
  components: ComponentItem[];
  perspectiveId: string;
  weightage: number;
  objective?: string;
}

export default function StrategicCard({
  name,
  progress,
  components,
  perspectiveId,
  weightage,
  objective,
}: StrategicCardProps) {
  const pColors = getPerspectiveColors(perspectiveId);
  const pProgress = getProgressColor(progress);

  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 flex flex-col h-full transition-shadow duration-300 hover:shadow-lg">
      <div className={`h-1.5 w-full ${pColors.bar}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${pColors.accentBg} ${pColors.accentBgDark} ${pColors.accentText} ${pColors.accentTextDark}`}>
                {weightage}% del BSC
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug truncate">
              {name}
            </h3>
            {objective && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                {objective}
              </p>
            )}
          </div>
          <div className={`shrink-0 flex items-center justify-center rounded-lg px-3 py-1.5 ${pProgress.bg} ${pProgress.text}`}>
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {progress}
            </span>
            <span className="text-xs font-semibold ml-0.5 opacity-70">%</span>
          </div>
        </div>

        <div className="flex-1 mt-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Proyectos
          </p>
          <ul className="space-y-2">
            {components.map((comp, idx) => {
              const c = getProgressColor(comp.progress);
              return (
                <li key={idx}>
                  <Link
                    to={`/proyectos?expand=${perspectiveId}`}
                    className="group/item block rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-1 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 truncate mr-2 transition-colors">
                        {comp.name}
                      </span>
                      <span className={`shrink-0 text-xs font-semibold tabular-nums ${c.text}`}>
                        {comp.progress}%
                      </span>
                    </div>
                    <div className="w-full rounded-full bg-gray-100 dark:bg-gray-800 h-1.5">
                      <div
                        className={`${c.bar} h-1.5 rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${comp.progress}%` }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}