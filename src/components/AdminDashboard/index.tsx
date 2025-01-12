import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  styled,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

import { Booking } from '../../types/scheduling';
import { bookingService } from '../../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  minWidth: 100,
}));

interface AdminDashboardProps {
  onEdit: (booking: Booking) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onEdit,
}) => {
  const theme = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalBookings: number;
    completedBookings: number;
    totalDistance: number;
    totalRevenue: number;
  } | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await bookingService.getDailyStats(format(selectedDate, 'yyyy-MM-dd'));
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [selectedDate]);

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await bookingService.updateBooking(bookingId, { status: newStatus });
      fetchBookings(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(bookingId);
      fetchBookings(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCost = (cost: number) => `${cost} SEK`;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StyledPaper>
        <Typography variant="h5" gutterBottom>
          Today's Schedule
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    {booking.startTime} - {booking.endTime}
                  </TableCell>
                  <TableCell>
                    {booking.customer.firstName} {booking.customer.lastName}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {booking.customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.address}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {booking.travelDistance}km ({Math.round(booking.travelTime)}min travel)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.numberOfPanels} panels
                    <Typography variant="caption" display="block" color="textSecondary">
                      {booking.serviceType === 'YEARLY' ? 'Yearly' : 'One-time'}
                      {booking.isResidential ? ' | Residential' : ' | Commercial'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      onClick={() => handleStatusChange(booking.id, booking.status)}
                    />
                  </TableCell>
                  <TableCell>{formatCost(booking.totalCost)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(booking)}
                      disabled={booking.status === 'COMPLETED' || booking.status === 'CANCELLED'}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(booking.id)}
                      disabled={booking.status === 'COMPLETED'}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {booking.status === 'PENDING' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    {booking.status === 'PENDING' && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {stats && (
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" color="textSecondary">
                Total Bookings Today
              </Typography>
              <Typography variant="h4">
                {stats.totalBookings}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" color="textSecondary">
                Completed
              </Typography>
              <Typography variant="h4">
                {stats.completedBookings}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" color="textSecondary">
                Total Distance
              </Typography>
              <Typography variant="h4">
                {Math.round(stats.totalDistance)} km
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" color="textSecondary">
                Total Revenue
              </Typography>
              <Typography variant="h4">
                {formatCost(stats.totalRevenue)}
              </Typography>
            </Grid>
          </Grid>
        </StyledPaper>
      )}
    </Box>
  );
};

export default AdminDashboard; 