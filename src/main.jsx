import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverList from './DriverList';
import DriverReview from './DriverReview';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<DriverList />} />
        <Route path="/review/:driverId" element={<DriverReview />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
