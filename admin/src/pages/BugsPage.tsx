import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  Chip,
  MenuItem,
  Select,
  Typography,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { api } from '../api/client';
import { BUG_STATUSES } from '../types';
import type { ApiEnvelope, BugReportRow } from '../types';

const STATUS_COLORS: Record<string, 'warning' | 'secondary' | 'success' | 'default'> = {
  Open: 'warning',
  'In Progress': 'secondary',
  Fixed: 'success',
  Closed: 'default',
};

export default function BugsPage() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['bugs'],
    queryFn: async () =>
      (await api.get<ApiEnvelope<BugReportRow[]>>('/bugs', { params: { limit: 100 } })).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/bugs/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      setToast('Status updated');
    },
    onError: () => setToast('Failed to update status'),
  });

  const columns: GridColDef<BugReportRow>[] = [
    { field: 'ticket', headerName: 'Ticket', width: 150 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 110,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={params.value === 'Urgent' || params.value === 'High' ? 'error' : 'default'}
        />
      ),
    },
    { field: 'deviceInfo', headerName: 'Device', width: 130 },
    { field: 'appVersion', headerName: 'App', width: 90 },
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
          onChange={(e) => statusMutation.mutate({ id: params.row._id, status: e.target.value as string })}
          renderValue={(v) => <Chip size="small" label={v as string} color={STATUS_COLORS[v as string]} />}>
          {BUG_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Reported',
      width: 130,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bug Reports
      </Typography>
      <Card>
        <DataGrid
          autoHeight
          rows={data?.data ?? []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Card>
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
