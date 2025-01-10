import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Box)(({ theme }) => ({
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.light}15, 
    ${theme.palette.background.paper}80,
    ${theme.palette.primary.light}20
  )`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/hero-background.mp4)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    zIndex: -1,
    backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.palette.primary.main}15 1px, transparent 0)`,
    backgroundSize: '40px 40px',
  }
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  zIndex: 1,
}));

const StartButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
}));

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('benefits');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer>
      <ContentContainer maxWidth="md">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          {t('welcome')}
        </Typography>
        <StartButton
          variant="contained"
          color="primary"
          onClick={scrollToNextSection}
          size="large"
        >
          {t('startConversation')}
        </StartButton>
      </ContentContainer>
    </HeroContainer>
  );
};

export default Hero; 