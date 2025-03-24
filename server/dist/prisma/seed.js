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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        const tables = [
            'Comment',
            'Attachment',
            'TaskAssignment',
            'Task',
            'ProjectTeam',
            'Project',
            'User',
            'Team'
        ];
        for (const table of tables) {
            yield prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
            console.log(`Cleared data from ${table}`);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData");
        yield deleteAllData();
        // First create users without team references
        const userData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "user.json"), "utf-8"));
        const userMap = new Map(); // Map to store username to userId mapping
        for (const data of userData) {
            const { teamId } = data, userWithoutTeam = __rest(data, ["teamId"]);
            const user = yield prisma.user.create({
                data: userWithoutTeam,
                select: { userId: true, username: true }
            });
            userMap.set(user.username, user.userId);
            console.log(`Created user: ${user.username} with ID: ${user.userId}`);
        }
        // Create teams with correct user references
        const teamData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "team.json"), "utf-8"));
        const teamMap = new Map(); // Map to store teamName to teamId mapping
        for (const data of teamData) {
            const { teamName } = data;
            const team = yield prisma.team.create({
                data: {
                    teamName,
                    // Leave these null initially
                    productOwnerUserId: null,
                    projectManagerUserId: null
                },
                select: { id: true, teamName: true }
            });
            teamMap.set(team.teamName, team.id);
            console.log(`Created team: ${team.teamName}`);
        }
        // Update teams with user references
        for (const data of teamData) {
            const { teamName, productOwnerUserId, projectManagerUserId } = data;
            const teamId = teamMap.get(teamName);
            // Get the actual user IDs from our database
            const productOwner = userData[productOwnerUserId - 1];
            const projectManager = userData[projectManagerUserId - 1];
            if (productOwner && projectManager) {
                yield prisma.team.update({
                    where: { id: teamId },
                    data: {
                        productOwnerUserId: userMap.get(productOwner.username),
                        projectManagerUserId: userMap.get(projectManager.username)
                    }
                });
                console.log(`Updated team ${teamName} with product owner and project manager`);
            }
        }
        // Update users with team references
        for (const data of userData) {
            if (data.teamId) {
                const user = yield prisma.user.findUnique({
                    where: { username: data.username }
                });
                if (user) {
                    const team = teamData[data.teamId - 1];
                    if (team) {
                        yield prisma.user.update({
                            where: { userId: user.userId },
                            data: { teamId: teamMap.get(team.teamName) }
                        });
                        console.log(`Updated user ${data.username} with team ${team.teamName}`);
                    }
                }
            }
        }
        // Create projects
        const projectData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "project.json"), "utf-8"));
        const projectMap = new Map(); // Map to store project name to id mapping
        for (const data of projectData) {
            const project = yield prisma.project.create({ data });
            projectMap.set(project.name, project.id);
            console.log(`Created project: ${project.name}`);
        }
        // Create project teams with correct references
        const projectTeamData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "projectTeam.json"), "utf-8"));
        for (const data of projectTeamData) {
            const { id, teamId, projectId } = data;
            const team = teamData[teamId - 1];
            const project = projectData[projectId - 1];
            if (team && project) {
                yield prisma.projectTeam.create({
                    data: {
                        teamId: teamMap.get(team.teamName),
                        projectId: projectMap.get(project.name)
                    }
                });
                console.log(`Created project team link between ${team.teamName} and ${project.name}`);
            }
        }
        // Create tasks with correct references
        const taskData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "task.json"), "utf-8"));
        const taskMap = new Map(); // Map to store task title to id mapping
        for (const data of taskData) {
            const { authorUserId, assignedUserId, projectId } = data, taskWithoutRefs = __rest(data, ["authorUserId", "assignedUserId", "projectId"]);
            const author = userData[authorUserId - 1];
            const assignee = assignedUserId ? userData[assignedUserId - 1] : null;
            const project = projectData[projectId - 1];
            if (author && project) {
                const task = yield prisma.task.create({
                    data: Object.assign(Object.assign({}, taskWithoutRefs), { authorUserId: userMap.get(author.username), assignedUserId: assignee ? userMap.get(assignee.username) : null, projectId: projectMap.get(project.name) })
                });
                taskMap.set(task.title, task.id);
                console.log(`Created task: ${task.title}`);
            }
        }
        // Create task assignments with correct references
        const taskAssignmentData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "taskAssignment.json"), "utf-8"));
        for (const data of taskAssignmentData) {
            const { userId, taskId } = data;
            const user = userData[userId - 1];
            const task = taskData[taskId - 1];
            if (user && task) {
                yield prisma.taskAssignment.create({
                    data: {
                        userId: userMap.get(user.username),
                        taskId: taskMap.get(task.title)
                    }
                });
                console.log(`Created task assignment for ${user.username} on task ${task.title}`);
            }
        }
        // Create attachments with correct references
        const attachmentData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "attachment.json"), "utf-8"));
        for (const data of attachmentData) {
            const { uploadedById, taskId } = data, attachmentWithoutRefs = __rest(data, ["uploadedById", "taskId"]);
            const uploader = userData[uploadedById - 1];
            const task = taskData[taskId - 1];
            if (uploader && task) {
                yield prisma.attachment.create({
                    data: Object.assign(Object.assign({}, attachmentWithoutRefs), { uploadedById: userMap.get(uploader.username), taskId: taskMap.get(task.title) })
                });
                console.log(`Created attachment for task ${task.title}`);
            }
        }
        // Create comments with correct references
        const commentData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dataDirectory, "comment.json"), "utf-8"));
        for (const data of commentData) {
            const { userId, taskId } = data, commentWithoutRefs = __rest(data, ["userId", "taskId"]);
            const user = userData[userId - 1];
            const task = taskData[taskId - 1];
            if (user && task) {
                yield prisma.comment.create({
                    data: Object.assign(Object.assign({}, commentWithoutRefs), { userId: userMap.get(user.username), taskId: taskMap.get(task.title) })
                });
                console.log(`Created comment by ${user.username} on task ${task.title}`);
            }
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
