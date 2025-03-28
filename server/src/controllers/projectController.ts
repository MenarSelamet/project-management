import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    console.log('Creating project with data:', { name, description, startDate, endDate });
    
    // Reset the sequence if needed
    await prisma.$executeRaw`SELECT setval('"Project_id_seq"', (SELECT MAX(id) FROM "Project"));`;
    
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    console.log('Project created successfully:', newProject);
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res
      .status(500)
      .json({ message: `Error creating Project: ${error.message}` });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.project.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
};
