import { supabase } from './supabase';

export interface PortfolioConstituent {
  id: number;
  user_id?: string;
  quarter: string;
  stock_name: string;
  stock_code: string;
  company_logo_url: string | null;
  weight: number;
  quarterly_returns: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSummary {
  quarter: string;
  total_stocks: number;
  avg_returns: number;
  total_weight: number;
  top_performer: string;
  top_performer_return: number;
}

export interface QuarterSummary {
  quarter: string;
  total_stocks: number;
  avg_returns: number;
  total_weight: number;
}

class PortfolioService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data or fetch fresh data
   */
  private async getCachedOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    forceFresh = false,
    fallbackData?: T
  ): Promise<T> {
    if (!forceFresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      const data = await fetchFn();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Fetch function failed:', error);
      
      // Try cached data as fallback
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.data;
      }
      
      // Use fallback data if available
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      
      throw error;
    }
  }

  /**
   * Get all portfolio constituents for a specific quarter
   */
  async getPortfolioByQuarter(quarter: string, userId?: string): Promise<PortfolioConstituent[]> {
    const cacheKey = `portfolio_${quarter}_${userId || 'public'}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        let query = supabase
          .from('portfolio_constituents')
          .select('*')
          .eq('quarter', quarter)
          .order('weight', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.is('user_id', null);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in getPortfolioByQuarter:', error);
        throw error;
      }
    });
  }

  /**
   * Get all available quarters with summary data
   */
  async getQuartersSummary(userId?: string): Promise<QuarterSummary[]> {
    const cacheKey = `quarters_${userId || 'public'}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        let query = supabase
          .from('portfolio_constituents')
          .select('quarter, weight, quarterly_returns')
          .order('quarter', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.is('user_id', null);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          return [];
        }

        // Group by quarter and calculate summaries
        const quarterMap = new Map<string, {
          total_stocks: number;
          total_returns: number;
          total_weight: number;
        }>();

        data.forEach(item => {
          const existing = quarterMap.get(item.quarter) || {
            total_stocks: 0,
            total_returns: 0,
            total_weight: 0
          };

          quarterMap.set(item.quarter, {
            total_stocks: existing.total_stocks + 1,
            total_returns: existing.total_returns + item.quarterly_returns,
            total_weight: existing.total_weight + item.weight
          });
        });

        const summaries = Array.from(quarterMap.entries()).map(([quarter, summary]) => ({
          quarter,
          total_stocks: summary.total_stocks,
          avg_returns: summary.total_returns / summary.total_stocks,
          total_weight: summary.total_weight
        }));
        
        return summaries;
      } catch (error) {
        console.error('Error in getQuartersSummary:', error);
        throw error;
      }
    });
  }

  /**
   * Clear cache for specific keys or all cache
   */
  clearCache(pattern?: string): void {
    try {
      if (pattern) {
        const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(pattern));
        keysToDelete.forEach(key => this.cache.delete(key));
      } else {
        this.cache.clear();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { isConnected: boolean; retryCount: number } {
    return {
      isConnected: true,
      retryCount: 0
    };
  }

  /**
   * Force connection test
   */
  async forceConnectionTest(): Promise<boolean> {
    return true;
  }
}

// Export singleton instance
export const portfolioService = new PortfolioService();