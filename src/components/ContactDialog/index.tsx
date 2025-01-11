import React, { useState, useEffect } from 'react';
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
  styled,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Alert,
  Autocomplete
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

declare global {
  interface Window {
    google: any;
  }
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    maxWidth: 800,
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  panels: string;
  date: Date | null;
  comments: string;
  location: string;
  isResidential: boolean;
  subscriptionType: 'onetime' | 'yearly';
}

interface CustomFormData {
  name: string;
  email: string;
  phone: string;
  panels: string;
  location: string;
  installationType: string;
  projectDetails: string;
}

const CostSummary = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const CustomForm = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  selectedPlan,
  subscriptionType: initialSubscriptionType,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    panels: '',
    date: null,
    comments: '',
    location: '',
    isResidential: true,
    subscriptionType: initialSubscriptionType || 'onetime',
  });

  const [customFormData, setCustomFormData] = useState<CustomFormData>({
    name: '',
    email: '',
    phone: '',
    panels: '',
    location: '',
    installationType: '',
    projectDetails: '',
  });

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [totalCost, setTotalCost] = useState(0);
  const [currentPlan, setCurrentPlan] = useState(selectedPlan || 'Basic');

  const [addressPredictions, setAddressPredictions] = useState<string[]>([]);
  const autocompleteService = React.useRef<any>(null);

  useEffect(() => {
    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleAddressChange = async (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));

    if (!value || !autocompleteService.current) {
      setAddressPredictions([]);
      return;
    }

    try {
      const response: { predictions: PlacePrediction[] } | null = await new Promise((resolve) => {
        autocompleteService.current.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: 'se' }, // Restrict to Sweden
            types: ['address']
          },
          resolve
        );
      });

      if (response && response.predictions) {
        setAddressPredictions(response.predictions.map(place => place.description));
      }
    } catch (error) {
      console.error('Error fetching address predictions:', error);
    }
  };

  const calculatePackage = (panelCount: number) => {
    if (panelCount <= 20) return { plan: 'Basic', price: 800, yearlyPrice: 2000 };
    if (panelCount <= 30) return { plan: 'Standard', price: 1200, yearlyPrice: 3000 };
    if (panelCount <= 40) return { plan: 'Premium', price: 1600, yearlyPrice: 4000 };
    return { plan: 'Custom', price: 0, yearlyPrice: 0 };
  };

  const calculateTotalCost = () => {
    const panelCount = parseInt(formData.panels) || 0;
    const { price, yearlyPrice, plan } = calculatePackage(panelCount);
    setCurrentPlan(plan);

    if (plan === 'Custom') {
      setTotalCost(0);
      return;
    }

    let cost = formData.subscriptionType === 'yearly' ? yearlyPrice : price;
    
    // Add residential equipment fee if applicable
    if (formData.isResidential) {
      cost += 175;
    }

    setTotalCost(cost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [formData.panels, formData.isResidential, formData.subscriptionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailContent = `
        Name: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Address: ${formData.address}
        Number of Panels: ${formData.panels}
        Location: ${formData.location}
        Installation Type: ${formData.isResidential ? 'Residential' : 'Commercial'}
        Service Type: ${formData.subscriptionType}
        Preferred Date: ${formData.date?.toLocaleDateString()}
        Comments: ${formData.comments}
        Selected Plan: ${currentPlan}
        Total Cost: ${totalCost} SEK
      `;

      window.location.href = `mailto:info@hydrosol.se?subject=New Service Request - ${currentPlan} Package&body=${encodeURIComponent(emailContent)}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For custom form (>40 panels)
      const emailContent = `
        Large Installation Request

        Name: ${customFormData.name}
        Email: ${customFormData.email}
        Phone: ${customFormData.phone}
        Number of Panels: ${customFormData.panels}
        Location: ${customFormData.location}
        Installation Type: ${customFormData.installationType}
        Project Details: ${customFormData.projectDetails}
      `;

      // Using mailto for now
      window.location.href = `mailto:info@hydrosol.se?subject=Large Installation Request&body=${encodeURIComponent(emailContent)}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscriptionToggle = () => {
    setFormData(prev => ({
      ...prev,
      subscriptionType: prev.subscriptionType === 'onetime' ? 'yearly' : 'onetime'
    }));
  };

  if (showCustomForm) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
          <DialogTitle>
            <Typography variant="h5" align="center" gutterBottom>
              Large Installation Request
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary">
              For installations with more than 40 panels
            </Typography>
          </DialogTitle>
          <DialogContent>
            <CustomForm component="form" onSubmit={handleCustomSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Name"
                    name="name"
                    value={customFormData.name}
                    onChange={handleCustomFormChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={customFormData.email}
                    onChange={handleCustomFormChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    name="phone"
                    value={customFormData.phone}
                    onChange={handleCustomFormChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Number of Panels"
                    name="panels"
                    type="number"
                    value={customFormData.panels}
                    onChange={handleCustomFormChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Installation Location"
                    name="location"
                    value={customFormData.location}
                    onChange={handleCustomFormChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Installation Type"
                    name="installationType"
                    value={customFormData.installationType}
                    onChange={handleCustomFormChange}
                    margin="normal"
                    placeholder="e.g., Commercial, Industrial, Solar Farm"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Project Details"
                    name="projectDetails"
                    multiline
                    rows={4}
                    value={customFormData.projectDetails}
                    onChange={handleCustomFormChange}
                    margin="normal"
                    placeholder="Please provide any additional details about your project"
                  />
                </Grid>
              </Grid>
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Your request has been sent successfully!
                </Alert>
              )}
              {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  There was an error sending your request. Please try again.
                </Alert>
              )}
            </CustomForm>
          </DialogContent>
          <StyledDialogActions>
            <Button onClick={() => setShowCustomForm(false)} color="primary">
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCustomSubmit}
            >
              Submit Request
            </Button>
          </StyledDialogActions>
        </StyledDialog>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <DialogTitle>
          <Typography variant="h5" align="center" gutterBottom>
            Get Started with {currentPlan}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            {formData.subscriptionType === 'yearly' ? 'Yearly Subscription' : 'One-time Service'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={addressPredictions}
                  value={formData.address}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, address: newValue || '' }));
                  }}
                  onInputChange={(_, newValue) => {
                    handleAddressChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Address"
                      name="address"
                      margin="normal"
                    />
                  )}
                />
                <Typography variant="caption" color="textSecondary">
                  Start typing to search for your address in Sweden
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Number of Panels"
                  name="panels"
                  type="number"
                  value={formData.panels}
                  onChange={handleChange}
                  margin="normal"
                  helperText={currentPlan === 'Custom' ? 'Please contact us directly for more than 40 panels' : ''}
                  error={currentPlan === 'Custom'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Preferred Date"
                  value={formData.date}
                  onChange={(newValue: Date | null) => setFormData(prev => ({ ...prev, date: newValue }))}
                  sx={{ mt: 2, width: '100%' }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Installation Type</FormLabel>
                <RadioGroup
                  row
                  name="isResidential"
                  value={formData.isResidential}
                  onChange={(e) => setFormData(prev => ({ ...prev, isResidential: e.target.value === 'true' }))}
                >
                  <FormControlLabel 
                    value={true} 
                    control={<Radio />} 
                    label="Residential (Additional equipment fee: 175 SEK)" 
                  />
                  <FormControlLabel 
                    value={false} 
                    control={<Radio />} 
                    label="Commercial" 
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.subscriptionType === 'yearly'}
                    onChange={handleSubscriptionToggle}
                  />
                }
                label={formData.subscriptionType === 'yearly' ? 'Yearly Subscription' : 'One-time Service'}
              />
            </Box>

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

            <CostSummary>
              <Typography variant="h6" gutterBottom>
                Cost Summary
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Selected Package ({currentPlan}):</Typography>
                <Typography>{totalCost > 0 ? `${totalCost - (formData.isResidential ? 175 : 0)} SEK` : 'Contact us'}</Typography>
              </Box>
              {formData.isResidential && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Equipment Fee:</Typography>
                  <Typography>175 SEK</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Cost:</Typography>
                <Typography variant="h6">{totalCost > 0 ? `${totalCost} SEK` : 'Contact us'}</Typography>
              </Box>
              {formData.subscriptionType === 'yearly' && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  *Includes 3 cleanings per year
                </Typography>
              )}
            </CostSummary>
          </Box>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          {currentPlan === 'Custom' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowCustomForm(true)}
            >
              Request Large Installation
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </StyledDialogActions>
        {submitStatus === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your request has been sent successfully!
          </Alert>
        )}
        {submitStatus === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            There was an error sending your request. Please try again.
          </Alert>
        )}
      </StyledDialog>
    </LocalizationProvider>
  );
};

export default ContactDialog; 