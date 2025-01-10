import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/hero-background.mp4)', // This will be replaced with actual video
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  zIndex: 1,
}));

const StartButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2, 6),
  fontSize: '1.2rem',
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