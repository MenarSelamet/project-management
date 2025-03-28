"use client";

import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import { use } from "react";
import ModalNewTask from "@/components/ModalNewTask";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useDeleteProjectMutation, useGetProjectsQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const Project = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const router = useRouter();
  const projectId = Number(id);
  const { data: projects } = useGetProjectsQuery();
  const project = projects?.find(p => p.id === projectId);

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      router.push("/home");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="relative min-h-screen pb-16">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
      <ProjectHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        projectName={project?.name}
        onAddTask={() => setIsModalNewTaskOpen(true)}
      />
      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <List id={id} />
      )}
      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <Table id={id} />
      )}
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-colors"
        aria-label="Delete Project"
      >
        <Trash2 size={24} />
      </button>
    </div>
  );
};

export default Project;
