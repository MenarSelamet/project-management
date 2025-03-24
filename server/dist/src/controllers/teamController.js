"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeam = exports.createTeam = exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield prisma.team.findMany({
            include: {
                productOwner: true,
                projectManager: true,
                members: true,
            },
        });
        res.json(teams);
    }
    catch (error) {
        console.error("Error getting teams:", error);
        res.status(500).json({ message: "Error getting teams" });
    }
});
exports.getTeams = getTeams;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
        if (!teamName) {
            res.status(400).json({ message: "Team name is required" });
            return;
        }
        const team = yield prisma.team.create({
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
    }
    catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Error creating team" });
    }
});
exports.createTeam = createTeam;
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
        if (!teamName) {
            res.status(400).json({ message: "Team name is required" });
            return;
        }
        const team = yield prisma.team.update({
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
    }
    catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ message: "Error updating team" });
    }
});
exports.updateTeam = updateTeam;
