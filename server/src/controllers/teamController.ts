import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        productOwner: true,
        projectManager: true,
        members: true,
      },
    });

    res.json(teams);
  } catch (error) {
    console.error("Error getting teams:", error);
    res.status(500).json({ message: "Error getting teams" });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

    if (!teamName) {
      res.status(400).json({ message: "Team name is required" });
      return;
    }

    const team = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId || null,
        projectManagerUserId: projectManagerUserId || null,
      },
      include: {
        productOwner: true,
        projectManager: true,
        members: true,
      },
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Error creating team" });
  }
};

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

    if (!teamName) {
      res.status(400).json({ message: "Team name is required" });
      return;
    }

    const team = await prisma.team.update({
      where: { id: Number(id) },
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId || null,
        projectManagerUserId: projectManagerUserId || null,
      },
      include: {
        productOwner: true,
        projectManager: true,
        members: true,
      },
    });

    res.json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ message: "Error updating team" });
  }
};
