import { Router } from "express";
import { getProjects, createProject, deleteProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);

export default router;
