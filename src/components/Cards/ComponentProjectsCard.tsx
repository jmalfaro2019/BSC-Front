import { getPerspectiveColors, getProgressColor } from "../../utils/perspectiveColors";

interface ProjectItem {
  name: string;
  progress: number;
}

interface ComponentProjectsCardProps {
  name: string;
  projects: ProjectItem[];
  perspectiveId?: string;
}

export default function ComponentProjectsCard({ name, projects, perspectiveId }: ComponentProjectsCardProps) {
  const pColors = perspectiveId ? getPerspectiveColors(perspectiveId) : null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 flex flex-col transition-shadow duration-300 hover:shadow-lg min-w-[320px]">
      {pColors && (
        <div className={`h-1 w-full ${pColors.bar}`} />
      )}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-4">
          {name}
        </h4>

        <div className="flex-1 flex flex-col gap-2.5">
          {projects.map((proj, idx) => {
            const c = getProgressColor(proj.progress);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 group"
                title={`${proj.name}: ${proj.progress}%`}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-snug min-w-0 flex-1 line-clamp-2">
                  {proj.name}
                </span>
                <div className="w-28 shrink-0 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`${c.bar} h-1.5 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
                <span className={`shrink-0 w-10 text-right text-sm font-semibold tabular-nums ${c.text}`}>
                  {proj.progress}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}