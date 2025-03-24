import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData() {
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
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    console.log(`Cleared data from ${table}`);
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  await deleteAllData();

  // First create users without team references
  const userData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "user.json"), "utf-8"));
  const userMap = new Map(); // Map to store username to userId mapping
  
  for (const data of userData) {
    const { teamId, ...userWithoutTeam } = data;
    const user = await prisma.user.create({ 
      data: userWithoutTeam,
      select: { userId: true, username: true }
    });
    userMap.set(user.username, user.userId);
    console.log(`Created user: ${user.username} with ID: ${user.userId}`);
  }

  // Create teams with correct user references
  const teamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"));
  const teamMap = new Map(); // Map to store teamName to teamId mapping
  
  for (const data of teamData) {
    const { teamName } = data;
    const team = await prisma.team.create({ 
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
      await prisma.team.update({
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
      const user = await prisma.user.findUnique({
        where: { username: data.username }
      });
      
      if (user) {
        const team = teamData[data.teamId - 1];
        if (team) {
          await prisma.user.update({
            where: { userId: user.userId },
            data: { teamId: teamMap.get(team.teamName) }
          });
          console.log(`Updated user ${data.username} with team ${team.teamName}`);
        }
      }
    }
  }

  // Create projects
  const projectData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "project.json"), "utf-8"));
  const projectMap = new Map(); // Map to store project name to id mapping
  
  for (const data of projectData) {
    const project = await prisma.project.create({ data });
    projectMap.set(project.name, project.id);
    console.log(`Created project: ${project.name}`);
  }

  // Create project teams with correct references
  const projectTeamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "projectTeam.json"), "utf-8"));
  for (const data of projectTeamData) {
    const { id, teamId, projectId } = data;
    const team = teamData[teamId - 1];
    const project = projectData[projectId - 1];
    
    if (team && project) {
      await prisma.projectTeam.create({
        data: {
          teamId: teamMap.get(team.teamName),
          projectId: projectMap.get(project.name)
        }
      });
      console.log(`Created project team link between ${team.teamName} and ${project.name}`);
    }
  }

  // Create tasks with correct references
  const taskData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "task.json"), "utf-8"));
  const taskMap = new Map(); // Map to store task title to id mapping
  
  for (const data of taskData) {
    const { authorUserId, assignedUserId, projectId, ...taskWithoutRefs } = data;
    const author = userData[authorUserId - 1];
    const assignee = assignedUserId ? userData[assignedUserId - 1] : null;
    const project = projectData[projectId - 1];
    
    if (author && project) {
      const task = await prisma.task.create({
        data: {
          ...taskWithoutRefs,
          authorUserId: userMap.get(author.username),
          assignedUserId: assignee ? userMap.get(assignee.username) : null,
          projectId: projectMap.get(project.name)
        }
      });
      taskMap.set(task.title, task.id);
      console.log(`Created task: ${task.title}`);
    }
  }

  // Create task assignments with correct references
  const taskAssignmentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "taskAssignment.json"), "utf-8"));
  for (const data of taskAssignmentData) {
    const { userId, taskId } = data;
    const user = userData[userId - 1];
    const task = taskData[taskId - 1];
    
    if (user && task) {
      await prisma.taskAssignment.create({
        data: {
          userId: userMap.get(user.username),
          taskId: taskMap.get(task.title)
        }
      });
      console.log(`Created task assignment for ${user.username} on task ${task.title}`);
    }
  }

  // Create attachments with correct references
  const attachmentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "attachment.json"), "utf-8"));
  for (const data of attachmentData) {
    const { uploadedById, taskId, ...attachmentWithoutRefs } = data;
    const uploader = userData[uploadedById - 1];
    const task = taskData[taskId - 1];
    
    if (uploader && task) {
      await prisma.attachment.create({
        data: {
          ...attachmentWithoutRefs,
          uploadedById: userMap.get(uploader.username),
          taskId: taskMap.get(task.title)
        }
      });
      console.log(`Created attachment for task ${task.title}`);
    }
  }

  // Create comments with correct references
  const commentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "comment.json"), "utf-8"));
  for (const data of commentData) {
    const { userId, taskId, ...commentWithoutRefs } = data;
    const user = userData[userId - 1];
    const task = taskData[taskId - 1];
    
    if (user && task) {
      await prisma.comment.create({
        data: {
          ...commentWithoutRefs,
          userId: userMap.get(user.username),
          taskId: taskMap.get(task.title)
        }
      });
      console.log(`Created comment by ${user.username} on task ${task.title}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
