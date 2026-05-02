import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import ComponentProjectsCard from "../../components/Cards/ComponentProjectsCard";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon } from "../../icons";
import { usePerspectives } from "../../hooks/usePerspectives";
import type { Perspective } from "../../types/bsc";
import { getPerspectiveColors } from "../../utils/perspectiveColors";

const PerspectiveSection = ({ perspective, defaultExpanded = true }: { perspective: Perspective; defaultExpanded?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pColors = getPerspectiveColors(perspective.id);

  const totalActivities = perspective.projects.reduce(
    (acc: number, p) => acc + p.activities.length,
    0
  );

  useEffect(() => {
    if (defaultExpanded && sectionRef.current) {
      const timeout = setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [defaultExpanded]);

  return (
    <div ref={sectionRef} id={`perspective-${perspective.id}`} className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
      <div className={`h-1 ${pColors.bar}`} />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className={`mt-0.5 shrink-0 transition-transform duration-300 ${pColors.accentText} ${pColors.accentTextDark} ${isExpanded ? "" : "-rotate-90"}`}>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold ${pColors.accentText} ${pColors.accentTextDark} leading-snug`}>
            {perspective.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {perspective.projects.length} proyecto{perspective.projects.length !== 1 ? "s" : ""} · {totalActivities} actividad{totalActivities !== 1 ? "es" : ""}
          </p>
        </div>
        <span className={`shrink-0 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${pColors.badge}`}>
          {perspective.weightage}% del BSC
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {perspective.projects.map((project) => (
              <Link
                key={project.id}
                to={`/acciones?expand=${project.id}`}
                className="block transition-shadow duration-200 hover:shadow-md rounded-xl"
              >
                <ComponentProjectsCard
                  name={project.name}
                  projects={project.activities}
                  perspectiveId={perspective.id}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsTab() {
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

  const totalActivities = data.perspectives.reduce(
    (acc, p) => acc + p.projects.reduce((a, proj) => a + proj.activities.length, 0),
    0
  );

  return (
    <>
      <PageMeta
        title="Proyectos | Balanced Scorecard"
        description="Panel de control de proyectos por perspectivas"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Proyectos por Perspectiva
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data.perspectives.length} perspectivas · {totalActivities} actividades en total
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {data.perspectives.map((perspective) => (
            <PerspectiveSection
              key={perspective.id}
              perspective={perspective}
              defaultExpanded={!expandId || perspective.id === expandId}
            />
          ))}
        </div>
      </div>
    </>
  );
}