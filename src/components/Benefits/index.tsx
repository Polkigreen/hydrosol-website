import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
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

const SubscriptionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& .currency': {
    fontSize: '1.5rem',
    verticalAlign: 'super',
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

const Benefits: React.FC = () => {
  const { t } = useTranslation();

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
                <SubMessageText>
                  Curious? Let's explore your options!
                </SubMessageText>
              </motion.div>
              <motion.div variants={itemVariants}>
                <SubscriptionContainer>
                  <Typography variant="h4" gutterBottom>
                    Monthly Subscription
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Professional solar panel cleaning service
                  </Typography>
                  <PriceText>
                    <span className="currency">SEK</span> 800
                    <Typography variant="subtitle1" color="text.secondary" component="span">
                      /month
                    </Typography>
                  </PriceText>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Regular maintenance to keep your panels at peak efficiency
                  </Typography>
                  <SubscriptionButton
                    variant="contained"
                    color="primary"
                    size="large"
                    href="#contact"
                  >
                    Get Started
                  </SubscriptionButton>
                </SubscriptionContainer>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </ContentWrapper>
    </BenefitsSection>
  );
};

export default Benefits; 