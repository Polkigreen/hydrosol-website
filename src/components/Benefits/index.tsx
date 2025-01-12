import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { ServiceType } from '../../types/scheduling';
import ContactDialog from '../ContactDialog';

interface Plan {
  title: string;
  subtitle: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

const Benefits = (): JSX.Element => {
  const [subscriptionType, setSubscriptionType] = useState<ServiceType>('ONETIME');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPanelCount, setSelectedPanelCount] = useState<number>(0);

  const handleSubscriptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newSubscription: ServiceType | null,
  ) => {
    if (newSubscription !== null) {
      setSubscriptionType(newSubscription);
    }
  };

  const handleGetStarted = (plan: Plan) => {
    let panelCount = 0;
    switch (plan.title) {
      case 'Basic':
        panelCount = 20;
        break;
      case 'Standard':
        panelCount = 30;
        break;
      case 'Premium':
        panelCount = 40;
        break;
    }
    setSelectedPanelCount(panelCount);
    setDialogOpen(true);
  };

  const plans: Plan[] = [
    {
      title: 'Basic',
      subtitle: 'Up to 20 panels',
      price: 800,
      yearlyPrice: 2000,
      features: subscriptionType === 'ONETIME' ? [
        'One-time cleaning service',
        'Performance check',
        'Detailed report',
        'Maintenance recommendations',
      ] : [
        '3 cleanings per year',
        'Regular performance monitoring',
        'Priority scheduling',
        'Annual maintenance report',
      ],
      popular: false,
    },
    {
      title: 'Standard',
      subtitle: '21-30 panels',
      price: 1200,
      yearlyPrice: 3000,
      features: subscriptionType === 'ONETIME' ? [
        'One-time cleaning service',
        'Performance check',
        'Detailed report',
        'Maintenance recommendations',
        'Extended inspection',
      ] : [
        '3 cleanings per year',
        'Regular performance monitoring',
        'Priority scheduling',
        'Annual maintenance report',
        'Quarterly performance analysis',
      ],
      popular: true,
    },
    {
      title: 'Premium',
      subtitle: '31-40 panels',
      price: 1600,
      yearlyPrice: 4000,
      features: subscriptionType === 'ONETIME' ? [
        'One-time cleaning service',
        'Performance check',
        'Detailed report',
        'Maintenance recommendations',
        'Extended inspection',
        'Emergency support',
      ] : [
        '3 cleanings per year',
        'Regular performance monitoring',
        'Priority scheduling',
        'Annual maintenance report',
        'Monthly performance analysis',
        '24/7 emergency support',
      ],
      popular: false,
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={subscriptionType}
          exclusive
          onChange={handleSubscriptionChange}
          aria-label="subscription type"
        >
          <ToggleButton value="ONETIME">
            One-time Service
          </ToggleButton>
          <ToggleButton value="YEARLY">
            Yearly Subscription
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {plan.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {plan.subtitle}
                </Typography>
                <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                  <span className="currency">SEK</span> {subscriptionType === 'YEARLY' ? plan.yearlyPrice : plan.price}
                </Typography>
                {subscriptionType === 'YEARLY' && (
                  <Typography variant="body2" color="textSecondary">
                    *Includes 3 cleanings per year
                  </Typography>
                )}
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon>
                        <CheckCircleOutline color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleGetStarted(plan)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialPanelCount={selectedPanelCount}
        initialSubscriptionType={subscriptionType}
      />
    </Box>
  );
};

export default Benefits; 