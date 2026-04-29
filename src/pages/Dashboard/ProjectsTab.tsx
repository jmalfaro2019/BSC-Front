import { useState } from "react";
import ComponentProjectsCard from "../../components/Cards/ComponentProjectsCard";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon } from "../../icons";
import { useBSCData, type Perspective } from "../../context/DataContext";

// Internal component to manage each perspective's expanded state
const PerspectiveSection = ({ perspective }: { perspective: Perspective }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalProjects = perspective.projects.reduce(
    (acc: number, p) => acc + p.activities.length,
    0
  );

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      {/* Collapsible header */}
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
        <h3 className="text-xl font-bold text-black dark:text-white select-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {perspective.name}
        </h3>
        {/* Badge */}
        <span className="ml-auto shrink-0 mt-0.5 inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          {perspective.projects.length} proyecto{perspective.projects.length !== 1 ? "s" : ""} · {totalProjects} actividad{totalProjects !== 1 ? "es" : ""}
        </span>
      </div>

      {/* Cards (collapsible) */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? "opacity-100 max-h-[5000px] mt-2" : "opacity-0 max-h-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 items-stretch">
          {perspective.projects.map((project, idx) => (
            <div key={idx} className="w-fit max-w-full">
              <ComponentProjectsCard
                name={project.name}
                projects={project.activities}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProjectsTab() {
  const { data } = useBSCData();

  if (!data) {
    return <div className="p-8 text-center text-red-500">Error cargando datos</div>;
  }

  const totalProjects = data.perspectives.reduce(
    (acc, p) => acc + p.projects.reduce((a, proj) => a + proj.activities.length, 0),
    0
  );

  return (
    <>
      <PageMeta
        title="Proyectos | Balanced Scorecard"
        description="Panel de control de proyectos por líneas estratégicas"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Proyectos por Línea Estratégica
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.perspectives.length} perspectivas · {totalProjects} actividades en total
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {data.perspectives.map((perspective) => (
            <PerspectiveSection key={perspective.id} perspective={perspective} />
          ))}
        </div>
      </div>
    </>
  );
}
