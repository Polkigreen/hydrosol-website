import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const PackagesSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  padding: theme.spacing(6, 0),
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
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

const PackageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-6px)',
  },
}));

const PackageContent = styled(CardContent)({
  flexGrow: 1,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const packages = ['small', 'medium', 'large', 'xlarge'];

const Packages: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PackagesSection id="packages">
      <ContentWrapper maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Typography
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
            sx={{ mb: 6 }}
          >
            {t('panelQuestion')}
          </Typography>
          <Grid container spacing={3}>
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={3} key={pkg}>
                <motion.div variants={cardVariants}>
                  <PackageCard>
                    <PackageContent>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {t(`packages.${pkg}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {t(`packages.${pkg}.description`)}
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {t(`packages.${pkg}.range`)}
                      </Typography>
                    </PackageContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="medium"
                        href="#contact"
                      >
                        Let's Book This!
                      </Button>
                    </CardActions>
                  </PackageCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </ContentWrapper>
    </PackagesSection>
  );
};

export default Packages; 