import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, Slider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '../ImageComparisonSlider';
import { CheckCircleOutline } from '@mui/icons-material';

const IMAGES = {
  DIRTY: `${process.env.PUBLIC_URL}/dirty-panels.jpg`,
  CLEAN: `${process.env.PUBLIC_URL}/clean-panels.jpg`,
};

const BenefitsSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  padding: theme.spacing(6, 0),
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  background: `linear-gradient(45deg, 
    ${theme.palette.background.default}, 
    ${theme.palette.primary.light}99
  )`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
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
  backgroundColor: selected ? theme.palette.primary.light + '10' : '#fff',
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
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
  color: '#fff',
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
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
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
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);

  const plans = [
    {
      title: "Basic",
      price: 800,
      yearlyPrice: 680,
      features: [
        "Professional cleaning service",
        "Up to 20 panels",
        "Basic maintenance check",
        "Scheduled appointments"
      ],
      popular: false
    },
    {
      title: "Standard",
      price: 1200,
      yearlyPrice: 1020,
      features: [
        "Everything in Basic",
        "Up to 30 panels",
        "Detailed inspection report",
        "Priority scheduling",
        "Performance monitoring"
      ],
      popular: true
    },
    {
      title: "Premium",
      price: 1600,
      yearlyPrice: 1360,
      features: [
        "Everything in Standard",
        "Up to 40 panels",
        "24/7 emergency support",
        "Warranty protection",
        "Annual efficiency report",
        "Panel health monitoring"
      ],
      popular: false
    }
  ];

  return (
    <BenefitsSection id="benefits">
      <ContentWrapper maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <BenefitText>{t('didYouKnow')}</BenefitText>
                <BenefitText>{t('showDifference')}</BenefitText>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ComparisonContainer>
                  <ImageComparisonSlider
                    beforeImage={IMAGES.DIRTY}
                    afterImage={IMAGES.CLEAN}
                    height={400}
                  />
                </ComparisonContainer>
                <MessageText>
                  Imagine saving hundreds on your energy bills—sounds good, right?
                </MessageText>
              </motion.div>
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
                  <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                    Save 15% with yearly subscription
                  </Typography>
                  <PricingGrid container spacing={3}>
                    {plans.map((plan) => (
                      <Grid item xs={12} md={4} key={plan.title}>
                        <PricingCard selected={plan.popular}>
                          {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
                          <Typography variant="h5" gutterBottom>
                            {plan.title}
                          </Typography>
                          <PriceAmount>
                            <span className="currency">SEK</span> {subscriptionMonths === 12 ? plan.yearlyPrice : plan.price}
                            <span className="period">/month</span>
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
                            href="#contact"
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
            </Grid>
          </Grid>
        </motion.div>
      </ContentWrapper>
    </BenefitsSection>
  );
};

export default Benefits; 