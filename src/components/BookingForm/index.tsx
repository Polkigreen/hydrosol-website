import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  styled,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

import SchedulingCalendar from '../SchedulingCalendar';
import {
  TimeSlot,
  Booking,
  ServiceType,
  DEFAULT_SERVICE_DURATION,
  TRAVEL_COST_PER_10KM,
} from '../../types/scheduling';
import AddressInput from '../AddressInput';
import { bookingService, customerService, CreateBookingData, CreateCustomerData } from '../../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const CostSummary = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

interface BookingFormProps {
  onSubmit: (bookingData: Booking) => void;
  existingBookings: Booking[];
  initialServiceType?: ServiceType;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  numberOfPanels: string;
  isResidential: boolean;
  serviceType: ServiceType;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  existingBookings,
  initialServiceType = 'ONETIME',
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
    numberOfPanels: '',
    isResidential: true,
    serviceType: initialServiceType,
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [travelTime, setTravelTime] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    calculateCosts();
  }, [formData.numberOfPanels, formData.isResidential, formData.serviceType, travelDistance]);

  const calculateCosts = () => {
    const panels = parseInt(formData.numberOfPanels) || 0;
    let cost = 0;

    // Base cost calculation
    if (panels <= 20) {
      cost = formData.serviceType === 'YEARLY' ? 2000 : 800;
    } else if (panels <= 30) {
      cost = formData.serviceType === 'YEARLY' ? 3000 : 1200;
    } else if (panels <= 40) {
      cost = formData.serviceType === 'YEARLY' ? 4000 : 1600;
    }

    // Add residential equipment fee if applicable
    if (formData.isResidential) {
      cost += 175;
    }

    // Add travel costs
    const travelCost = Math.ceil(travelDistance / 10) * TRAVEL_COST_PER_10KM;
    cost += travelCost;

    setTotalCost(cost);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSlotSelect = (date: Date, timeSlot: TimeSlot) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
  };

  const handleAddressChange = (
    address: string,
    location: { lat: number; lng: number },
    distance: number,
    duration: number
  ) => {
    setFormData(prev => ({
      ...prev,
      address,
      location,
    }));
    setTravelDistance(distance);
    setTravelTime(duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!selectedTimeSlot || !selectedDate) {
        setError('Please select a time slot');
        return;
      }

      if (!formData.address || !formData.location.lat || !formData.location.lng) {
        setError('Please enter a valid address');
        return;
      }

      // Create customer first
      const customerData: CreateCustomerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      };

      const customer = await customerService.createCustomer(customerData);

      // Then create booking
      const bookingData: CreateBookingData = {
        customerId: customer.id,
        serviceType: formData.serviceType,
        numberOfPanels: parseInt(formData.numberOfPanels),
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        address: formData.address,
        location: formData.location,
        travelDistance,
        travelTime,
        isResidential: formData.isResidential,
        totalCost,
      };

      const booking = await bookingService.createBooking(bookingData);
      onSubmit(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <StyledPaper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <AddressInput
              value={formData.address}
              onChange={handleAddressChange}
              error={Boolean(error && !formData.address)}
              helperText={error && !formData.address ? 'Address is required' : undefined}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Service Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Number of Panels"
              name="numberOfPanels"
              type="number"
              value={formData.numberOfPanels}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 40 }}
              helperText="Maximum 40 panels"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.serviceType === 'YEARLY'}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      serviceType: e.target.checked ? 'YEARLY' : 'ONETIME'
                    }))
                  }
                />
              }
              label="Yearly Subscription"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isResidential}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      isResidential: e.target.checked
                    }))
                  }
                />
              }
              label="Residential Installation"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Select Date and Time
        </Typography>
        <SchedulingCalendar
          existingBookings={existingBookings}
          onTimeSlotSelect={handleTimeSlotSelect}
          numberOfPanels={parseInt(formData.numberOfPanels) || 0}
          travelTime={travelTime}
        />
      </StyledPaper>

      <CostSummary>
        <Typography variant="h6" gutterBottom>
          Cost Summary
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography>Service Cost:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right">
              {totalCost - (formData.isResidential ? 175 : 0) - (Math.ceil(travelDistance / 10) * TRAVEL_COST_PER_10KM)} SEK
            </Typography>
          </Grid>
          {formData.isResidential && (
            <>
              <Grid item xs={6}>
                <Typography>Equipment Fee:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">175 SEK</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={6}>
            <Typography>Travel Cost:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right">
              {Math.ceil(travelDistance / 10) * TRAVEL_COST_PER_10KM} SEK
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" align="right">
              {totalCost} SEK
            </Typography>
          </Grid>
        </Grid>
      </CostSummary>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ minWidth: 200 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Book Now'}
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm; 