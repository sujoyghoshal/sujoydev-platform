import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { api } from '../api/client';
import { REQUEST_STATUSES } from '../types';
import type { ApiEnvelope, ProjectRequestRow } from '../types';

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'secondary' | 'error'> = {
  Pending: 'warning',
  'In Review': 'info',
  Accepted: 'success',
  'In Progress': 'secondary',
  Completed: 'success',
  Rejected: 'error',
};

export default function RequestsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<ProjectRequestRow | null>(null);
  const [toast, setToast] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['requests', search],
    queryFn: async () =>
      (
        await api.get<ApiEnvelope<ProjectRequestRow[]>>('/requests', {
          params: { limit: 100, ...(search ? { search } : {}) },
        })
      ).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/requests/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setToast('Status updated');
    },
    onError: () => setToast('Failed to update status'),
  });

  const columns: GridColDef<ProjectRequestRow>[] = [
    { field: 'ticket', headerName: 'Ticket', width: 150 },
    { field: 'name', headerName: 'Client', width: 150 },
    { field: 'projectType', headerName: 'Type', width: 130 },
    { field: 'budget', headerName: 'Budget', width: 140 },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => (
        <Chip size="small" label={params.value} color={params.value === 'Urgent' ? 'error' : 'default'} />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value}
          variant="standard"
          disableUnderline
          onChange={(e) =>
            statusMutation.mutate({ id: params.row._id, status: e.target.value as string })
          }
          renderValue={(v) => <Chip size="small" label={v as string} color={STATUS_COLORS[v as string]} />}>
          {REQUEST_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Received',
      width: 130,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5">Project Requests</Typography>
        <TextField
          size="small"
          placeholder="Search ticket, name, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Card>
        <DataGrid
          autoHeight
          rows={data?.data ?? []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          onRowClick={(params) => setDetail(params.row)}
          disableRowSelectionOnClick
        />
      </Card>

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {detail?.ticket} — {detail?.projectType}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2">Client</Typography>
          <Typography sx={{ mb: 2 }}>
            {detail?.name}
            {detail?.company ? ` (${detail.company})` : ''} · {detail?.email} · {detail?.phone}
          </Typography>
          <Typography variant="subtitle2">Budget / Timeline</Typography>
          <Typography sx={{ mb: 2 }}>
            {detail?.budget} · {detail?.timeline}
          </Typography>
          <Typography variant="subtitle2">Description</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{detail?.description}</Typography>
        </DialogContent>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
