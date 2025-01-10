import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, Slider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ImageComparisonSlider from '../ImageComparisonSlider';

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
  maxWidth: '800px',
  margin: '0 auto',
}));

const PricingTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontSize: '2rem',
  fontWeight: 600,
}));

const PricingOptionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const PricingOption = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  marginBottom: theme.spacing(4),
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(4),
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  '& .currency': {
    fontSize: '1.5rem',
    verticalAlign: 'super',
  },
  '& .period': {
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
  },
}));

const SubscriptionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 6),
  fontSize: '1.2rem',
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

const PANEL_OPTIONS = [
  { value: 'small', label: 'Small (1-10 panels)', basePrice: 800 },
  { value: 'medium', label: 'Medium (11-20 panels)', basePrice: 1200 },
  { value: 'large', label: 'Large (21-30 panels)', basePrice: 1600 },
  { value: 'xlarge', label: 'Extra Large (31+ panels)', basePrice: 2000 },
];

const Benefits: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState('small');
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);

  const handleSizeChange = (event: React.MouseEvent<HTMLElement>, newSize: string) => {
    if (newSize !== null) {
      setSelectedSize(newSize);
    }
  };

  const handleSubscriptionChange = (event: Event, newValue: number | number[]) => {
    setSubscriptionMonths(newValue as number);
  };

  const calculatePrice = () => {
    const basePrice = PANEL_OPTIONS.find(option => option.value === selectedSize)?.basePrice || 0;
    const discount = subscriptionMonths === 12 ? 0.15 : 0; // 15% discount for 12-month subscription
    return basePrice * (1 - discount);
  };

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
                <PricingContainer>
                  <PricingTitle>
                    We've got flexible options just for you. How many panels do you have?
                  </PricingTitle>
                  <PricingOptionsContainer>
                    <ToggleButtonGroup
                      value={selectedSize}
                      exclusive
                      onChange={handleSizeChange}
                      aria-label="panel size"
                    >
                      {PANEL_OPTIONS.map((option) => (
                        <PricingOption key={option.value} value={option.value}>
                          {option.label}
                        </PricingOption>
                      ))}
                    </ToggleButtonGroup>
                  </PricingOptionsContainer>
                  <SliderContainer>
                    <Typography gutterBottom>
                      Subscription Length: {subscriptionMonths === 1 ? 'One-time' : `${subscriptionMonths} months`}
                      {subscriptionMonths === 12 && ' (15% discount)'}
                    </Typography>
                    <Slider
                      value={subscriptionMonths}
                      onChange={handleSubscriptionChange}
                      step={null}
                      marks={[
                        { value: 1, label: 'One-time' },
                        { value: 12, label: '12 months' },
                      ]}
                      min={1}
                      max={12}
                    />
                  </SliderContainer>
                  <PriceDisplay>
                    <PriceText>
                      <span className="currency">SEK</span> {calculatePrice()}
                      <span className="period">
                        {subscriptionMonths === 1 ? '' : '/month'}
                      </span>
                    </PriceText>
                    <SubscriptionButton
                      variant="contained"
                      color="primary"
                      size="large"
                      href="#contact"
                    >
                      Get Started
                    </SubscriptionButton>
                  </PriceDisplay>
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