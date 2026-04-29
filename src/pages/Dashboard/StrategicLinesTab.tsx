import React from "react";
import StrategicCard from "../../components/Cards/StrategicCard";
import PageMeta from "../../components/common/PageMeta";
import { useBSCData } from "../../context/DataContext";

export default function StrategicLinesTab() {
  const { data } = useBSCData();

  if (!data) {
    return <div className="p-8 text-center text-red-500">Error cargando datos</div>;
  }

  const perspectives = data.perspectives.map((perspective) => {
    // Calculate total progress for this perspective
    // Each project has a weightage within the perspective.
    // However, in our simplified view, we can just show the average or the sum of weighted progress.
    // If project.weightage is % of perspective, then:
    const totalWeightage = perspective.projects.reduce((acc, p) => acc + p.weightage, 0);
    const perspectiveProgress = perspective.projects.reduce((acc, project) => {
      // Each project progress is average of activities
      const projectProgress = project.activities.length > 0
        ? project.activities.reduce((sum, act) => sum + act.progress, 0) / project.activities.length
        : 0;
      return acc + (projectProgress * (project.weightage / (totalWeightage || 1)));
    }, 0);

    return {
      id: perspective.id,
      name: perspective.name,
      progress: Math.round(perspectiveProgress),
      components: perspective.projects.map(p => ({
        name: p.name,
        progress: Math.round(p.activities.reduce((sum, act) => sum + act.progress, 0) / (p.activities.length || 1))
      }))
    };
  });

  const total = perspectives.length;
  const complete = perspectives.filter((l) => l.progress === 100).length;

  return (
    <>
      <PageMeta
        title="Líneas Estratégicas | Balanced Scorecard"
        description="Panel principal de Líneas Estratégicas"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Líneas Estratégicas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {complete} de {total} líneas al 100%
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
          {perspectives.map((line) => (
            <StrategicCard
              key={line.id}
              name={line.name}
              progress={line.progress}
              components={line.components}
            />
          ))}
        </div>
      </div>
    </>
  );
}
