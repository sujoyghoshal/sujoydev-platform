import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Grid, Typography, Skeleton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { BarChart } from '@mui/x-charts/BarChart';
import { api } from '../api/client';
import type { ApiEnvelope, ProjectRequestRow, BugReportRow } from '../types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  loading: boolean;
}

function StatCard({ title, value, icon, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={32} />
          ) : (
            <Typography variant="h5">{value}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const requestsQuery = useQuery({
    queryKey: ['requests', 'dashboard'],
    queryFn: async () =>
      (await api.get<ApiEnvelope<ProjectRequestRow[]>>('/requests', { params: { limit: 100 } })).data,
  });
  const bugsQuery = useQuery({
    queryKey: ['bugs', 'dashboard'],
    queryFn: async () =>
      (await api.get<ApiEnvelope<BugReportRow[]>>('/bugs', { params: { limit: 100 } })).data,
  });

  const requests = requestsQuery.data?.data ?? [];
  const bugs = bugsQuery.data?.data ?? [];
  const loading = requestsQuery.isLoading || bugsQuery.isLoading;

  const pending = requests.filter((r) => r.status === 'Pending' || r.status === 'In Review').length;
  const completed = requests.filter((r) => r.status === 'Completed').length;

  const byType = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.projectType] = (acc[r.projectType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Requests" value={requestsQuery.data?.meta?.total ?? requests.length} icon={<AssignmentIcon fontSize="large" />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending Review" value={pending} icon={<PendingActionsIcon fontSize="large" />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed" value={completed} icon={<DoneAllIcon fontSize="large" />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Open Bugs" value={bugs.filter((b) => b.status === 'Open').length} icon={<BugReportIcon fontSize="large" />} loading={loading} />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Requests by Project Type
              </Typography>
              {Object.keys(byType).length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                  No requests yet — they'll appear as clients submit from the app.
                </Typography>
              ) : (
                <BarChart
                  height={300}
                  xAxis={[{ data: Object.keys(byType), scaleType: 'band' }]}
                  series={[{ data: Object.values(byType), label: 'Requests' }]}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Requests
              </Typography>
              {requests.slice(0, 6).map((r) => (
                <Box key={r._id} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {r.ticket} — {r.projectType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.name} · {r.status} · {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
              {!loading && requests.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  Nothing yet.
                </Typography>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
