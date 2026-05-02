import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import { ChevronDownIcon } from "../icons";
import { usePerspectives } from "../hooks/usePerspectives";
import type { Perspective, Project } from "../types/bsc";
import { getPerspectiveColors, getProgressColor } from "../utils/perspectiveColors";

function WeightBadge({ value, perspectiveId }: { value: number; perspectiveId: string }) {
  const pColors = getPerspectiveColors(perspectiveId);
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${pColors.badge}`}>
      {value}%
    </span>
  );
}

function Cell({ value }: { value: string }) {
  if (!value || value === "-") {
    return <span className="text-gray-300 dark:text-gray-600 italic">—</span>;
  }
  return <span>{value}</span>;
}

function ProjectSection({ project, perspectiveId }: { project: Project; perspectiveId: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group text-left"
      >
        <ChevronDownIcon
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1">
          {project.name}
        </span>
        <WeightBadge value={project.weightage} perspectiveId={perspectiveId} />
      </button>

      {open && (
        <div className="mt-2 overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/40 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <th className="text-left px-4 py-2.5 w-[40%]">Actividad</th>
                <th className="text-center px-3 py-2.5 w-[10%]">Pond.</th>
                <th className="text-center px-3 py-2.5 w-[10%]">Avance</th>
                <th className="text-left px-3 py-2.5 w-[20%]">Responsable</th>
                <th className="text-left px-3 py-2.5 w-[20%]">Cumplimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {project.activities.map((activity, idx) => {
                const progressColor = getProgressColor(activity.progress);
                return (
                  <tr
                    key={idx}
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium leading-snug">
                      {activity.name}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <WeightBadge value={activity.weightage} perspectiveId={perspectiveId} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${progressColor.badge}`}>
                        {activity.progress.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 leading-snug text-xs">
                      <Cell value={activity.responsibleProcess} />
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 leading-snug text-xs">
                      <Cell value={activity.complianceDate} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LineSection({ line }: { line: Perspective }) {
  const [open, setOpen] = useState(true);
  const pColors = getPerspectiveColors(line.id);
  const totalActivities = line.projects.reduce((a: number, p) => a + p.activities.length, 0);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
      <div className={`h-1 ${pColors.bar}`} />
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-5 py-4 ${pColors.accentBg} ${pColors.accentBgDark} hover:opacity-90 transition-opacity group text-left`}
      >
        <ChevronDownIcon
          className={`w-5 h-5 shrink-0 ${pColors.accentText} ${pColors.accentTextDark} transition-transform duration-300 ${open ? "" : "-rotate-90"}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold ${pColors.accentText} ${pColors.accentTextDark} leading-snug`}>
            {line.name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {line.projects.length} proyecto{line.projects.length !== 1 ? "s" : ""} · {totalActivities} actividades
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WeightBadge value={line.weightage} perspectiveId={line.id} />
        </div>
      </button>

      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 flex flex-col gap-1 pt-1">
            {line.projects.map((project) => (
              <ProjectSection key={project.id} project={project} perspectiveId={line.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeightingsPage() {
  const { data, isLoading, error } = usePerspectives();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-500">Error cargando datos</div>;
  }

  const totalActivities = data.perspectives.reduce(
    (a, l) => a + l.projects.reduce((b, p) => b + p.activities.length, 0),
    0
  );
  const totalProjects = data.perspectives.reduce(
    (a, l) => a + l.projects.length,
    0
  );

  return (
    <>
      <PageMeta
        title="Tabla de Ponderaciones | Balanced Scorecard"
        description="Ponderación jerárquica de perspectivas, proyectos y actividades"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tabla de Ponderaciones
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data.perspectives.length} perspectivas · {totalProjects} proyectos · {totalActivities} actividades
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {data.perspectives.map((line) => (
            <LineSection key={line.id} line={line} />
          ))}
        </div>
      </div>
    </>
  );
}