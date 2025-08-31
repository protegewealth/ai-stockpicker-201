import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StockTable from '../components/StockTable';
import Footer from '../components/Footer';
import { mockStockData } from '../data/mockData';

const HomePage: React.FC = () => {
  const [stocks, setStocks] = useState(mockStockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <main className="container mx-auto px-4 py-8">
        <StockTable stocks={stocks} loading={loading} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;