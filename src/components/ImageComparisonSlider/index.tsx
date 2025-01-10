import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  height: number;
}

interface SliderProps {
  sliderPosition: number;
}

const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'ew-resize',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const Image = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
});

const Slider = styled(Box)<SliderProps>(({ sliderPosition }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: `${sliderPosition}%`,
  width: '4px',
  backgroundColor: '#fff',
  cursor: 'ew-resize',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
}));

const ImageOverlay = styled(Box)<{ width: number }>(({ width }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: `${100 - width}%`,
  overflow: 'hidden',
}));

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  height,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(newPosition);
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <SliderContainer
      height={height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <Image src={beforeImage} alt="Before cleaning" />
      <ImageOverlay width={sliderPosition}>
        <Image src={afterImage} alt="After cleaning" />
      </ImageOverlay>
      <Slider sliderPosition={sliderPosition} />
    </SliderContainer>
  );
};

export default ImageComparisonSlider; 