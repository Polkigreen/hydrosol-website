import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  styled,
  useTheme,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, isBefore, isAfter, startOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';

import {
  TimeSlot,
  Booking,
  DEFAULT_WORKING_HOURS,
} from '../../types/scheduling';
import {
  calculateAvailableTimeSlots,
  canBookTimeSlot,
} from '../../utils/scheduling';

const TimeSlotButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '&.unavailable': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
  },
}));

const TimeGrid = styled(Grid)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

interface SchedulingCalendarProps {
  existingBookings: Booking[];
  onTimeSlotSelect: (date: Date, timeSlot: TimeSlot) => void;
  numberOfPanels: number;
  travelTime: number;
}

const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({
  existingBookings,
  onTimeSlotSelect,
  numberOfPanels,
  travelTime,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Calculate minimum date (14 days from now)
  const minDate = addDays(startOfDay(new Date()), 14);
  // Calculate maximum date (end of October)
  const maxDate = new Date(new Date().getFullYear(), 9, 31); // Month is 0-based, so 9 is October

  useEffect(() => {
    if (selectedDate) {
      const slots = calculateAvailableTimeSlots(
        selectedDate,
        existingBookings,
        DEFAULT_WORKING_HOURS
      );
      setAvailableSlots(slots);
    }
  }, [selectedDate, existingBookings]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      const slotDate = new Date(timeSlot.date + 'T' + timeSlot.startTime);
      if (canBookTimeSlot(slotDate, timeSlot.startTime, numberOfPanels, existingBookings, travelTime)) {
        onTimeSlotSelect(slotDate, timeSlot);
      }
    }
  };

  const shouldDisableDate = (date: Date) => {
    // Disable dates before minimum date
    if (isBefore(date, minDate)) return true;
    
    // Disable dates after maximum date
    if (isAfter(date, maxDate)) return true;
    
    // Disable weekends
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sv}>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
              minDate={minDate}
              maxDate={maxDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Available Times
            </Typography>
            <TimeGrid container>
              {availableSlots.map((slot, index) => (
                <Grid item xs={12} key={index}>
                  <TimeSlotButton
                    variant={slot.available ? 'outlined' : 'text'}
                    onClick={() => handleTimeSlotClick(slot)}
                    className={!slot.available ? 'unavailable' : ''}
                    disabled={!slot.available}
                  >
                    {slot.startTime} - {slot.endTime}
                    {slot.reason && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        ({slot.reason})
                      </Typography>
                    )}
                  </TimeSlotButton>
                </Grid>
              ))}
            </TimeGrid>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default SchedulingCalendar; 