"use client";
import { Team, User, useGetTeamsQuery, useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { 
  Autocomplete,
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  CircularProgress
} from "@mui/material";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  team?: Team | null;
  mode: 'create' | 'edit';
}

const TeamModal = ({ open, onClose, team, mode }: TeamModalProps) => {
  const isCreate = mode === 'create';
  const title = isCreate ? 'Create New Team' : `Edit Team: ${team?.teamName}`;
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  
  const [teamName, setTeamName] = React.useState(team?.teamName || '');
  const [productOwner, setProductOwner] = React.useState<User | null>(team?.productOwner || null);
  const [projectManager, setProjectManager] = React.useState<User | null>(team?.projectManager || null);
  const [teamMembers, setTeamMembers] = React.useState<User[]>(team?.members || []);

  React.useEffect(() => {
    if (team) {
      setTeamName(team.teamName);
      setProductOwner(team.productOwner || null);
      setProjectManager(team.projectManager || null);
      setTeamMembers(team.members || []);
    }
  }, [team]);

  if (!users) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 py-4">
          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            fullWidth
            placeholder="Enter team name"
          />
          <Autocomplete
            options={users}
            getOptionLabel={(user) => user.username}
            value={productOwner}
            onChange={(_, newValue) => setProductOwner(newValue)}
            loading={isLoadingUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product Owner"
                placeholder="Select product owner"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoadingUsers ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Autocomplete
            options={users}
            getOptionLabel={(user) => user.username}
            value={projectManager}
            onChange={(_, newValue) => setProjectManager(newValue)}
            loading={isLoadingUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project Manager"
                placeholder="Select project manager"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoadingUsers ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(user) => user.username}
            value={teamMembers}
            onChange={(_, newValue) => setTeamMembers(newValue)}
            loading={isLoadingUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Team Members"
                placeholder="Select team members"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoadingUsers ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          {isCreate ? 'Create Team' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface TeamWithActions extends Team {
  onEdit: (team: Team) => void;
}

const columns: GridColDef<TeamWithActions>[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { 
    field: "productOwner",
    headerName: "Product Owner",
    width: 200,
    valueGetter: (params) => {
      if (!params?.row) return "Not Assigned";
      const team = params.row as TeamWithActions;
      return team.productOwner?.username || "Not Assigned";
    },
  },
  {
    field: "projectManager",
    headerName: "Project Manager",
    width: 200,
    valueGetter: (params) => {
      if (!params?.row) return "Not Assigned";
      const team = params.row as TeamWithActions;
      return team.projectManager?.username || "Not Assigned";
    },
  },
  {
    field: "members",
    headerName: "Team Members",
    width: 300,
    valueGetter: (params) => {
      if (!params?.row) return "No members";
      const team = params.row as TeamWithActions;
      return team.members?.map((member: User) => member.username).join(", ") || "No members";
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => {
      if (!params?.row) return null;
      const team = params.row as TeamWithActions;
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            team.onEdit(team);
          }}
        >
          Edit
        </Button>
      );
    },
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [editingTeam, setEditingTeam] = React.useState<Team | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  const teamsWithActions = teams.map(team => ({
    ...team,
    onEdit: (team: Team) => setEditingTeam(team),
  }));

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center justify-between mb-6">
        <Header name="Teams" />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10"
        >
          Create Team
        </Button>
      </div>
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid<TeamWithActions>
          rows={teamsWithActions}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
      <TeamModal
        open={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        team={editingTeam}
        mode="edit"
      />
      <TeamModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
    </div>
  );
};

export default Teams;
