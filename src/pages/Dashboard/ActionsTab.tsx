import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import ActionCard from "../../components/Cards/ActionCard";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon } from "../../icons";
import { usePerspectives } from "../../hooks/usePerspectives";
import type { Project } from "../../types/bsc";
import { getPerspectiveColors } from "../../utils/perspectiveColors";

const ProjectSection = ({
  project,
  perspectiveId,
  perspectiveName,
  defaultExpanded = true,
}: {
  project: Project;
  perspectiveId: string;
  perspectiveName: string;
  defaultExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pColors = getPerspectiveColors(perspectiveId);

  useEffect(() => {
    if (defaultExpanded && sectionRef.current) {
      const timeout = setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [defaultExpanded]);

  return (
    <div ref={sectionRef} id={`project-${project.id}`} className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
      <div className={`h-1 ${pColors.bar}`} />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className={`shrink-0 transition-transform duration-300 ${pColors.accentText} ${pColors.accentTextDark} ${isExpanded ? "" : "-rotate-90"}`}>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold ${pColors.accentText} ${pColors.accentTextDark} leading-snug`}>
            {project.name}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {perspectiveName}
          </span>
        </div>
        <span className={`shrink-0 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${pColors.badge}`}>
          {project.activities.length} actividad{project.activities.length !== 1 ? "es" : ""}
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 flex flex-wrap gap-4">
            {project.activities.map((activity, idx) => (
              <ActionCard
                key={idx}
                name={activity.name}
                progress={activity.progress}
                perspectiveId={perspectiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ActionsTab() {
  const { data, isLoading, error } = usePerspectives();
  const [searchParams] = useSearchParams();
  const expandId = searchParams.get("expand");

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

  const allProjects = data.perspectives.flatMap((perspective) =>
    perspective.projects.map((project) => ({
      project,
      perspectiveId: perspective.id,
      perspectiveName: perspective.name,
    }))
  );

  const totalActivities = data.perspectives.reduce(
    (acc, p) => acc + p.projects.reduce((a, proj) => a + proj.activities.length, 0),
    0
  );

  return (
    <>
      <PageMeta
        title="Actividades | Balanced Scorecard"
        description="Panel de control de actividades por proyecto"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Actividades por Proyecto
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {allProjects.length} proyectos · {totalActivities} actividades en total
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {allProjects.map(({ project, perspectiveId, perspectiveName }) => (
            <ProjectSection
              key={project.id}
              project={project}
              perspectiveId={perspectiveId}
              perspectiveName={perspectiveName}
              defaultExpanded={!expandId || project.id === expandId}
            />
          ))}
        </div>
      </div>
    </>
  );
}