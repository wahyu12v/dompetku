// ============================================================
// index.js — React entry point
// ============================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Styles — order matters: globals → layout → components → pages
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/responsive.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
