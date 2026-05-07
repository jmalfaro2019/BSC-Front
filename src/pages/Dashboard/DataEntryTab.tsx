import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import { ChevronDownIcon, BoxCubeIcon } from "../../icons";
import { usePerspectives } from "../../hooks/usePerspectives";
import { useUpdateProgress } from "../../hooks/useUpdateProgress";
import { useBatchUpdateProgress } from "../../hooks/useBatchUpdateProgress";
import { getPerspectiveColors } from "../../utils/perspectiveColors";

interface CsvRow {
  perspective: string;
  project: string;
  activity: string;
  progress: number;
}

interface PreviewRow {
  perspective: string;
  project: string;
  activity: string;
  currentProgress: number;
  newProgress: number;
  activityId: string;
  error?: string;
}

function csvEscape(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function parseCSVLine(line: string): string[] {
  const cols: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cols.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  cols.push(current);
  return cols.map((c) => c.trim());
}

function parseCSV(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const pIdx = header.indexOf("perspectiva");
  const prIdx = header.indexOf("proyecto");
  const aIdx = header.indexOf("actividad");
  const vIdx = header.indexOf("avance");
  if (pIdx === -1 || prIdx === -1 || aIdx === -1 || vIdx === -1) return [];
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length <= Math.max(pIdx, prIdx, aIdx, vIdx)) continue;
    const progress = parseFloat(cols[vIdx]);
    if (isNaN(progress)) continue;
    rows.push({
      perspective: cols[pIdx],
      project: cols[prIdx],
      activity: cols[aIdx],
      progress: Math.min(100, Math.max(0, progress)),
    });
  }
  return rows;
}

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function DataEntryTab() {
  const { data, isLoading, error } = usePerspectives();
  const updateProgress = useUpdateProgress();
  const batchUpdate = useBatchUpdateProgress();

  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [csvPreview, setCsvPreview] = useState<PreviewRow[] | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const perspectiveOptions = useMemo(() => data?.perspectives ?? [], [data?.perspectives]);
  const projectOptions = useMemo(
    () => perspectiveOptions.find((p) => p.id === selectedPerspective)?.projects ?? [],
    [perspectiveOptions, selectedPerspective],
  );
  const activityOptions = useMemo(
    () => projectOptions.find((p) => p.id === selectedProject)?.activities ?? [],
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
      const currentActivity = activityOptions.find((a) => a.id === selectedActivity);
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
    updateProgress.mutate(
      {
        perspectiveId: selectedPerspective,
        projectId: selectedProject,
        activityId: selectedActivity,
        progress: progressValue,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      },
    );
  };

  const handleDownloadTemplate = useCallback(() => {
    if (!data) return;
    const rows: string[] = ["perspectiva,proyecto,actividad,avance"];
    for (const perspective of data.perspectives) {
      for (const project of perspective.projects) {
        for (const activity of project.activities) {
          rows.push(
            `${csvEscape(perspective.name)},${csvEscape(project.name)},${csvEscape(activity.name)},${activity.progress}`,
          );
        }
      }
    }
    const csv = rows.join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_bsc.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const MAX_CSV_SIZE = 1024 * 1024;

  const BLOCKED_MIME_TYPES: Set<string> = new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  ]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCsvError(null);
      setCsvSuccess(false);
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".csv")) {
        setCsvError("El archivo debe ser formato CSV (no Excel ni otros formatos)");
        return;
      }

      if (BLOCKED_MIME_TYPES.has(file.type)) {
        setCsvError("El archivo parece ser un archivo de Excel. Por favor expórtelo como CSV e intente nuevamente");
        return;
      }

      if (file.size > MAX_CSV_SIZE) {
        setCsvError("El archivo es demasiado grande (máximo 1 MB)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;

        if (text.includes("\0")) {
          setCsvError("El archivo parece ser binario (posiblemente Excel). Por favor expórtelo como CSV e intente nuevamente");
          return;
        }

        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setCsvError(
            'No se pudieron leer filas del CSV. Asegúrese de que las columnas sean: perspectiva, proyecto, actividad, avance',
          );
          return;
        }
        const preview: PreviewRow[] = [];
        for (const row of parsed) {
          const foundPerspective = data?.perspectives.find(
            (p) => normalize(p.name) === normalize(row.perspective),
          );
          if (!foundPerspective) {
            preview.push({
              perspective: row.perspective,
              project: row.project,
              activity: row.activity,
              currentProgress: 0,
              newProgress: row.progress,
              activityId: "",
              error: `Perspectiva "${row.perspective}" no encontrada`,
            });
            continue;
          }
          const foundProject = foundPerspective.projects.find(
            (pr) => normalize(pr.name) === normalize(row.project),
          );
          if (!foundProject) {
            preview.push({
              perspective: row.perspective,
              project: row.project,
              activity: row.activity,
              currentProgress: 0,
              newProgress: row.progress,
              activityId: "",
              error: `Proyecto "${row.project}" no encontrado en "${foundPerspective.name}"`,
            });
            continue;
          }
          const foundActivity = foundProject.activities.find(
            (a) => normalize(a.name) === normalize(row.activity),
          );
          if (!foundActivity) {
            preview.push({
              perspective: row.perspective,
              project: row.project,
              activity: row.activity,
              currentProgress: 0,
              newProgress: row.progress,
              activityId: "",
              error: `Actividad "${row.activity}" no encontrada en "${foundProject.name}"`,
            });
            continue;
          }
          preview.push({
            perspective: foundPerspective.name,
            project: foundProject.name,
            activity: foundActivity.name,
            currentProgress: foundActivity.progress,
            newProgress: row.progress,
            activityId: foundActivity.id,
          });
        }
        setCsvPreview(preview);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [data],
  );

  const handleApplyBatch = () => {
    if (!csvPreview) return;
    const validRows = csvPreview.filter((r) => !r.error);
    if (validRows.length === 0) return;
    batchUpdate.mutate(
      validRows.map((r) => ({ activityId: r.activityId, progress: r.newProgress })),
      {
        onSuccess: () => {
          setCsvSuccess(true);
          setCsvPreview(null);
          setTimeout(() => setCsvSuccess(false), 3000);
        },
      },
    );
  };

  const handleCancelCsv = () => {
    setCsvPreview(null);
    setCsvError(null);
    setCsvSuccess(false);
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

  const activePerspective = data.perspectives.find((p) => p.id === selectedPerspective);
  const pColors = activePerspective ? getPerspectiveColors(selectedPerspective) : null;

  const selectClasses =
    "w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all";

  const hasCsvErrors = csvPreview ? csvPreview.some((r) => r.error) : false;

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
            {pColors && <div className={`h-1.5 w-full ${pColors.bar}`} />}
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
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div
                className={`space-y-1.5 transition-all duration-300 ${
                  !selectedPerspective ? "opacity-40 pointer-events-none" : "opacity-100"
                }`}
              >
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
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div
                className={`space-y-1.5 transition-all duration-300 ${
                  !selectedProject ? "opacity-40 pointer-events-none" : "opacity-100"
                }`}
              >
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
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div
                className={`space-y-3 pt-2 transition-all duration-300 ${
                  !selectedActivity ? "opacity-40 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Valor de Avance
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val)) setProgressValue(0);
                      else setProgressValue(Math.min(100, Math.max(0, val)));
                    }}
                    className={`w-20 text-center text-lg font-bold tabular-nums rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      progressValue >= 80
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30"
                        : progressValue >= 50
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30"
                    }`}
                  />
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

        <div className="max-w-4xl mt-8">
          <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-blue-light-500 via-violet-500 to-warning-500" />
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Actualización por CSV
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Descargue la plantilla, modifique los avances y súbala para actualizar múltiples actividades
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar plantilla
                </button>
                <label className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Cargar CSV
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {csvError && (
                <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">{csvError}</p>
                </div>
              )}

              {csvSuccess && (
                <div className="animate-fade-in rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Datos del CSV actualizados exitosamente
                  </p>
                </div>
              )}

              {batchUpdate.isError && (
                <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error al aplicar los cambios. Intente nuevamente.
                  </p>
                </div>
              )}

              {csvPreview && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Perspectiva
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Proyecto
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Actividad
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Avance actual
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Nuevo avance
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {csvPreview.map((row, i) => (
                          <tr
                            key={i}
                            className={
                              row.error
                                ? "bg-red-50/50 dark:bg-red-500/5"
                                : "bg-white dark:bg-gray-900"
                            }
                          >
                            <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100">
                              {row.perspective}
                            </td>
                            <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100">
                              {row.project}
                            </td>
                            <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100">
                              {row.activity}
                            </td>
                            <td className="px-4 py-2.5 text-center tabular-nums text-gray-600 dark:text-gray-400">
                              {row.error ? "—" : `${row.currentProgress}%`}
                            </td>
                            <td
                              className={`px-4 py-2.5 text-center tabular-nums font-semibold ${
                                row.error
                                  ? "text-gray-400"
                                  : row.newProgress >= 80
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : row.newProgress >= 50
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {row.newProgress}%
                            </td>
                            <td className="px-4 py-2.5">
                              {row.error ? (
                                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                  {row.error}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Válido
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleApplyBatch}
                      disabled={hasCsvErrors || batchUpdate.isPending}
                      className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 ${
                        hasCsvErrors || batchUpdate.isPending
                          ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-brand-500 hover:bg-brand-600 active:scale-[0.98]"
                      }`}
                    >
                      {batchUpdate.isPending ? "Aplicando..." : "Aplicar cambios"}
                    </button>
                    <button
                      onClick={handleCancelCsv}
                      className="rounded-xl px-6 py-3 font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}