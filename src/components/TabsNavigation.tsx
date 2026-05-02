

export default function TabsNavigation() {
  return (
    <div className="mb-6 rounded-lg bg-white p-3 shadow-default dark:bg-boxdark">
      <nav className="flex flex-wrap gap-4 border-b border-stroke pb-3 dark:border-strokedark">
        <button
          className="border-b-2 border-primary py-2 px-4 text-sm font-medium text-primary hover:text-primary"
        >
          Perspectivas
        </button>
        <button
          className="border-b-2 border-transparent py-2 px-4 text-sm font-medium text-body hover:text-primary dark:text-bodydark disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          Dashboard Operativo
        </button>
        <button
          className="border-b-2 border-transparent py-2 px-4 text-sm font-medium text-body hover:text-primary dark:text-bodydark disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          Reportes
        </button>
      </nav>
    </div>
  );
}
