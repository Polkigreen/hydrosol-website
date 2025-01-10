import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Hi there! Welcome to HydroSol – Your Solar Panels Deserve the Best!",
      startConversation: "Start the Conversation",
      didYouKnow: "Did you know dirty solar panels can lose up to 25% of their efficiency?",
      showDifference: "Let me show you the difference!",
      savingsBenefit: "Imagine saving hundreds on your energy bills—sounds good, right?",
      exploreOptions: "Curious? Let's explore your options!",
      panelQuestion: "We've got flexible options just for you. How many panels do you have?",
      packages: {
        small: {
          title: "Small",
          description: "Perfect for small homes.",
          range: "up to 20 panels"
        },
        medium: {
          title: "Medium",
          description: "The popular choice for most families.",
          range: "up to 30 panels"
        },
        large: {
          title: "Large",
          description: "Ideal for larger properties.",
          range: "up to 40 panels"
        },
        xlarge: {
          title: "Extra Large",
          description: "For maximum solar savings.",
          range: "up to 50 panels"
        }
      },
      whyProfessional: {
        question: "Why do I need professional cleaning?",
        answer: "Because rainwater isn't enough to remove dirt, pollen, and bird droppings!"
      },
      cleaningFrequency: {
        question: "How often should I clean my panels?",
        answer: "Twice a year is best to keep them performing at their peak!"
      },
      reviews: {
        title: "Don't just take our word for it!"
      },
      contact: {
        start: "Let's get started! Tell us about yourself.",
        submit: "Let's Make It Shine!",
        fields: {
          name: "Name",
          email: "Email",
          phone: "Phone Number",
          panels: "Number of Panels",
          date: "Preferred Date",
          comments: "Additional Comments"
        }
      }
    }
  },
  sv: {
    translation: {
      welcome: "Hej! Välkommen till HydroSol – Dags att ge dina solpaneler den bästa vården!",
      startConversation: "Starta Konversationen",
      didYouKnow: "Visste du att smutsiga solpaneler kan förlora upp till 25 % av sin effektivitet?",
      showDifference: "Låt mig visa skillnaden!",
      savingsBenefit: "Tänk dig att spara hundratals kronor på elräkningen—låter bra, eller hur?",
      exploreOptions: "Nyfiken? Låt oss utforska dina alternativ!",
      panelQuestion: "Vi har flexibla alternativ för dig. Hur många paneler har du?",
      packages: {
        small: {
          title: "Liten",
          description: "Perfekt för små hem.",
          range: "upp till 20 paneler"
        },
        medium: {
          title: "Mellan",
          description: "Det populära valet för de flesta familjer.",
          range: "upp till 30 paneler"
        },
        large: {
          title: "Stor",
          description: "Idealisk för större fastigheter.",
          range: "upp till 40 paneler"
        },
        xlarge: {
          title: "Extra Stor",
          description: "För maximala solbesparingar.",
          range: "upp till 50 paneler"
        }
      },
      whyProfessional: {
        question: "Varför behöver jag professionell rengöring?",
        answer: "För att regnvatten inte räcker för att ta bort smuts, pollen och fågelspillning!"
      },
      cleaningFrequency: {
        question: "Hur ofta bör jag rengöra mina paneler?",
        answer: "Två gånger om året är bäst för att hålla dem i toppform!"
      },
      reviews: {
        title: "Lita inte bara på vårt ord!"
      },
      contact: {
        start: "Låt oss börja! Berätta lite om dig själv.",
        submit: "Låt oss få det att glänsa!",
        fields: {
          name: "Namn",
          email: "E-post",
          phone: "Telefonnummer",
          panels: "Antal Paneler",
          date: "Önskat Datum",
          comments: "Ytterligare Kommentarer"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 