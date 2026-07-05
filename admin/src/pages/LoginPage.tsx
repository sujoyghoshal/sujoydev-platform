import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { api } from '../api/client';
import { loggedIn } from '../store';
import type { RootState } from '../store';
import type { AdminUser } from '../types';

export default function LoginPage() {
  const admin = useSelector((s: RootState) => s.auth.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/auth/admin/login', { email, password });
      const payload = data.data as { accessToken: string; admin: AdminUser };
      dispatch(loggedIn({ admin: payload.admin, accessToken: payload.accessToken }));
      navigate('/');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Login failed — check the API is running';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}>
      <Card sx={{ width: 400, maxWidth: '100%' }} elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" sx={{ mt: 1 }}>
              SujoyDev Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with your administrator account
            </Typography>
          </Box>
          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}
          <form onSubmit={onSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={busy}
              sx={{ mt: 3 }}>
              {busy ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
