import React from 'react';
import { Box, Typography, Container, Card, CardContent, Rating, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ReviewsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.default,
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const ReviewAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  fontSize: '2rem',
  fontWeight: 'bold',
}));

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

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('');
};

const getAvatarColor = (index: number) => {
  const colors = ['#2196f3', '#4caf50', '#f44336'];
  return colors[index % colors.length];
};

// Mock reviews data with initials instead of images
const mockReviews = [
  {
    id: 1,
    name: 'Erik Andersson',
    rating: 5,
    comment: 'Professional service and amazing results! My solar panels are performing better than ever.',
  },
  {
    id: 2,
    name: 'Maria Johansson',
    rating: 5,
    comment: 'Very satisfied with the cleaning service. The team was punctual and efficient.',
  },
  {
    id: 3,
    name: 'Lars Nilsson',
    rating: 5,
    comment: 'Great value for money. I can see a significant improvement in my energy production.',
  },
];

const Reviews: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ReviewsSection id="reviews">
      <Container maxWidth="lg">
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
            {t('reviews.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {mockReviews.map((review, index) => (
              <motion.div key={review.id} variants={cardVariants}>
                <ReviewCard>
                  <ReviewAvatar
                    sx={{ bgcolor: getAvatarColor(index) }}
                  >
                    {getInitials(review.name)}
                  </ReviewAvatar>
                  <Typography variant="h6" gutterBottom>
                    {review.name}
                  </Typography>
                  <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    "{review.comment}"
                  </Typography>
                </ReviewCard>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </ReviewsSection>
  );
};

export default Reviews; 