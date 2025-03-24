import express from "express";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../controllers/teamController";

const router = express.Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.patch("/:id", updateTeam);
router.delete("/:id", deleteTeam);

export default router;
