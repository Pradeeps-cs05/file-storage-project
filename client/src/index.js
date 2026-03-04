import React from 'react';  // Import React for building the app
import ReactDOM from 'react-dom/client';   // Import React and ReactDOM for rendering the app
import './index.css'; // Import global styles
import App from './App'; // Import the main App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);