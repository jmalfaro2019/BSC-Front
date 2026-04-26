import React from "react";

interface ComponentItem {
  name: string;
  progress: number;
}

interface StrategicCardProps {
  name: string;
  progress: number;
  components: ComponentItem[];
}

function getProgressColors(progress: number) {
  if (progress === 100) {
    return {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      pct: "text-emerald-600 dark:text-emerald-400",
    };
  }
  return {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    pct: "text-amber-600 dark:text-amber-400",
  };
}

export default function StrategicCard({ name, progress, components }: StrategicCardProps) {
  const colors = getProgressColors(progress);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h3 className="text-xl font-bold text-black dark:text-white leading-snug">
          {name}
        </h3>
        <div className={`flex items-center justify-center rounded-full px-4 py-1.5 font-bold text-lg ${colors.badge}`}>
          {progress}%
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Componentes
        </h4>
        <ul className="space-y-3">
          {components.map((comp, idx) => {
            const c = getProgressColors(comp.progress);
            return (
              <li key={idx} className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-black dark:text-white leading-snug">
                    {comp.name}
                  </span>
                  <span className={`ml-3 shrink-0 text-xs font-bold ${c.pct}`}>
                    {comp.progress}%
                  </span>
                </div>
                <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                  <div
                    className={`${c.bar} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${comp.progress}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
