import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'absolute',
}));

const LanguageButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.04)',
  },
}));

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <StyledAppBar>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <LanguageButton
          onClick={() => onLanguageChange(language === 'en' ? 'sv' : 'en')}
          startIcon={
            <span role="img" aria-label={language === 'en' ? 'English' : 'Swedish'}>
              {language === 'en' ? '🇬🇧' : '🇸🇪'}
            </span>
          }
        >
          {language === 'en' ? 'Svenska' : 'English'}
        </LanguageButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 