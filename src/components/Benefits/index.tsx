import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, Slider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '../ImageComparisonSlider';
import { CheckCircleOutline } from '@mui/icons-material';
import ContactDialog from '../ContactDialog';

const IMAGES = {
  DIRTY: `${process.env.PUBLIC_URL}/dirty-panels.jpg`,
  CLEAN: `${process.env.PUBLIC_URL}/clean-panels.jpg`,
};

const BenefitsSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  padding: theme.spacing(6, 0),
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  background: `linear-gradient(to bottom, 
    ${theme.palette.background.default}, 
    ${theme.palette.background.paper}
  )`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    zIndex: 0,
    backgroundImage: `linear-gradient(${theme.palette.primary.main} 1px, transparent 1px),
                     linear-gradient(90deg, ${theme.palette.primary.main} 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const BenefitText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: '1.3rem',
  lineHeight: 1.5,
  color: theme.palette.text.primary,
}));

const ComparisonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& > div': {
    borderRadius: 0,
  }
}));

const MessageText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  textAlign: 'center',
  marginTop: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const SubMessageText = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  textAlign: 'center',
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const PricingContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
  maxWidth: '1200px',
  margin: '0 auto',
}));

const PricingGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

interface PricingCardProps {
  selected?: boolean;
  theme?: any;
}

const PricingCard = styled(Box)<PricingCardProps>(({ theme, selected }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  height: '100%',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const PopularBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  right: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  padding: theme.spacing(0.5, 2),
  borderRadius: 20,
  fontSize: '0.9rem',
  fontWeight: 600,
}));

const PriceAmount = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& .currency': {
    fontSize: '1.5rem',
    verticalAlign: 'super',
  },
  '& .period': {
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
  },
  '& .original': {
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
    textDecoration: 'line-through',
    marginRight: theme.spacing(1),
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const Feature = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.success.main,
  },
}));

const SubscriptionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 6),
  fontSize: '1.2rem',
}));

const BenefitCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const BenefitCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const BenefitCardText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

const BenefitsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(6),
}));

const SubscriptionToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  '& .MuiToggleButton-root': {
    padding: theme.spacing(1, 4),
    border: `1px solid ${theme.palette.primary.main}`,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Benefits: React.FC = () => {
  const { t } = useTranslation();
  const [subscriptionType, setSubscriptionType] = useState<'onetime' | 'yearly'>('onetime');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleSubscriptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newSubscription: 'onetime' | 'yearly',
  ) => {
    if (newSubscription !== null) {
      setSubscriptionType(newSubscription);
    }
  };

  const handleGetStarted = (planTitle: string) => {
    setSelectedPlan(planTitle);
    setDialogOpen(true);
  };

  const plans = [
    {
      title: "Basic",
      price: 800,
      yearlyPrice: 2000,
      features: subscriptionType === 'onetime' ? [
        "Professional cleaning service",
        "Up to 20 panels",
        "Basic maintenance check",
        "Performance report",
        "90-day guarantee"
      ] : [
        "3 professional cleanings per year",
        "Up to 20 panels",
        "Basic maintenance check",
        "Performance report",
        "Full year guarantee"
      ],
      popular: false
    },
    {
      title: "Standard",
      price: 1200,
      yearlyPrice: 3000,
      features: subscriptionType === 'onetime' ? [
        "Professional cleaning service",
        "Up to 30 panels",
        "Detailed inspection report",
        "Performance monitoring",
        "Priority scheduling"
      ] : [
        "3 professional cleanings per year",
        "Up to 30 panels",
        "Detailed inspection report",
        "Performance monitoring",
        "Priority scheduling"
      ],
      popular: true
    },
    {
      title: "Premium",
      price: 1600,
      yearlyPrice: 4000,
      features: subscriptionType === 'onetime' ? [
        "Professional cleaning service",
        "Up to 40 panels",
        "Comprehensive inspection",
        "24/7 emergency support",
        "Warranty protection"
      ] : [
        "3 professional cleanings per year",
        "Up to 40 panels",
        "Comprehensive inspection",
        "24/7 emergency support",
        "Warranty protection"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      title: t('Up to 30% More Efficiency'),
      description: t('Dirty solar panels can lose up to 30% of their efficiency. Regular cleaning ensures maximum energy production and return on your investment.')
    },
    {
      title: t('Extend Panel Lifespan'),
      description: t('Bird droppings, pollen, and other debris can cause permanent damage if left uncleaned. Professional cleaning helps protect your valuable investment.')
    },
    {
      title: t('Proven ROI'),
      description: t('Studies show that regular cleaning can pay for itself through increased energy production. Most customers see positive returns within the first year.')
    },
    {
      title: t('Environmental Impact'),
      description: t('Clean panels mean more green energy production. Help maximize your contribution to a sustainable future while saving money.')
    }
  ];

  return (
    <BenefitsSection id="benefits">
      <ContentWrapper maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h2" align="center" gutterBottom>
            {t('Why Clean Your Solar Panels?')}
          </Typography>
          
          <BenefitsGrid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <BenefitCard>
                    <BenefitCardTitle>
                      {benefit.title}
                    </BenefitCardTitle>
                    <BenefitCardText>
                      {benefit.description}
                    </BenefitCardText>
                  </BenefitCard>
                </motion.div>
              </Grid>
            ))}
          </BenefitsGrid>

          <ComparisonContainer>
            <ImageComparisonSlider
              beforeImage={IMAGES.DIRTY}
              afterImage={IMAGES.CLEAN}
              height={400}
            />
          </ComparisonContainer>

          <MessageText>
            {t('See the Difference Professional Cleaning Makes')}
          </MessageText>
          <SubMessageText>
            {t('Maximize your energy production with our expert cleaning service')}
          </SubMessageText>

          <motion.div variants={itemVariants}>
            <BenefitsGrid container spacing={3}>
              <Grid item xs={12} md={4}>
                <BenefitCard>
                  <BenefitCardTitle>
                    Enhanced Energy Output
                  </BenefitCardTitle>
                  <BenefitCardText>
                    Clean panels can increase energy production by up to 25%. Dirt, dust, and debris block sunlight from reaching the solar cells, reducing their efficiency. Regular cleaning ensures maximum power generation and optimal return on your investment.
                  </BenefitCardText>
                </BenefitCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <BenefitCard>
                  <BenefitCardTitle>
                    Prolonged Panel Lifespan
                  </BenefitCardTitle>
                  <BenefitCardText>
                    Regular maintenance prevents long-term damage from dirt accumulation and harsh environmental conditions. Our professional cleaning service helps protect your investment by extending the life of your solar panels and maintaining their warranty compliance.
                  </BenefitCardText>
                </BenefitCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <BenefitCard>
                  <BenefitCardTitle>
                    Eco-friendly Solution
                  </BenefitCardTitle>
                  <BenefitCardText>
                    We use environmentally safe cleaning methods and biodegradable products that are tough on dirt but gentle on your panels and the environment. By maximizing your panels' efficiency, we help reduce your carbon footprint even further.
                  </BenefitCardText>
                </BenefitCard>
              </Grid>
            </BenefitsGrid>
          </motion.div>
          <motion.div variants={itemVariants}>
            <PricingContainer>
              <Typography variant="h3" align="center" gutterBottom>
                Choose Your Plan
              </Typography>
              <SubscriptionToggle
                value={subscriptionType}
                exclusive
                onChange={handleSubscriptionChange}
                aria-label="subscription type"
                color="primary"
              >
                <ToggleButton value="onetime">
                  One-time Service
                </ToggleButton>
                <ToggleButton value="yearly">
                  Yearly Subscription
                </ToggleButton>
              </SubscriptionToggle>
              <PricingGrid container spacing={3}>
                {plans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.title}>
                    <PricingCard selected={plan.popular}>
                      {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
                      <Typography variant="h5" gutterBottom>
                        {plan.title}
                      </Typography>
                      <PriceAmount>
                        <span className="currency">SEK</span> {subscriptionType === 'yearly' ? plan.yearlyPrice : plan.price}
                        {subscriptionType === 'yearly' && <Typography variant="body2" color="textSecondary">
                          (3 cleanings per year)
                        </Typography>}
                      </PriceAmount>
                      <FeatureList>
                        {plan.features.map((feature, index) => (
                          <Feature key={index}>
                            <CheckCircleOutline />
                            <Typography>{feature}</Typography>
                          </Feature>
                        ))}
                      </FeatureList>
                      <SubscriptionButton
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => handleGetStarted(plan.title)}
                        sx={{ mt: 3 }}
                      >
                        Get Started
                      </SubscriptionButton>
                    </PricingCard>
                  </Grid>
                ))}
              </PricingGrid>
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  * All plans include our eco-friendly cleaning solution and professional service
                </Typography>
              </Box>
            </PricingContainer>
          </motion.div>
        </motion.div>
      </ContentWrapper>
      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedPlan={selectedPlan}
        subscriptionType={subscriptionType}
      />
    </BenefitsSection>
  );
};

export default Benefits; 