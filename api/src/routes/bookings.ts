import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true
      }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...req.body,
        status: 'PENDING'
      },
      include: {
        customer: true
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        customer: true
      }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Get booking statistics
router.get('/stats/daily', async (req, res) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
      }
    });

    const stats = {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
      totalDistance: bookings.reduce((acc, b) => acc + b.travelDistance, 0),
      totalRevenue: bookings.reduce((acc, b) => acc + b.totalCost, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
});

export const bookingRouter = router; 