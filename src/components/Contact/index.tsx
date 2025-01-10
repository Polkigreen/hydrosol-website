import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Phone, Email, LocationOn } from '@mui/icons-material';

const ContactSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper}, 
    ${theme.palette.primary.light}10
  )`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    zIndex: 0,
    backgroundImage: `radial-gradient(${theme.palette.primary.main}10 2px, transparent 2px)`,
    backgroundSize: '30px 30px',
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: '2rem',
  },
}));

const ContactText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: theme.palette.text.secondary,
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

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ContactSection id="contact">
      <ContentWrapper maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Typography variant="h3" align="center" gutterBottom color="primary">
            Contact Us
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom color="textSecondary">
            Have questions? We're here to help!
          </Typography>
          <Box sx={{ mt: 6 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <ContactInfo>
                    <Phone />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Phone
                      </Typography>
                      <ContactText>
                        +46 123 456 789
                      </ContactText>
                    </Box>
                  </ContactInfo>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <ContactInfo>
                    <Email />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Email
                      </Typography>
                      <ContactText>
                        info@hydrosol.com
                      </ContactText>
                    </Box>
                  </ContactInfo>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <ContactInfo>
                    <LocationOn />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Location
                      </Typography>
                      <ContactText>
                        Stockholm, Sweden
                      </ContactText>
                    </Box>
                  </ContactInfo>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </ContentWrapper>
    </ContactSection>
  );
};

export default Contact; 