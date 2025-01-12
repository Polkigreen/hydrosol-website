import React, { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  styled,
} from '@mui/material';
import { debounce } from 'lodash';

const KALMAR_LOCATION = {
  lat: 56.6634447,
  lng: 16.3561765,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  width: '100%',
  marginTop: theme.spacing(1),
  boxShadow: theme.shadows[3],
}));

interface AddressInputProps {
  value: string;
  onChange: (address: string, location: { lat: number; lng: number }, distance: number, duration: number) => void;
  error?: boolean;
  helperText?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const distanceMatrixService = useRef<google.maps.DistanceMatrixService | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      distanceMatrixService.current = new window.google.maps.DistanceMatrixService();
      
      // Create a dummy div for PlacesService (required)
      const dummyElement = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyElement);
    }
  }, []);

  const getPlaceDetails = async (placeId: string): Promise<google.maps.places.PlaceResult> => {
    return new Promise((resolve, reject) => {
      if (!placesService.current) {
        reject(new Error('Places service not initialized'));
        return;
      }

      placesService.current.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry'],
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error('Failed to get place details'));
          }
        }
      );
    });
  };

  const calculateDistance = async (destination: google.maps.LatLng): Promise<{distance: number; duration: number}> => {
    return new Promise((resolve, reject) => {
      if (!distanceMatrixService.current) {
        reject(new Error('Distance Matrix service not initialized'));
        return;
      }

      distanceMatrixService.current.getDistanceMatrix(
        {
          origins: [KALMAR_LOCATION],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK' && response) {
            const distance = response.rows[0].elements[0].distance.value / 1000; // Convert to kilometers
            const duration = response.rows[0].elements[0].duration.value / 60; // Convert to minutes
            resolve({ distance, duration });
          } else {
            reject(new Error('Failed to calculate distance'));
          }
        }
      );
    });
  };

  const fetchPredictions = debounce(async (input: string) => {
    if (!input || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    try {
      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.current!.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'se' },
            types: ['address'],
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions);
            } else {
              reject(status);
            }
          }
        );
      });

      setPredictions(response);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, { lat: 0, lng: 0 }, 0, 0); // Reset location and distance
    fetchPredictions(newValue);
  };

  const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    setIsLoading(true);
    try {
      const placeDetails = await getPlaceDetails(prediction.place_id);
      if (placeDetails.geometry?.location && placeDetails.formatted_address) {
        const { distance, duration } = await calculateDistance(placeDetails.geometry.location);
        onChange(
          placeDetails.formatted_address,
          {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng(),
          },
          distance,
          duration
        );
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setIsLoading(false);
      setPredictions([]);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        label="Address"
        value={value}
        onChange={handleInputChange}
        error={error}
        helperText={helperText}
        disabled={isLoading}
      />
      {predictions.length > 0 && (
        <StyledPaper>
          <List>
            {predictions.map((prediction) => (
              <ListItem
                key={prediction.place_id}
                button
                onClick={() => handlePredictionSelect(prediction)}
              >
                <ListItemText primary={prediction.description} />
              </ListItem>
            ))}
          </List>
        </StyledPaper>
      )}
    </Box>
  );
};

export default AddressInput; 