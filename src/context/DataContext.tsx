"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";
import bscData from "../data/bscData.json";

export interface Activity {
  id: string;
  name: string;
  weightage: number;
  progress: number;
  responsibleProcess: string;
  complianceDate: string;
  realizedActivities: string;
}

export interface Project {
  id: string;
  name: string;
  weightage: number;
  strategy: string;
  detail: string;
  activities: Activity[];
}

export interface Perspective {
  id: string;
  name: string;
  objective: string;
  weightage: number;
  projects: Project[];
}

export interface BSCData {
  perspectives: Perspective[];
}

interface DataContextType {
  data: BSCData | null;
  error: string | null;
  updateActivityProgress: (perspectiveId: string, projectId: string, activityId: string, newProgress: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<BSCData | null>(bscData as BSCData);
  const [error] = useState<string | null>(null);

  const updateActivityProgress = (perspectiveId: string, projectId: string, activityId: string, newProgress: number) => {
    if (!data) return;

    const newData = { ...data };
    const perspective = newData.perspectives.find(p => p.id === perspectiveId);
    if (perspective) {
      const project = perspective.projects.find(p => p.id === projectId);
      if (project) {
        const activity = project.activities.find(a => a.id === activityId);
        if (activity) {
          activity.progress = newProgress;
          setData(newData);
        }
      }
    }
  };

  return (
    <DataContext.Provider value={{ data, error, updateActivityProgress }}>
      {children}
    </DataContext.Provider>
  );
};

export const useBSCData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useBSCData must be used within a DataProvider");
  }
  return context;
};
