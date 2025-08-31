import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Target, Lock, Star, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { mockPortfolioData } from '../data/mockPortfolioData';
import { PortfolioConstituent } from '../lib/portfolioService';

const MomentumPortfolio: React.FC = () => {
  const { user, loading: authLoading, isInitialized } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioConstituent[]>(mockPortfolioData);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2024');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const quarters = [
    { quarter: 'Q4 2024', total_stocks: 12, avg_returns: 15.2, total_weight: 100 },
    { quarter: 'Q3 2024', total_stocks: 12, avg_returns: 12.8, total_weight: 100 },
    { quarter: 'Q2 2024', total_stocks: 12, avg_returns: 18.5, total_weight: 100 },
    { quarter: 'Q1 2024', total_stocks: 12, avg_returns: 14.1, total_weight: 100 }
  ];

  useEffect(() => {
    if (isInitialized) {
      setLoading(false);
    }
  }, [isInitialized]);

  // Show limited data for non-authenticated users
  const displayData = user ? portfolioData : portfolioData.slice(0, 4);
  const isLimitedView = !user && portfolioData.length > 4;

  // Calculate portfolio metrics
  const totalWeight = portfolioData.reduce((sum, stock) => sum + stock.weight, 0);
  const avgReturns = portfolioData.length > 0 
    ? portfolioData.reduce((sum, stock) => sum + stock.quarterly_returns, 0) / portfolioData.length 
    : 0;
  const totalStocks = portfolioData.length;

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-10 bg-green-700 rounded w-64 mx-auto mb-4"></div>
                <div className="h-6 bg-green-700 rounded w-96 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading portfolio data...</p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Momentum Portfolio</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              AI-curated portfolio of high-momentum stocks with quarterly rebalancing
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stocks</p>
                <p className="text-2xl font-bold text-blue-600">{totalStocks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Returns</p>
                <p className="text-2xl font-bold text-green-600">{avgReturns.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Weight</p>
                <p className="text-2xl font-bold text-purple-600">{totalWeight.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Quarter</p>
                <p className="text-2xl font-bold text-orange-600">{selectedQuarter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quarter Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Portfolio History</h2>
              <p className="text-gray-600">Select a quarter to view historical portfolio composition</p>
            </div>
            
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <label className="text-sm font-medium text-gray-700">Quarter:</label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {quarters.map((quarter) => (
                  <option key={quarter.quarter} value={quarter.quarter}>
                    {quarter.quarter} ({quarter.total_stocks} stocks, {quarter.avg_returns.toFixed(1)}% avg return)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfolio Holdings</h2>
                <p className="text-gray-600">
                  Holdings for {selectedQuarter}
                  {user && (
                    <span className="ml-2 text-sm text-green-600">
                      • Real-time data active
                    </span>
                  )}
                  {!user && (
                    <span className="ml-2 text-sm text-orange-600">
                      • Limited preview (sign in for full access)
                    </span>
                  )}
                </p>
              </div>
              
              {isLimitedView && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm font-medium">Limited View</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarterly Returns
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((stock, index) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {stock.company_logo_url ? (
                            <img 
                              src={stock.company_logo_url} 
                              alt={`${stock.stock_code} logo`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center" style={{ display: stock.company_logo_url ? 'none' : 'flex' }}>
                            <span className="text-green-600 font-semibold text-sm">
                              {stock.stock_code.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.stock_code}</div>
                          <div className="text-sm text-gray-500">{stock.stock_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stock.weight.toFixed(2)}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(stock.weight * 4, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stock.quarterly_returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.quarterly_returns >= 0 ? '+' : ''}{stock.quarterly_returns.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {stock.quarterly_returns >= 15 ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Strong</span>
                          </div>
                        ) : stock.quarterly_returns >= 5 ? (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Good</span>
                          </div>
                        ) : stock.quarterly_returns >= 0 ? (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <span className="text-xs font-medium">Neutral</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-medium">Weak</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Limited View Overlay */}
          {isLimitedView && (
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Lock className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-800">
                    Unlock Complete Portfolio
                  </h3>
                </div>
                <p className="text-orange-700 mb-4">
                  Sign in to view all {portfolioData.length} stocks with real-time updates and detailed analytics
                </p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Complete holdings list</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-600">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Real-time performance tracking</span>
                  </div>
                </div>
                <button
                  onClick={handleAuthRequired}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Sign In to View All Holdings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MomentumPortfolio;