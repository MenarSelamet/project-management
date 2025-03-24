"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, Task, ViewMode } from "gantt-task-react";
import type { TaskType } from "gantt-task-react/dist/types/public-types";
import "gantt-task-react/dist/index.css";
import React, { useState, useMemo } from "react";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      console.log("Projects data:", projects);
      return [];
    }

    return projects
      .filter((project): project is typeof project & { startDate: string; endDate: string } => {
        if (!project?.startDate || !project?.endDate) {
          console.log("Filtered out project due to missing dates:", project);
          return false;
        }
        try {
          const start = new Date(project.startDate);
          const end = new Date(project.endDate);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.log("Invalid date format for project:", project);
            return false;
          }
          return true;
        } catch (error) {
          console.error("Error parsing dates for project:", project, error);
          return false;
        }
      })
      .map((project): Task => ({
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        name: project.name || "Untitled Project",
        id: `Project-${project.id}`,
        type: "project" as TaskType,
        progress: 50,
        isDisabled: false,
      }));
  }, [projects]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occurred while fetching projects</div>;
  if (!projects) return <div>No projects found</div>;
  if (ganttTasks.length === 0) return <div>No projects with valid dates found</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline dark:border-dark-secondary dark:bg-dark-secondary block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="dark:bg-dark-secondary overflow-hidden rounded-md bg-white shadow dark:text-white">
        <div className="timeline">
          {ganttTasks.length > 0 && (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
              listCellWidth="100px"
              projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;