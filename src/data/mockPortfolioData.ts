import { PortfolioConstituent } from '../lib/portfolioService';

export const mockPortfolioData: PortfolioConstituent[] = [
  {
    id: 1,
    quarter: 'Q4 2024',
    stock_name: 'Tata Consultancy Services Ltd.',
    stock_code: 'TCS',
    company_logo_url: 'https://logo.clearbit.com/tcs.com',
    weight: 8.33,
    quarterly_returns: 15.2,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 2,
    quarter: 'Q4 2024',
    stock_name: 'Reliance Industries Ltd.',
    stock_code: 'RELIANCE',
    company_logo_url: 'https://logo.clearbit.com/ril.com',
    weight: 8.33,
    quarterly_returns: 12.8,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 3,
    quarter: 'Q4 2024',
    stock_name: 'HDFC Bank Ltd.',
    stock_code: 'HDFCBANK',
    company_logo_url: 'https://logo.clearbit.com/hdfcbank.com',
    weight: 8.33,
    quarterly_returns: 18.5,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 4,
    quarter: 'Q4 2024',
    stock_name: 'Infosys Ltd.',
    stock_code: 'INFY',
    company_logo_url: 'https://logo.clearbit.com/infosys.com',
    weight: 8.33,
    quarterly_returns: 14.7,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 5,
    quarter: 'Q4 2024',
    stock_name: 'ICICI Bank Ltd.',
    stock_code: 'ICICIBANK',
    company_logo_url: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop',
    weight: 8.33,
    quarterly_returns: 16.3,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 6,
    quarter: 'Q4 2024',
    stock_name: 'Bharti Airtel Ltd.',
    stock_code: 'BHARTIARTL',
    company_logo_url: 'https://logo.clearbit.com/airtel.in',
    weight: 8.33,
    quarterly_returns: 13.9,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 7,
    quarter: 'Q4 2024',
    stock_name: 'Asian Paints Ltd.',
    stock_code: 'ASIANPAINT',
    company_logo_url: 'https://logo.clearbit.com/asianpaints.com',
    weight: 8.33,
    quarterly_returns: 11.4,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 8,
    quarter: 'Q4 2024',
    stock_name: 'Maruti Suzuki India Ltd.',
    stock_code: 'MARUTI',
    company_logo_url: 'https://logo.clearbit.com/marutisuzuki.com',
    weight: 8.33,
    quarterly_returns: 17.2,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 9,
    quarter: 'Q4 2024',
    stock_name: 'Kotak Mahindra Bank Ltd.',
    stock_code: 'KOTAKBANK',
    company_logo_url: 'https://logo.clearbit.com/kotak.com',
    weight: 8.33,
    quarterly_returns: 9.8,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 10,
    quarter: 'Q4 2024',
    stock_name: 'Larsen & Toubro Ltd.',
    stock_code: 'LT',
    company_logo_url: 'https://logo.clearbit.com/larsentoubro.com',
    weight: 8.33,
    quarterly_returns: 19.1,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 11,
    quarter: 'Q4 2024',
    stock_name: 'HCL Technologies Ltd.',
    stock_code: 'HCLTECH',
    company_logo_url: 'https://logo.clearbit.com/hcltech.com',
    weight: 8.33,
    quarterly_returns: 13.6,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 12,
    quarter: 'Q4 2024',
    stock_name: 'Titan Company Ltd.',
    stock_code: 'TITAN',
    company_logo_url: 'https://logo.clearbit.com/titan.co.in',
    weight: 8.33,
    quarterly_returns: 20.4,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  }
];

export const mockQuartersSummary = [
  { quarter: 'Q4 2024', total_stocks: 12, avg_returns: 15.2, total_weight: 100 },
  { quarter: 'Q3 2024', total_stocks: 12, avg_returns: 12.8, total_weight: 100 },
  { quarter: 'Q2 2024', total_stocks: 12, avg_returns: 18.5, total_weight: 100 },
  { quarter: 'Q1 2024', total_stocks: 12, avg_returns: 14.1, total_weight: 100 }
];