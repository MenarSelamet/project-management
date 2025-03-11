import { Router } from "express";
import { getTasks, createTask } from "../controllers/taskController";
import { create } from "domain";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);

export default router;
