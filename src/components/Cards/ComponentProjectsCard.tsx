import React from "react";

interface ProjectItem {
  name: string;
  progress: number;
}

interface ComponentProjectsCardProps {
  name: string;
  projects: ProjectItem[];
}

function getBarColors(progress: number) {
  if (progress === 100) {
    return {
      bar: "bg-emerald-500",
      pct: "text-emerald-600 dark:text-emerald-400",
    };
  }
  return {
    bar: "bg-amber-500",
    pct: "text-amber-600 dark:text-amber-400",
  };
}

export default function ComponentProjectsCard({ name, projects }: ComponentProjectsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Card header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
        <h4 className="text-base font-bold text-black dark:text-white leading-snug">
          {name}
        </h4>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {/* Vertical bar chart */}
        <div className="flex items-start justify-start gap-10 w-full mt-auto overflow-x-auto no-scrollbar pb-2 pt-6">
          {projects.map((proj, idx) => {
            const c = getBarColors(proj.progress);
            return (
              <div
                key={idx}
                className="flex flex-col items-center w-[72px] shrink-0 group relative"
                title={`${proj.name}: ${proj.progress}%`}
              >
                {/* Bar track */}
                <div className="w-10 bg-transparent rounded-t-md h-32 flex flex-col justify-end relative mt-2">
                  {/* Filled bar */}
                  <div
                    className={`w-full ${c.bar} rounded-t-md transition-all duration-500 ease-out relative`}
                    style={{ height: `${proj.progress}%` }}
                  >
                    {/* Percentage anchored to top of bar */}
                    <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold ${c.pct}`}>
                      {proj.progress}%
                    </span>
                  </div>
                </div>

                {/* Label */}
                <span className="text-xs text-center mt-2 text-gray-600 dark:text-gray-300 font-medium leading-tight w-full break-normal">
                  {proj.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
