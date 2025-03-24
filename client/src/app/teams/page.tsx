"use client";
import { Team, User, useGetTeamsQuery } from "@/state/api";
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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

const EditModal = ({ open, onClose, team }: EditModalProps) => {
  if (!team) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Team: {team.teamName}</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 py-4">
          <TextField
            label="Team Name"
            defaultValue={team.teamName}
            fullWidth
          />
          <TextField
            label="Product Owner"
            defaultValue={team.productOwner?.username}
            fullWidth
          />
          <TextField
            label="Project Manager"
            defaultValue={team.projectManager?.username}
            fullWidth
          />
          <TextField
            label="Team Members"
            defaultValue={team.members?.map((m: User) => m.username).join(", ")}
            fullWidth
            multiline
            rows={3}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Save Changes
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

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  const teamsWithActions = teams.map(team => ({
    ...team,
    onEdit: (team: Team) => setEditingTeam(team),
  }));

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
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
      <EditModal
        open={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        team={editingTeam}
      />
    </div>
  );
};

export default Teams;
