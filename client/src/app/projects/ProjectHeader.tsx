import React from "react";
import Header from "@/components/Header";
import {
  Clock,
  Grid3X3,
  List,
  Table,
  Plus,
} from "lucide-react";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  projectName?: string;
  onAddTask: () => void;
};

const ProjectHeader = ({ activeTab, setActiveTab, projectName = "Project Management", onAddTask }: Props) => {
  return (
    <div className="px-4 xl:px-6">
      <div className="pt-6 pb-6 lg:pt-8 lg:pb-4">
        <Header
          name={projectName === "Project Management" ? projectName : `Project ${projectName}`}
          buttonComponent={
            <button
              onClick={onAddTask}
              className="flex items-center gap-2 bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          }
        />
      </div>

      {/* Tabs */}
      <div className="dark:border-stroke-dark flex flex-wrap-reverse gap-2 border-7 border-gray-200 pt-2 pb-[8px] md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3X3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex cursor-pointer items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 sm:px-2 lg:px-4 dark:text-neutral-500 dark:hover:text-white ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""}`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
