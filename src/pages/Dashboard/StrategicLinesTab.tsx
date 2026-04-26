import React from "react";
import StrategicCard from "../../components/Cards/StrategicCard";
import mockData from "../../data/mockData.json";
import PageMeta from "../../components/common/PageMeta";

export default function StrategicLinesTab() {
  const total = mockData.strategicLines.length;
  const complete = mockData.strategicLines.filter((l) => l.progress === 100).length;

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
          {mockData.strategicLines.map((line) => (
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
