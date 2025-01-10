import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions as MuiDialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  styled
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(2),
}));

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  selectedPlan?: string;
  subscriptionType?: 'onetime' | 'yearly';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  panels: string;
  date: Date | null;
  comments: string;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  selectedPlan,
  subscriptionType,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    panels: '',
    date: null,
    comments: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <DialogTitle>
          <Typography variant="h5" align="center" gutterBottom>
            Get Started with {selectedPlan}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            {subscriptionType === 'yearly' ? 'Yearly Subscription' : 'One-time Service'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              required
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Number of Panels"
              name="panels"
              type="number"
              value={formData.panels}
              onChange={handleChange}
              margin="normal"
            />
            <DatePicker
              label="Preferred Date"
              value={formData.date}
              onChange={(newValue: Date | null) => setFormData(prev => ({ ...prev, date: newValue }))}
              sx={{ mt: 2, width: '100%' }}
            />
            <TextField
              fullWidth
              label="Additional Comments"
              name="comments"
              multiline
              rows={4}
              value={formData.comments}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </LocalizationProvider>
  );
};

export default ContactDialog; 