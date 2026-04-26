import React, { useState } from "react";
import weightingsData from "../data/weightingsData.json";
import PageMeta from "../components/common/PageMeta";
import { ChevronDownIcon } from "../icons";

// ─── Color palette for strategic lines ──────────────────────────────────────
const LINE_COLORS = [
  { border: "border-l-blue-500",     bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400",    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  { border: "border-l-violet-500",   bg: "bg-violet-500/10",  text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  { border: "border-l-emerald-500",  bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400",badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { border: "border-l-teal-500",     bg: "bg-teal-500/10",    text: "text-teal-600 dark:text-teal-400",    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  { border: "border-l-indigo-500",   bg: "bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  { border: "border-l-cyan-500",     bg: "bg-cyan-500/10",    text: "text-cyan-600 dark:text-cyan-400",    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
  { border: "border-l-orange-500",   bg: "bg-orange-500/10",  text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  { border: "border-l-rose-500",     bg: "bg-rose-500/10",    text: "text-rose-600 dark:text-rose-400",    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  { border: "border-l-amber-500",    bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",  badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { border: "border-l-green-500",    bg: "bg-green-500/10",   text: "text-green-600 dark:text-green-400",  badge: "bg-green-500/15 text-green-700 dark:text-green-300" },
];

// ─── Weight badge ────────────────────────────────────────────────────────────
function WeightBadge({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${colorClass}`}>
      {value}%
    </span>
  );
}

// ─── Cell value helper (renders "-" as muted) ────────────────────────────────
function Cell({ value }: { value: string }) {
  if (!value || value === "-") {
    return <span className="text-gray-400 dark:text-gray-600 italic text-xs">—</span>;
  }
  return <span>{value}</span>;
}

// ─── Project sub-section ─────────────────────────────────────────────────────
function ProjectSection({ project, color }: { project: any; color: typeof LINE_COLORS[0] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-2">
      {/* Project header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group text-left"
      >
        <ChevronDownIcon
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1">
          {project.name}
        </span>
        <WeightBadge value={project.weight} colorClass={color.badge} />
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">vs. línea</span>
      </button>

      {/* Actions table */}
      {open && (
        <div className="mt-1 overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <th className="text-left px-4 py-2 w-[30%]">Acción</th>
                <th className="text-center px-3 py-2 w-[6%]">Pond.</th>
                <th className="text-left px-3 py-2 w-[22%]">Criterio / Detalle</th>
                <th className="text-left px-3 py-2 w-[22%]">Indicadores</th>
                <th className="text-left px-3 py-2 w-[20%]">Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {project.actions.map((action: any, idx: number) => (
                <tr
                  key={idx}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium leading-snug">
                    {action.name}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <WeightBadge value={action.weight} colorClass={color.badge} />
                  </td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-400 leading-snug">
                    <Cell value={action.criterion} />
                  </td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-400 leading-snug">
                    <Cell value={action.indicator} />
                  </td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-400 leading-snug">
                    <Cell value={action.goal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Strategic line section ──────────────────────────────────────────────────
function LineSection({ line, colorIdx }: { line: any; colorIdx: number }) {
  const [open, setOpen] = useState(true);
  const color = LINE_COLORS[colorIdx % LINE_COLORS.length];
  const totalActions = line.projects.reduce((a: number, p: any) => a + p.actions.length, 0);

  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-700 border-l-4 ${color.border} bg-white dark:bg-gray-900 shadow-sm overflow-hidden`}>
      {/* Line header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-5 py-4 ${color.bg} hover:opacity-90 transition-opacity group text-left`}
      >
        <ChevronDownIcon
          className={`w-5 h-5 shrink-0 ${color.text} transition-transform duration-300 ${open ? "" : "-rotate-90"}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold ${color.text} leading-snug`}>
            {line.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {line.projects.length} proyecto{line.projects.length !== 1 ? "s" : ""} · {totalActions} acciones
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WeightBadge value={line.weight} colorClass={color.badge} />
          <span className="text-xs text-gray-400 dark:text-gray-500">del BSC total</span>
        </div>
      </button>

      {/* Projects */}
      <div className={`transition-all duration-500 overflow-hidden ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 flex flex-col gap-2 pt-2">
          {line.projects.map((project: any) => (
            <ProjectSection key={project.id} project={project} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function WeightingsPage() {
  const totalActions = weightingsData.strategicLines.reduce(
    (a, l) => a + l.projects.reduce((b, p) => b + p.actions.length, 0),
    0
  );
  const totalProjects = weightingsData.strategicLines.reduce(
    (a, l) => a + l.projects.length,
    0
  );

  return (
    <>
      <PageMeta
        title="Tabla de Ponderaciones | Balanced Scorecard"
        description="Ponderación jerárquica de líneas estratégicas, proyectos y acciones"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              Tabla de Ponderaciones
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Jerarquía: Línea Estratégica → Proyecto → Acción
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {weightingsData.strategicLines.length} líneas · {totalProjects} proyectos · {totalActions} acciones
          </p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 opacity-70" />
            Ponderación de línea = % sobre el BSC total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-400 opacity-70" />
            Ponderación de proyecto = % dentro de su línea
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-300 opacity-70" />
            Ponderación de acción = % dentro de su proyecto
          </span>
        </div>

        {/* Strategic lines */}
        <div className="flex flex-col gap-5">
          {weightingsData.strategicLines.map((line, idx) => (
            <LineSection key={line.id} line={line} colorIdx={idx} />
          ))}
        </div>
      </div>
    </>
  );
}
