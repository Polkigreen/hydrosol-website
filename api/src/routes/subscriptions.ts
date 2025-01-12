import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: req.params.id }
    });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create new subscription
router.post('/', async (req, res) => {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        ...req.body,
        isActive: true
      }
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription
router.put('/:id', async (req, res) => {
  try {
    const subscription = await prisma.subscription.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Cancel subscription
router.post('/:id/cancel', async (req, res) => {
  try {
    const subscription = await prisma.subscription.update({
      where: { id: req.params.id },
      data: {
        isActive: false,
        endDate: new Date()
      }
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get customer's active subscription
router.get('/customer/:customerId', async (req, res) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        customerId: req.params.customerId,
        isActive: true
      }
    });
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer subscription' });
  }
});

export const subscriptionRouter = router; 