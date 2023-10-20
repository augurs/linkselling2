import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/skin-modes.css'
import './assets/css/style.css'
import './assets/css/icons.css'
import 'react-toastify/dist/ReactToastify.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import '@popperjs/core/dist/umd/popper.min.js';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';


const root = ReactDOM.createRoot(document.getElementById('root'));


i18n.init({
  interpolation: { escapeValue: false },
  lng: 'pl',
  resources: {
    en: {
      translation: require('./locales/en.json'),
    },
    pl: {
      translation: require('./locales/pl.json'),
    },
  },
});

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
