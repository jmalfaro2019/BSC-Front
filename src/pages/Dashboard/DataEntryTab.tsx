import { useState, useEffect, useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon, BoxCubeIcon } from "../../icons";
import { usePerspectives } from "../../hooks/usePerspectives";
import { useUpdateProgress } from "../../hooks/useUpdateProgress";
import { getPerspectiveColors } from "../../utils/perspectiveColors";

export default function DataEntryTab() {
  const { data, isLoading, error } = usePerspectives();
  const updateProgress = useUpdateProgress();

  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const perspectiveOptions = useMemo(() => data?.perspectives ?? [], [data?.perspectives]);
  const projectOptions = useMemo(
    () => perspectiveOptions.find(p => p.id === selectedPerspective)?.projects ?? [],
    [perspectiveOptions, selectedPerspective],
  );
  const activityOptions = useMemo(
    () => projectOptions.find(p => p.id === selectedProject)?.activities ?? [],
    [projectOptions, selectedProject],
  );

  useEffect(() => {
    setSelectedProject("");
    setSelectedActivity("");
    setValidationErrors([]);
  }, [selectedPerspective]);

  useEffect(() => {
    setSelectedActivity("");
    setValidationErrors([]);
  }, [selectedProject]);

  useEffect(() => {
    if (selectedActivity) {
      const currentActivity = activityOptions.find(a => a.id === selectedActivity);
      if (currentActivity) {
        setProgressValue(currentActivity.progress);
      }
    }
  }, [selectedActivity, activityOptions]);

  const handleUpdate = () => {
    const errors: string[] = [];
    if (!selectedPerspective) errors.push("Seleccione una perspectiva");
    if (!selectedProject) errors.push("Seleccione un proyecto");
    if (!selectedActivity) errors.push("Seleccione una actividad");
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    updateProgress.mutate({
      perspectiveId: selectedPerspective,
      projectId: selectedProject,
      activityId: selectedActivity,
      progress: progressValue,
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

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

  const activePerspective = data.perspectives.find(p => p.id === selectedPerspective);
  const pColors = activePerspective ? getPerspectiveColors(selectedPerspective) : null;

  const selectClasses = "w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all";

  return (
    <>
      <PageMeta
        title="Ingreso de Datos | Balanced Scorecard"
        description="Formulario para actualizar el avance de actividades"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Ingreso de Datos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualice el progreso de las actividades del Balanced Scorecard
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
            {pColors && (
              <div className={`h-1.5 w-full ${pColors.bar}`} />
            )}
            {!pColors && (
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-blue-light-500 via-violet-500 to-warning-500" />
            )}

            <div className="p-6 md:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Perspectiva
                </label>
                <div className="relative">
                  <select
                    value={selectedPerspective}
                    onChange={(e) => setSelectedPerspective(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">Seleccione una perspectiva...</option>
                    {perspectiveOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 transition-all duration-300 ${!selectedPerspective ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Proyecto
                </label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">Seleccione un proyecto...</option>
                    {projectOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className={`space-y-1.5 transition-all duration-300 ${!selectedProject ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actividad
                </label>
                <div className="relative">
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">Seleccione una actividad...</option>
                    {activityOptions.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className={`space-y-3 pt-2 transition-all duration-300 ${!selectedActivity ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Valor de Avance
                  </label>
                  <span className={`text-lg font-bold tabular-nums px-3 py-1 rounded-lg ${
                    progressValue >= 80
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : progressValue >= 50
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {progressValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-gray-400 uppercase font-bold tracking-widest px-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={!selectedPerspective || updateProgress.isPending}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition-all duration-200 ${
                    !selectedPerspective || updateProgress.isPending
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-brand-500 hover:bg-brand-600 active:scale-[0.98]"
                  }`}
                >
                  <BoxCubeIcon className="w-4 h-4" />
                  {updateProgress.isPending ? "Guardando..." : "Actualizar Avance"}
                </button>
              </div>

              {validationErrors.length > 0 && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-4 flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Complete los campos obligatorios:
                    </p>
                    <ul className="mt-1 list-disc list-inside text-sm text-amber-700 dark:text-amber-400">
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {updateProgress.isError && (
                <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error al guardar los datos. Intente nuevamente.
                  </p>
                </div>
              )}

              {showSuccess && (
                <div className="animate-fade-in rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Datos actualizados exitosamente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}