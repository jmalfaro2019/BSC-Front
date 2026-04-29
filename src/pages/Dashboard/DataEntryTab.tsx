import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useBSCData } from "../../context/DataContext";
import { ChevronDownIcon, BoxCubeIcon } from "../../icons";

export default function DataEntryTab() {
  const { data, updateActivityProgress } = useBSCData();
  
  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter options based on selections
  const perspectiveOptions = data?.perspectives || [];
  const projectOptions = perspectiveOptions.find(p => p.id === selectedPerspective)?.projects || [];
  const activityOptions = projectOptions.find(p => p.id === selectedProject)?.activities || [];

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    setSelectedProject("");
    setSelectedActivity("");
  }, [selectedPerspective]);

  useEffect(() => {
    setSelectedActivity("");
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
    if (selectedPerspective && selectedProject && selectedActivity) {
      updateActivityProgress(selectedPerspective, selectedProject, selectedActivity, progressValue);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!data) {
    return <div className="p-8 text-center text-red-500">Error cargando datos</div>;
  }

  return (
    <>
      <PageMeta
        title="Ingreso de Datos | Balanced Scorecard"
        description="Formulario para actualizar el avance de actividades"
      />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-8">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Ingreso de Datos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualice el progreso de las actividades del Balanced Scorecard
          </p>
        </div>

        <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="p-6 md:p-8 space-y-6">
            {/* Perspective Select */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Línea Estratégica / Perspectiva
              </label>
              <div className="relative">
                <select
                  value={selectedPerspective}
                  onChange={(e) => setSelectedPerspective(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:text-white transition-all"
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

            {/* Project Select */}
            <div className={`space-y-2 transition-opacity duration-300 ${!selectedPerspective ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Proyecto
              </label>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:text-white transition-all"
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

            {/* Activity Select */}
            <div className={`space-y-2 transition-opacity duration-300 ${!selectedProject ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actividad
              </label>
              <div className="relative">
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:text-white transition-all"
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

            {/* Progress Slider */}
            <div className={`space-y-4 pt-4 transition-opacity duration-300 ${!selectedActivity ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Valor de Avance
                </label>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg">
                  {progressValue}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleUpdate}
                disabled={!selectedActivity}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 ${
                  !selectedActivity 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <BoxCubeIcon className="w-5 h-5" />
                Actualizar Avance
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="animate-fade-in bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  ¡Datos actualizados exitosamente en la sesión!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
