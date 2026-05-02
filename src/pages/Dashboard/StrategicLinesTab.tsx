import StrategicCard from "../../components/Cards/StrategicCard";
import PageMeta from "../../components/common/PageMeta";
import { usePerspectives } from "../../hooks/usePerspectives";

export default function StrategicLinesTab() {
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

  const perspectives = data.perspectives.map((perspective) => {
    const totalWeightage = perspective.projects.reduce((acc, p) => acc + p.weightage, 0);
    const perspectiveProgress = perspective.projects.reduce((acc, project) => {
      const projectProgress = project.activities.length > 0
        ? project.activities.reduce((sum, act) => sum + act.progress, 0) / project.activities.length
        : 0;
      return acc + (projectProgress * (project.weightage / (totalWeightage || 1)));
    }, 0);

    return {
      id: perspective.id,
      name: perspective.name,
      objective: perspective.objective,
      weightage: perspective.weightage,
      progress: Math.round(perspectiveProgress),
      components: perspective.projects.map(p => ({
        name: p.name,
        progress: Math.round(p.activities.reduce((sum, act) => sum + act.progress, 0) / (p.activities.length || 1)),
      })),
    };
  });

  const total = perspectives.length;
  const complete = perspectives.filter((l) => l.progress === 100).length;
  const avgProgress = Math.round(perspectives.reduce((a, p) => a + p.progress, 0) / (total || 1));
  const totalProjects = data.perspectives.reduce((a, p) => a + p.projects.length, 0);

  const progressColor = (p: number) => {
    if (p >= 80) return "text-emerald-500";
    if (p >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <>
      <PageMeta
        title="Perspectivas | Balanced Scorecard"
        description="Panel principal de Perspectivas"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Perspectivas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Perspectivas del Balanced Scorecard
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Progreso General
            </p>
            <p className={`text-2xl font-bold tabular-nums tracking-tight ${progressColor(avgProgress)}`}>
              {avgProgress}%
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Perspectivas
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {total}
              <span className="text-sm font-medium text-gray-400 ml-1.5">total</span>
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Proyectos
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {totalProjects}
              <span className="text-sm font-medium text-gray-400 ml-1.5">total</span>
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Completadas
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {complete}/{total}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-2">
          {perspectives.map((line) => (
              <StrategicCard
                key={line.id}
                name={line.name}
                progress={line.progress}
                components={line.components}
                perspectiveId={line.id}
                weightage={line.weightage}
                objective={line.objective}
              />
            ))}
        </div>
      </div>
    </>
  );
}