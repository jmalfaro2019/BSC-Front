import React, { useState } from "react";
import ActionCard from "../../components/Cards/ActionCard";
import actionsData from "../../data/actionsData.json";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon } from "../../icons";

// Internal component to manage each project section's expanded state
const ProjectSection = ({ project }: { project: any }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      {/* Collapsible Header */}
      <div
        className="flex items-start gap-2 border-b-2 border-primary/20 pb-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={`mt-1 shrink-0 transition-transform duration-300 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
            isExpanded ? "" : "-rotate-90"
          }`}
        >
          <ChevronDownIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-black dark:text-white select-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {project.name}
          </h3>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
            {project.perspective}
          </span>
        </div>
        {/* Action count badge */}
        <span className="ml-auto shrink-0 mt-0.5 inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          {project.actions.length} acción{project.actions.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* Cards grid (collapsible) */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? "opacity-100 max-h-[5000px] mt-1" : "opacity-0 max-h-0"
        }`}
      >
        <div className="flex flex-wrap gap-4">
          {project.actions.map((action: any, idx: number) => (
            <ActionCard
              key={idx}
              name={action.name}
              progress={action.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ActionsTab() {
  return (
    <>
      <PageMeta
        title="Acciones | Balanced Scorecard"
        description="Panel de control de acciones por proyecto"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Acciones por Proyecto
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {actionsData.projects.length} proyectos ·{" "}
            {actionsData.projects.reduce(
              (acc, p) => acc + p.actions.length,
              0
            )}{" "}
            acciones en total
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {actionsData.projects.map((project) => (
            <ProjectSection key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}
