import { Task } from "@/state/api";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Calendar, Clock, Tag, AlertCircle, User, Users } from "lucide-react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500";
      case "Work In Progress":
        return "bg-blue-500";
      case "Under Review":
        return "bg-yellow-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="group relative mb-4 overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white">
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 h-full w-1 ${getPriorityColor(task.priority)}`} />

      {/* Header Section */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {task.description || "No description provided"}
          </p>
        </div>
        {task.attachments && task.attachments.length > 0 && (
          <div className="ml-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={`https://pms3images-ms.s3.us-east-1.amazonaws.com/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName || "Task attachment"}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {task.tags && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Tag size={14} className="mr-1" />
            {task.tags}
          </div>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Calendar size={14} className="mr-1" />
          <span>Start: {task.startDate ? format(new Date(task.startDate), "MMM d") : "Not Set"}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Clock size={14} className="mr-1" />
          <span>Due: {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "Not Set"}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <User size={14} className="mr-1" />
          <span>By: {task.author ? task.author.username : "Unknown"}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Users size={14} className="mr-1" />
          <span>To: {task.assignee ? task.assignee.username : "Unassigned"}</span>
        </div>
      </div>

      {/* Priority Indicator - Bottom */}
      <div className="mt-3 flex items-center">
        <AlertCircle size={14} className="mr-1" />
        <span className={`text-sm font-medium ${getPriorityColor(task.priority).replace('bg-', 'text-')}`}>
          {task.priority || "No Priority"}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
