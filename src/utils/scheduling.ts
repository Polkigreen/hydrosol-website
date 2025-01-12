import { addMinutes, parse, format, isWithinInterval, isBefore, isAfter } from 'date-fns';
import {
  WorkingHours,
  ServiceDuration,
  TimeSlot,
  Booking,
  DEFAULT_WORKING_HOURS,
  DEFAULT_SERVICE_DURATION,
} from '../types/scheduling';

export const calculateServiceDuration = (numberOfPanels: number): number => {
  const { baseTime, perPanel, buffer } = DEFAULT_SERVICE_DURATION;
  return baseTime + (numberOfPanels * perPanel) + buffer;
};

export const isWorkingHour = (
  time: Date,
  workingHours: WorkingHours = DEFAULT_WORKING_HOURS
): boolean => {
  const timeStr = format(time, 'HH:mm');
  const start = parse(workingHours.start, 'HH:mm', new Date());
  const end = parse(workingHours.end, 'HH:mm', new Date());

  return isWithinInterval(time, { start, end });
};

export const isLunchTime = (
  time: Date,
  workingHours: WorkingHours = DEFAULT_WORKING_HOURS,
  serviceStartTime: Date
): boolean => {
  // Calculate lunch break start (3-4 hours after service start)
  const minLunchStart = addMinutes(serviceStartTime, 180); // 3 hours
  const maxLunchStart = addMinutes(serviceStartTime, 240); // 4 hours
  const lunchDuration = workingHours.lunchBreakDuration;

  // Check if the given time falls within the lunch break window
  return (
    isWithinInterval(time, {
      start: minLunchStart,
      end: addMinutes(maxLunchStart, lunchDuration),
    })
  );
};

export const calculateAvailableTimeSlots = (
  date: Date,
  existingBookings: Booking[],
  workingHours: WorkingHours = DEFAULT_WORKING_HOURS
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  let currentTime = parse(workingHours.start, 'HH:mm', date);
  const endTime = parse(workingHours.end, 'HH:mm', date);

  while (isBefore(currentTime, endTime)) {
    const slotEndTime = addMinutes(currentTime, 30); // 30-minute slots
    
    const isBooked = existingBookings.some(booking => {
      const bookingStart = parse(booking.startTime, 'HH:mm', date);
      const bookingEnd = parse(booking.endTime, 'HH:mm', date);
      return (
        isWithinInterval(currentTime, { start: bookingStart, end: bookingEnd }) ||
        isWithinInterval(slotEndTime, { start: bookingStart, end: bookingEnd })
      );
    });

    const isLunch = isLunchTime(currentTime, workingHours, parse(workingHours.start, 'HH:mm', date));

    slots.push({
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(currentTime, 'HH:mm'),
      endTime: format(slotEndTime, 'HH:mm'),
      available: !isBooked && !isLunch,
      reason: isBooked ? 'booked' : isLunch ? 'lunch' : undefined,
    });

    currentTime = slotEndTime;
  }

  return slots;
};

export const canBookTimeSlot = (
  date: Date,
  startTime: string,
  numberOfPanels: number,
  existingBookings: Booking[],
  travelTime: number // in minutes
): boolean => {
  const serviceDuration = calculateServiceDuration(numberOfPanels);
  const totalDuration = serviceDuration + travelTime;
  
  const serviceStart = parse(startTime, 'HH:mm', date);
  const serviceEnd = addMinutes(serviceStart, totalDuration);

  // Check if within working hours
  if (!isWorkingHour(serviceStart) || !isWorkingHour(serviceEnd)) {
    return false;
  }

  // Check for conflicts with existing bookings
  const hasConflict = existingBookings.some(booking => {
    const bookingStart = parse(booking.startTime, 'HH:mm', date);
    const bookingEnd = parse(booking.endTime, 'HH:mm', date);
    
    return (
      isWithinInterval(serviceStart, { start: bookingStart, end: bookingEnd }) ||
      isWithinInterval(serviceEnd, { start: bookingStart, end: bookingEnd }) ||
      (isBefore(serviceStart, bookingStart) && isAfter(serviceEnd, bookingEnd))
    );
  });

  // Check for lunch break conflict
  const hasLunchConflict = isLunchTime(serviceStart, DEFAULT_WORKING_HOURS, serviceStart) ||
    isLunchTime(serviceEnd, DEFAULT_WORKING_HOURS, serviceStart);

  return !hasConflict && !hasLunchConflict;
}; 