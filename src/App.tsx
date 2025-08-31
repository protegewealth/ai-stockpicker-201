import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import MomentumPortfolio from './pages/MomentumPortfolio';
import BacktestHistory from './pages/BacktestHistory';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/backtest" element={<BacktestHistory />} />
          <Route path="/momentum" element={<MomentumPortfolio />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;