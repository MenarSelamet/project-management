"use client";
import { Project, useGetProjectsQuery } from "@/state/api";
import React from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardMedia,
  Grid, 
  Skeleton,
  Pagination,
} from "@mui/material";
import { CalendarRange, Users } from "lucide-react";
import { format } from "date-fns";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();

  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardMedia
        component="img"
        height="140"
        image={project.imageUrl || "https://source.unsplash.com/random/800x600/?project,work"}
        alt={project.name}
        className="h-[140px] object-cover"
      />
      <CardHeader
        title={project.name}
        className="pb-2"
      />
      <CardContent>
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 h-12">
            {project.description || "No description provided"}
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarRange className="h-4 w-4" />
            <span className="text-sm">
              {project.startDate 
                ? `${format(new Date(project.startDate), 'MMM d, yyyy')} - ${project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'Ongoing'}`
                : 'No dates set'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {project.teams?.length || 0} teams assigned
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingProjectCard = () => (
  <Card className="h-full">
    <Skeleton 
      variant="rectangular" 
      height={140}
      className="w-full"
    />
    <CardHeader
      title={<Skeleton variant="text" width="60%" />}
      className="pb-2"
    />
    <CardContent>
      <div className="flex flex-col gap-3">
        <Skeleton variant="text" height={48} />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width="40%" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading } = useGetProjectsQuery();
  const [page, setPage] = React.useState(1);
  const projectsPerPage = 6;

  const addProjectButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push("/projects/new")}
      className="h-10"
    >
      Add Project
    </Button>
  );

  // Calculate pagination
  const totalPages = projects ? Math.ceil(projects.length / projectsPerPage) : 0;
  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects?.slice(startIndex, endIndex);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Header 
        name="Projects" 
        buttonComponent={addProjectButton}
      />

      <Grid container spacing={3}>
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <LoadingProjectCard />
            </Grid>
          ))
        ) : currentProjects?.length ? (
          currentProjects.map((project) => (
            <Grid item xs={12} md={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            No projects found. Click &quot;Add Project&quot; to create one.
          </div>
        )}
      </Grid>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </div>
      )}
    </div>
  );
}
