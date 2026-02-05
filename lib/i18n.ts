
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "Breaking News": "Breaking News",
            "Latest Updates": "Latest Updates",
            "Admin Panel": "Admin Panel",
            "Login": "Login",
            "Logout": "Logout",
            "Upload News": "Upload News",
            "Title": "Title",
            "Category": "Category",
            "Language": "Language",
            "Media": "Media",
            "Submit": "Submit",
            "Just Now": "Just Now",
            "Read More": "Read More",
            "Trending": "Trending",
            "Switch Language": "Switch Language",
            "Dashboard": "Dashboard"
        }
    },
    ta: {
        translation: {
            "Breaking News": "முக்கிய செய்திகள்",
            "Latest Updates": "சமீபத்திய செய்திகள்",
            "Admin Panel": "நிர்வாக குழு",
            "Login": "உள்நுழைய",
            "Logout": "வெளியேறு",
            "Upload News": "செய்திகளை பதிவேற்றவும்",
            "Title": "தலைப்பு",
            "Category": "வகை",
            "Language": "மொழி",
            "Media": "ஊடகம்",
            "Submit": "சமர்ப்பிக்கவும்",
            "Just Now": "இப்போதுதான்",
            "Read More": "மேலும் படிக்க",
            "Trending": "டிரெண்டிங்",
            "Switch Language": "மொழியை மாற்றவும்",
            "Dashboard": "டாஷ்போர்டு"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
