"use client";
import { Team, User, useGetTeamsQuery, useGetUsersQuery, useCreateTeamMutation, useUpdateTeamMutation, useDeleteTeamMutation } from "@/state/api";
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
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Pencil, Trash } from "lucide-react";

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
  const { data: users } = useGetUsersQuery();
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  
  const [teamName, setTeamName] = React.useState(team?.teamName || '');
  const [productOwner, setProductOwner] = React.useState<User | null>(team?.productOwner || null);
  const [projectManager, setProjectManager] = React.useState<User | null>(team?.projectManager || null);
  const [teamMembers, setTeamMembers] = React.useState<User[]>(team?.members || []);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (team) {
      setTeamName(team.teamName);
      setProductOwner(team.productOwner || null);
      setProjectManager(team.projectManager || null);
      setTeamMembers(team.members || []);
    } else {
      setTeamName('');
      setProductOwner(null);
      setProjectManager(null);
      setTeamMembers([]);
    }
    setError(null);
  }, [team]);

  const handleSubmit = async () => {
    try {
      if (!teamName.trim()) {
        setError('Team name is required');
        return;
      }

      const teamData: Partial<Team> = {
        teamName: teamName.trim(),
        productOwnerUserId: productOwner?.userId || undefined,
        projectManagerUserId: projectManager?.userId || undefined,
      };

      console.log('Submitting team data:', teamData);

      if (isCreate) {
        const result = await createTeam(teamData).unwrap();
        console.log('Create team result:', result);
      } else if (team?.id) {
        const result = await updateTeam({ id: team.id, team: teamData }).unwrap();
        console.log('Update team result:', result);
      }

      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      console.error('Error details:', err);
      setError(err?.data?.message || 'Failed to save team. Please try again.');
    }
  };

  if (!users) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-4">
          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            error={!!error && !teamName.trim()}
            helperText={error && !teamName.trim() ? error : ''}
            fullWidth
          />
          <Autocomplete
            options={users}
            value={productOwner}
            onChange={(_, newValue) => setProductOwner(newValue)}
            getOptionLabel={(option) => option.username}
            renderInput={(params) => (
              <TextField {...params} label="Product Owner" />
            )}
            fullWidth
          />
          <Autocomplete
            options={users}
            value={projectManager}
            onChange={(_, newValue) => setProjectManager(newValue)}
            getOptionLabel={(option) => option.username}
            renderInput={(params) => (
              <TextField {...params} label="Project Manager" />
            )}
            fullWidth
          />
          <Autocomplete
            multiple
            options={users}
            value={teamMembers}
            onChange={(_, newValue) => setTeamMembers(newValue)}
            getOptionLabel={(option) => option.username}
            renderInput={(params) => (
              <TextField {...params} label="Team Members" />
            )}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <CircularProgress size={24} />
          ) : isCreate ? (
            'Create Team'
          ) : (
            'Update Team'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface TeamWithActions extends Team {
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

const columns: GridColDef<TeamWithActions>[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { 
    field: "productOwner",
    headerName: "Product Owner",
    width: 200,
    valueGetter: (params: { row: TeamWithActions }) => {
      const team = params.row;
      return team?.productOwner?.username || "Not Assigned";
    },
  },
  {
    field: "projectManager",
    headerName: "Project Manager",
    width: 200,
    valueGetter: (params: { row: TeamWithActions }) => {
      const team = params.row;
      return team?.projectManager?.username || "Not Assigned";
    },
  },
  {
    field: "members",
    headerName: "Team Members",
    width: 300,
    valueGetter: (params: { row: TeamWithActions }) => {
      const team = params.row;
      return team?.members?.map((member: User) => member.username).join(", ") || "No members";
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: { row: TeamWithActions }) => {
      const team = params.row;
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          <Tooltip title="Edit Team">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                team.onEdit(team);
              }}
              sx={{ padding: '4px' }}
            >
              <Pencil className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Team">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                team.onDelete(team);
              }}
              sx={{ padding: '4px', marginLeft: '8px' }}
            >
              <Trash className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [editingTeam, setEditingTeam] = React.useState<Team | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [deleteTeam] = useDeleteTeamMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [teamToDelete, setTeamToDelete] = React.useState<Team | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  const handleDelete = async (team: Team) => {
    setTeamToDelete(team);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (teamToDelete) {
      try {
        await deleteTeam(teamToDelete.id);
        setShowDeleteConfirm(false);
        setTeamToDelete(null);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const teamsWithActions = teams.map(team => ({
    ...team,
    onEdit: (team: Team) => setEditingTeam(team),
    onDelete: (team: Team) => handleDelete(team),
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
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            Are you sure you want to delete team &quot;{teamToDelete?.teamName}&quot;? This action cannot be undone.
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Teams;
