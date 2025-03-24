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
exports.deleteTeam = exports.updateTeam = exports.createTeam = exports.getTeams = void 0;
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
        // Validate that users exist if IDs are provided
        if (productOwnerUserId) {
            const productOwner = yield prisma.user.findUnique({
                where: { userId: productOwnerUserId },
            });
            if (!productOwner) {
                res.status(400).json({ message: "Product owner not found" });
                return;
            }
        }
        if (projectManagerUserId) {
            const projectManager = yield prisma.user.findUnique({
                where: { userId: projectManagerUserId },
            });
            if (!projectManager) {
                res.status(400).json({ message: "Project manager not found" });
                return;
            }
        }
        const team = yield prisma.team.create({
            data: Object.assign(Object.assign({ teamName }, (productOwnerUserId ? { productOwnerUserId } : {})), (projectManagerUserId ? { projectManagerUserId } : {})),
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
        // Validate that users exist if IDs are provided
        if (productOwnerUserId) {
            const productOwner = yield prisma.user.findUnique({
                where: { userId: productOwnerUserId },
            });
            if (!productOwner) {
                res.status(400).json({ message: "Product owner not found" });
                return;
            }
        }
        if (projectManagerUserId) {
            const projectManager = yield prisma.user.findUnique({
                where: { userId: projectManagerUserId },
            });
            if (!projectManager) {
                res.status(400).json({ message: "Project manager not found" });
                return;
            }
        }
        const team = yield prisma.team.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign({ teamName }, (productOwnerUserId !== undefined ? { productOwnerUserId } : {})), (projectManagerUserId !== undefined ? { projectManagerUserId } : {})),
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
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const team = yield prisma.team.delete({
            where: { id: Number(id) },
        });
        res.json(team);
    }
    catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: "Error deleting team" });
    }
});
exports.deleteTeam = deleteTeam;
