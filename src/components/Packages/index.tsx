import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const PackagesSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  padding: theme.spacing(6, 0),
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  background: `linear-gradient(180deg,
    ${theme.palette.background.paper},
    ${theme.palette.primary.light}15,
    ${theme.palette.background.paper}
  )`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    zIndex: 0,
    backgroundImage: `radial-gradient(${theme.palette.primary.main}10 2px, transparent 2px)`,
    backgroundSize: '30px 30px',
    backgroundPosition: '-5px -5px'
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const Packages: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PackagesSection id="packages">
      <ContentWrapper maxWidth="lg">
        {/* Content moved to Benefits component */}
      </ContentWrapper>
    </PackagesSection>
  );
};

export default Packages; 