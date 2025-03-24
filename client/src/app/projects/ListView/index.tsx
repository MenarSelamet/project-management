import Header from "@/components/Header";
import { Task, useGetTasksQuery } from "@/state/api";
import React, { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { Search } from "lucide-react";

type Props = {
  id: string;
};

const ListView = ({ id }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading ...</div>;
  if (error) return <div>An error occured</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          isSmallText
        />
      </div>

      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 pl-12 shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 
                   dark:text-white transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {filteredTasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {filteredTasks?.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks found matching your search
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
