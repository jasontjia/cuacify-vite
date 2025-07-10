import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Weather from './weather';
import './index.css'; // Pastikan Tailwind terpasang

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/weather" element={<Weather />} />
    </Routes>
  </BrowserRouter>
);