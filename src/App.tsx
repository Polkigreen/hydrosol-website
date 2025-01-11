import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Packages from './components/Packages';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './App.css';
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Header language={language} onLanguageChange={handleLanguageChange} />
          <main>
            <Hero />
            <Benefits />
            <Packages />
            <Reviews />
            <Contact />
          </main>
          <SpeedInsights />
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
