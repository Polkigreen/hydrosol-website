import React, { useState, useEffect } from 'react';
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
  touchAction: 'none',
  '&:hover': {
    '& .slider-handle': {
      transform: 'scale(1.1)',
    }
  },
  '&::before': {
    content: '"Before"',
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  '&::after': {
    content: '"After"',
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    zIndex: 2,
  }
}));

const Image = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  pointerEvents: 'none',
});

const Slider = styled(Box)<SliderProps>(({ sliderPosition }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: `${sliderPosition}%`,
  width: '4px',
  backgroundColor: '#fff',
  cursor: 'ew-resize',
  transition: 'transform 0.2s ease',
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
    transition: 'transform 0.2s ease',
  },
  '&:hover::before': {
    transform: 'translate(-50%, -50%) scale(1.1)',
  }
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
  const [sliderPosition, setSliderPosition] = useState(65);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(newPosition);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.currentTarget);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX, e.currentTarget);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <SliderContainer
      height={height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <Image src={beforeImage} alt="Before cleaning" />
      <ImageOverlay width={sliderPosition}>
        <Image src={afterImage} alt="After cleaning" />
      </ImageOverlay>
      <Slider sliderPosition={sliderPosition} className="slider-handle" />
    </SliderContainer>
  );
};

export default ImageComparisonSlider; 