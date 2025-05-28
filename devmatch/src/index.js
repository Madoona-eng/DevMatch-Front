import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     //to send the propse 
  
  <React.StrictMode>
    <BrowserRouter>
    <App />
      </BrowserRouter>
  </React.StrictMode>
  
);


reportWebVitals();
